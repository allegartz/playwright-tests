/**
 * PHẦN 2 & 5: ADVANCED WATCHER IMPLEMENTATION & COORDINATION
 * Watcher Manager
 * Quản lý và điều phối tất cả watchers
 */

import { Page } from '@playwright/test';
import { IWatcher } from './base-watcher';
import { DomMutationWatcher } from './dom-mutation-watcher';
import { NetworkWatcher } from './network-watcher';
import { ConsoleWatcher } from './console-watcher';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../core/config';

export class WatcherManager {
  private page: Page;
  private watchers: Map<string, IWatcher> = new Map();
  private logger: Logger;
  private config: ConfigManager;
  
  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
  }
  
  /**
   * Initialize all watchers based on config
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing Watcher Manager');
    
    const watcherConfig = this.config.getConfig().watchers;
    
    if (!watcherConfig.enabled) {
      this.logger.info('Watchers disabled in config');
      return;
    }
    
    // Initialize DOM Mutation Watcher
    if (watcherConfig.domMutation) {
      const domWatcher = new DomMutationWatcher(this.page);
      await domWatcher.initialize();
      this.watchers.set('dom', domWatcher);
      this.logger.debug('DOM Mutation Watcher registered');
    }
    
    // Initialize Network Watcher
    if (watcherConfig.networkMonitoring) {
      const networkWatcher = new NetworkWatcher(this.page);
      await networkWatcher.initialize();
      this.watchers.set('network', networkWatcher);
      this.logger.debug('Network Watcher registered');
    }
    
    // Initialize Console Watcher
    if (watcherConfig.consoleMonitoring) {
      const consoleWatcher = new ConsoleWatcher(this.page);
      await consoleWatcher.initialize();
      this.watchers.set('console', consoleWatcher);
      this.logger.debug('Console Watcher registered');
    }
  }
  
  /**
   * Start all watchers
   */
  async startAll(): Promise<void> {
    this.logger.info('Starting all watchers');
    for (const [name, watcher] of this.watchers) {
      await watcher.start();
      this.logger.debug(`Started watcher: ${name}`);
    }
  }
  
  /**
   * Stop all watchers
   */
  async stopAll(): Promise<void> {
    this.logger.info('Stopping all watchers');
    for (const [name, watcher] of this.watchers) {
      await watcher.stop();
      this.logger.debug(`Stopped watcher: ${name}`);
    }
  }
  
  /**
   * Cleanup all watchers
   */
  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up all watchers');
    for (const [name, watcher] of this.watchers) {
      await watcher.cleanup();
      this.logger.debug(`Cleaned up watcher: ${name}`);
    }
    this.watchers.clear();
  }
  
  /**
   * Get specific watcher
   */
  getWatcher<T extends IWatcher>(name: string): T | undefined {
    return this.watchers.get(name) as T;
  }
  
  /**
   * Get all events from all watchers
   */
  getAllEvents(): any[] {
    const allEvents: any[] = [];
    for (const watcher of this.watchers.values()) {
      allEvents.push(...watcher.getEvents());
    }
    return allEvents.sort((a, b) => a.timestamp - b.timestamp);
  }
  
  /**
   * Clear all events
   */
  clearAllEvents(): void {
    for (const watcher of this.watchers.values()) {
      watcher.clearEvents();
    }
  }
  
  /**
   * Get summary report
   */
  getSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    // DOM Mutation summary
    const domWatcher = this.getWatcher<DomMutationWatcher>('dom');
    if (domWatcher) {
      summary.domMutations = domWatcher.getMutationCount();
    }
    
    // Network summary
    const networkWatcher = this.getWatcher<NetworkWatcher>('network');
    if (networkWatcher) {
      summary.networkRequests = networkWatcher.getEvents().length;
      summary.failedRequests = networkWatcher.getFailedRequests().length;
      summary.avgResponseTime = networkWatcher.getAverageResponseTime();
    }
    
    // Console summary
    const consoleWatcher = this.getWatcher<ConsoleWatcher>('console');
    if (consoleWatcher) {
      summary.consoleErrors = consoleWatcher.getErrors().length;
      summary.consoleWarnings = consoleWatcher.getWarnings().length;
    }
    
    return summary;
  }
}
