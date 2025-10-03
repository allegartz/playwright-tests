/**
 * PHẦN 2: ADVANCED WATCHER IMPLEMENTATION
 * Console Watcher
 * Theo dõi console logs và errors
 */

import { Page, ConsoleMessage } from '@playwright/test';
import { IWatcher, WatcherEvent, WatcherEventType } from './base-watcher';
import { Logger } from '../utils/logger';

export interface ConsoleLogEvent extends WatcherEvent {
  type: WatcherEventType.CONSOLE_LOG;
  data: {
    level: string;
    text: string;
    location?: string;
  };
}

export interface PageErrorEvent extends WatcherEvent {
  type: WatcherEventType.PAGE_ERROR;
  data: {
    message: string;
    stack?: string;
  };
}

export class ConsoleWatcher implements IWatcher {
  private page: Page;
  private events: (ConsoleLogEvent | PageErrorEvent)[] = [];
  private logger: Logger;
  
  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }
  
  async initialize(): Promise<void> {
    this.logger.debug('Initializing Console Watcher');
    
    // Listen to console messages
    this.page.on('console', (message: ConsoleMessage) => {
      this.events.push({
        type: WatcherEventType.CONSOLE_LOG,
        timestamp: Date.now(),
        data: {
          level: message.type(),
          text: message.text(),
          location: message.location().url,
        },
      });
    });
    
    // Listen to page errors
    this.page.on('pageerror', (error: Error) => {
      this.events.push({
        type: WatcherEventType.PAGE_ERROR,
        timestamp: Date.now(),
        data: {
          message: error.message,
          stack: error.stack,
        },
      });
      
      this.logger.error('Page error detected', error);
    });
  }
  
  async start(): Promise<void> {
    this.logger.info('Console Watcher started');
  }
  
  async stop(): Promise<void> {
    this.logger.info('Console Watcher stopped');
  }
  
  async cleanup(): Promise<void> {
    this.logger.debug('Cleaning up Console Watcher');
    this.clearEvents();
  }
  
  getEvents(): (ConsoleLogEvent | PageErrorEvent)[] {
    return this.events;
  }
  
  clearEvents(): void {
    this.events = [];
  }
  
  /**
   * Get errors only
   */
  getErrors(): (ConsoleLogEvent | PageErrorEvent)[] {
    return this.events.filter(
      (event) => 
        (event.type === WatcherEventType.CONSOLE_LOG && event.data.level === 'error') ||
        event.type === WatcherEventType.PAGE_ERROR
    );
  }
  
  /**
   * Get warnings
   */
  getWarnings(): ConsoleLogEvent[] {
    return this.events.filter(
      (event) => event.type === WatcherEventType.CONSOLE_LOG && event.data.level === 'warning'
    ) as ConsoleLogEvent[];
  }
  
  /**
   * Check if any errors occurred
   */
  hasErrors(): boolean {
    return this.getErrors().length > 0;
  }
}
