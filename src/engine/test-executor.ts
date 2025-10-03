/**
 * PHẦN 3: CONCURRENT EXECUTION ENGINE
 * Test Executor
 * Thực thi test cases với concurrent support
 */

import { Page } from '@playwright/test';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../core/config';
import { WorkerPool, WorkerTask } from './worker-pool';

export interface TestCase {
  id: string;
  name: string;
  priority: number;
  execute: (page: Page) => Promise<void>;
}

export interface TestResult {
  testId: string;
  name: string;
  success: boolean;
  error?: Error;
  duration: number;
  retries: number;
}

export class TestExecutor {
  private workerPool: WorkerPool;
  private logger: Logger;
  private config: ConfigManager;
  private testResults: Map<string, TestResult> = new Map();
  
  constructor(maxWorkers?: number) {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.workerPool = new WorkerPool(maxWorkers);
  }
  
  /**
   * Add test case
   */
  addTest(testCase: TestCase): void {
    this.logger.info(`Test added: ${testCase.name}`);
    // Tests will be added to worker pool later
  }
  
  /**
   * Execute single test with retry logic
   */
  async executeTest(testCase: TestCase, page: Page): Promise<TestResult> {
    const maxRetries = this.config.getConfig().execution.retries;
    let lastError: Error | undefined;
    let retries = 0;
    
    this.logger.info(`Executing test: ${testCase.name}`);
    const startTime = Date.now();
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await testCase.execute(page);
        
        const result: TestResult = {
          testId: testCase.id,
          name: testCase.name,
          success: true,
          duration: Date.now() - startTime,
          retries: attempt,
        };
        
        this.testResults.set(testCase.id, result);
        this.logger.info(`Test passed: ${testCase.name} (${result.duration}ms)`);
        return result;
        
      } catch (error) {
        lastError = error as Error;
        retries = attempt;
        
        if (attempt < maxRetries) {
          this.logger.warn(`Test failed, retry ${attempt + 1}/${maxRetries}: ${testCase.name}`);
          await this.sleep(1000); // Wait before retry
        }
      }
    }
    
    const result: TestResult = {
      testId: testCase.id,
      name: testCase.name,
      success: false,
      error: lastError,
      duration: Date.now() - startTime,
      retries,
    };
    
    this.testResults.set(testCase.id, result);
    this.logger.error(`Test failed after ${maxRetries} retries: ${testCase.name}`, lastError);
    return result;
  }
  
  /**
   * Execute tests concurrently
   */
  async executeConcurrent(testCases: TestCase[], pageFactory: () => Promise<Page>): Promise<TestResult[]> {
    this.logger.info(`Executing ${testCases.length} tests concurrently`);
    
    // Convert test cases to worker tasks
    const tasks: WorkerTask<TestResult>[] = testCases.map((testCase) => ({
      id: testCase.id,
      priority: testCase.priority,
      execute: async () => {
        const page = await pageFactory();
        try {
          return await this.executeTest(testCase, page);
        } finally {
          await page.close();
        }
      },
    }));
    
    // Add tasks to worker pool
    tasks.forEach((task) => this.workerPool.addTask(task));
    
    // Execute all tasks
    const workerResults = await this.workerPool.executeAll();
    
    // Extract test results
    const results = workerResults
      .filter((r) => r.success && r.result)
      .map((r) => r.result as TestResult);
    
    return results;
  }
  
  /**
   * Get test results
   */
  getResults(): TestResult[] {
    return Array.from(this.testResults.values());
  }
  
  /**
   * Get passed tests
   */
  getPassedTests(): TestResult[] {
    return this.getResults().filter((r) => r.success);
  }
  
  /**
   * Get failed tests
   */
  getFailedTests(): TestResult[] {
    return this.getResults().filter((r) => !r.success);
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    totalDuration: number;
  } {
    const results = this.getResults();
    const passed = this.getPassedTests();
    const failed = this.getFailedTests();
    
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    const passRate = results.length > 0 ? (passed.length / results.length) * 100 : 0;
    
    return {
      total: results.length,
      passed: passed.length,
      failed: failed.length,
      passRate,
      totalDuration,
    };
  }
  
  /**
   * Sleep utility
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
