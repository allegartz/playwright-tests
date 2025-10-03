/**
 * PHẦN 3: CONCURRENT EXECUTION ENGINE
 * Worker Pool Manager
 * Quản lý worker pool cho parallel test execution
 */

import { Logger } from '../utils/logger';
import { ConfigManager } from '../core/config';

export interface WorkerTask<T = any> {
  id: string;
  priority: number;
  execute: () => Promise<T>;
}

export interface WorkerResult<T = any> {
  taskId: string;
  success: boolean;
  result?: T;
  error?: Error;
  duration: number;
}

export class WorkerPool {
  private maxWorkers: number;
  private activeWorkers: number = 0;
  private taskQueue: WorkerTask[] = [];
  private results: Map<string, WorkerResult> = new Map();
  private logger: Logger;
  
  constructor(maxWorkers?: number) {
    this.logger = Logger.getInstance();
    const config = ConfigManager.getInstance().getConfig();
    this.maxWorkers = maxWorkers || config.execution.maxWorkers;
    
    this.logger.info(`Worker Pool initialized with ${this.maxWorkers} workers`);
  }
  
  /**
   * Add task to queue
   */
  addTask<T>(task: WorkerTask<T>): void {
    this.taskQueue.push(task);
    this.logger.debug(`Task added to queue: ${task.id}, priority: ${task.priority}`);
    
    // Sort by priority (higher priority first)
    this.taskQueue.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Execute all tasks in queue
   */
  async executeAll(): Promise<WorkerResult[]> {
    this.logger.info(`Starting execution of ${this.taskQueue.length} tasks`);
    
    const promises: Promise<void>[] = [];
    
    // Start workers
    for (let i = 0; i < this.maxWorkers && this.taskQueue.length > 0; i++) {
      promises.push(this.workerLoop());
    }
    
    // Wait for all workers to complete
    await Promise.all(promises);
    
    this.logger.info('All tasks completed');
    return Array.from(this.results.values());
  }
  
  /**
   * Worker loop - process tasks from queue
   */
  private async workerLoop(): Promise<void> {
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (!task) break;
      
      this.activeWorkers++;
      this.logger.debug(`Worker processing task: ${task.id}`);
      
      const startTime = Date.now();
      let result: WorkerResult;
      
      try {
        const taskResult = await task.execute();
        result = {
          taskId: task.id,
          success: true,
          result: taskResult,
          duration: Date.now() - startTime,
        };
        this.logger.info(`Task completed: ${task.id} (${result.duration}ms)`);
      } catch (error) {
        result = {
          taskId: task.id,
          success: false,
          error: error as Error,
          duration: Date.now() - startTime,
        };
        this.logger.error(`Task failed: ${task.id}`, error as Error);
      }
      
      this.results.set(task.id, result);
      this.activeWorkers--;
    }
  }
  
  /**
   * Get results
   */
  getResults(): WorkerResult[] {
    return Array.from(this.results.values());
  }
  
  /**
   * Get successful results
   */
  getSuccessfulResults(): WorkerResult[] {
    return Array.from(this.results.values()).filter((r) => r.success);
  }
  
  /**
   * Get failed results
   */
  getFailedResults(): WorkerResult[] {
    return Array.from(this.results.values()).filter((r) => !r.success);
  }
  
  /**
   * Clear queue and results
   */
  clear(): void {
    this.taskQueue = [];
    this.results.clear();
    this.logger.debug('Worker pool cleared');
  }
  
  /**
   * Get statistics
   */
  getStats(): {
    total: number;
    successful: number;
    failed: number;
    averageDuration: number;
  } {
    const results = this.getResults();
    const successful = this.getSuccessfulResults();
    const failed = this.getFailedResults();
    
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    const averageDuration = results.length > 0 ? totalDuration / results.length : 0;
    
    return {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      averageDuration,
    };
  }
}
