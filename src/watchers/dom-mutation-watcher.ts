/**
 * PHẦN 2: ADVANCED WATCHER IMPLEMENTATION
 * DOM Mutation Watcher
 * Theo dõi các thay đổi DOM trên trang
 */

import { Page } from '@playwright/test';
import { IWatcher, WatcherEvent, WatcherEventType } from './base-watcher';
import { Logger } from '../utils/logger';

export interface DomMutationEvent extends WatcherEvent {
  type: WatcherEventType.DOM_MUTATION;
  data: {
    addedNodes: number;
    removedNodes: number;
    attributes: string[];
    target: string;
  };
}

export class DomMutationWatcher implements IWatcher {
  private page: Page;
  private events: DomMutationEvent[] = [];
  private logger: Logger;
  private isWatching: boolean = false;
  
  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }
  
  async initialize(): Promise<void> {
    this.logger.debug('Initializing DOM Mutation Watcher');
    
    // Inject MutationObserver vào page
    await this.page.addInitScript(() => {
      // Store mutations in window object
      (window as any).__domMutations = [];
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          (window as any).__domMutations.push({
            type: mutation.type,
            addedNodes: mutation.addedNodes.length,
            removedNodes: mutation.removedNodes.length,
            attributeName: mutation.attributeName,
            target: mutation.target.nodeName,
            timestamp: Date.now(),
          });
        });
      });
      
      // Observe toàn bộ document
      observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeOldValue: true,
      });
      
      (window as any).__mutationObserver = observer;
    });
  }
  
  async start(): Promise<void> {
    this.logger.info('Starting DOM Mutation Watcher');
    this.isWatching = true;
  }
  
  async stop(): Promise<void> {
    this.logger.info('Stopping DOM Mutation Watcher');
    this.isWatching = false;
    
    // Collect mutations từ page
    const mutations = await this.page.evaluate(() => {
      return (window as any).__domMutations || [];
    });
    
    // Convert sang WatcherEvent format
    mutations.forEach((mutation: any) => {
      this.events.push({
        type: WatcherEventType.DOM_MUTATION,
        timestamp: mutation.timestamp,
        data: {
          addedNodes: mutation.addedNodes,
          removedNodes: mutation.removedNodes,
          attributes: mutation.attributeName ? [mutation.attributeName] : [],
          target: mutation.target,
        },
      });
    });
  }
  
  async cleanup(): Promise<void> {
    this.logger.debug('Cleaning up DOM Mutation Watcher');
    
    // Disconnect observer
    await this.page.evaluate(() => {
      if ((window as any).__mutationObserver) {
        (window as any).__mutationObserver.disconnect();
      }
    });
    
    this.clearEvents();
  }
  
  getEvents(): DomMutationEvent[] {
    return this.events;
  }
  
  clearEvents(): void {
    this.events = [];
  }
  
  /**
   * Get mutation count
   */
  getMutationCount(): number {
    return this.events.length;
  }
}
