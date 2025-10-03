/**
 * PHẦN 7: PRODUCTION-READY IMPLEMENTATION
 * Error Handler
 * Xử lý errors và recovery
 */

import { Page } from '@playwright/test';
import { Logger } from './logger';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  timestamp: number;
  context?: any;
  screenshot?: string;
}

export class ErrorHandler {
  private logger: Logger;
  private errors: ErrorInfo[] = [];
  
  constructor() {
    this.logger = Logger.getInstance();
  }
  
  /**
   * Handle error với severity
   */
  async handleError(
    error: Error,
    severity: ErrorSeverity,
    page?: Page,
    context?: any
  ): Promise<void> {
    this.logger.error(`Error occurred (${severity}): ${error.message}`, error);
    
    let screenshot: string | undefined;
    
    // Take screenshot for medium+ severity errors
    if (page && [ErrorSeverity.MEDIUM, ErrorSeverity.HIGH, ErrorSeverity.CRITICAL].includes(severity)) {
      try {
        const path = `test-results/errors/error-${Date.now()}.png`;
        await page.screenshot({ path, fullPage: true });
        screenshot = path;
        this.logger.info(`Error screenshot saved: ${path}`);
      } catch (screenshotError) {
        this.logger.warn('Failed to take error screenshot');
      }
    }
    
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      severity,
      timestamp: Date.now(),
      context,
      screenshot,
    };
    
    this.errors.push(errorInfo);
  }
  
  /**
   * Retry operation với exponential backoff
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          this.logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Get all errors
   */
  getErrors(): ErrorInfo[] {
    return this.errors;
  }
  
  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorInfo[] {
    return this.errors.filter((e) => e.severity === severity);
  }
  
  /**
   * Clear errors
   */
  clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Check if critical errors occurred
   */
  hasCriticalErrors(): boolean {
    return this.getErrorsBySeverity(ErrorSeverity.CRITICAL).length > 0;
  }
  
  /**
   * Sleep utility
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
