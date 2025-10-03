/**
 * PHẦN 5: COORDINATION WITH MAIN FLOW
 * Flow Coordinator
 * Điều phối flow chính và watchers
 */

import { Page } from '@playwright/test';
import { Logger } from '../utils/logger';
import { WatcherManager } from '../watchers/watcher-manager';
import { ConfigManager } from '../core/config';

export interface FlowStep {
  name: string;
  action: (page: Page) => Promise<void>;
  validation?: (page: Page) => Promise<boolean>;
  onError?: (error: Error) => Promise<void>;
}

export interface FlowResult {
  success: boolean;
  completedSteps: string[];
  failedStep?: string;
  error?: Error;
  duration: number;
  watcherSummary?: Record<string, any>;
}

export class FlowCoordinator {
  private page: Page;
  private watcherManager: WatcherManager;
  private logger: Logger;
  private config: ConfigManager;
  private steps: FlowStep[] = [];
  
  constructor(page: Page, watcherManager: WatcherManager) {
    this.page = page;
    this.watcherManager = watcherManager;
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
  }
  
  /**
   * Add step to flow
   */
  addStep(step: FlowStep): void {
    this.steps.push(step);
    this.logger.debug(`Added step: ${step.name}`);
  }
  
  /**
   * Execute flow with watchers
   */
  async execute(): Promise<FlowResult> {
    this.logger.info('Starting flow execution');
    const startTime = Date.now();
    const completedSteps: string[] = [];
    
    // Start watchers
    await this.watcherManager.startAll();
    
    try {
      for (const step of this.steps) {
        this.logger.info(`Executing step: ${step.name}`);
        
        try {
          // Execute step action
          await step.action(this.page);
          
          // Validate if validation function provided
          if (step.validation) {
            const isValid = await step.validation(this.page);
            if (!isValid) {
              throw new Error(`Validation failed for step: ${step.name}`);
            }
          }
          
          completedSteps.push(step.name);
          this.logger.info(`Step completed: ${step.name}`);
          
        } catch (error) {
          this.logger.error(`Step failed: ${step.name}`, error as Error);
          
          // Call error handler if provided
          if (step.onError) {
            await step.onError(error as Error);
          }
          
          // Stop watchers
          await this.watcherManager.stopAll();
          
          return {
            success: false,
            completedSteps,
            failedStep: step.name,
            error: error as Error,
            duration: Date.now() - startTime,
            watcherSummary: this.watcherManager.getSummary(),
          };
        }
      }
      
      // Stop watchers
      await this.watcherManager.stopAll();
      
      return {
        success: true,
        completedSteps,
        duration: Date.now() - startTime,
        watcherSummary: this.watcherManager.getSummary(),
      };
      
    } catch (error) {
      await this.watcherManager.stopAll();
      
      return {
        success: false,
        completedSteps,
        error: error as Error,
        duration: Date.now() - startTime,
        watcherSummary: this.watcherManager.getSummary(),
      };
    }
  }
  
  /**
   * Execute flow with checkpoint recovery
   * Cho phép resume từ checkpoint
   */
  async executeWithCheckpoints(startFromStep?: string): Promise<FlowResult> {
    this.logger.info('Starting flow execution with checkpoints');
    
    let shouldExecute = startFromStep === undefined;
    const filteredSteps = this.steps.filter((step) => {
      if (shouldExecute) return true;
      if (step.name === startFromStep) {
        shouldExecute = true;
        return true;
      }
      return false;
    });
    
    // Temporarily replace steps
    const originalSteps = this.steps;
    this.steps = filteredSteps;
    
    const result = await this.execute();
    
    // Restore original steps
    this.steps = originalSteps;
    
    return result;
  }
  
  /**
   * Clear all steps
   */
  clearSteps(): void {
    this.steps = [];
    this.logger.debug('All steps cleared');
  }
  
  /**
   * Get watcher events during flow
   */
  getWatcherEvents(): any[] {
    return this.watcherManager.getAllEvents();
  }
}
