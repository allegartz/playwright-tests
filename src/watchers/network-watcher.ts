/**
 * PHẦN 2: ADVANCED WATCHER IMPLEMENTATION
 * Network Watcher
 * Theo dõi network requests và responses
 */

import { Page, Request, Response } from '@playwright/test';
import { IWatcher, WatcherEvent, WatcherEventType } from './base-watcher';
import { Logger } from '../utils/logger';

export interface NetworkRequestEvent extends WatcherEvent {
  type: WatcherEventType.NETWORK_REQUEST;
  data: {
    url: string;
    method: string;
    headers: Record<string, string>;
    postData?: string;
  };
}

export interface NetworkResponseEvent extends WatcherEvent {
  type: WatcherEventType.NETWORK_RESPONSE;
  data: {
    url: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    timing: number;
  };
}

export class NetworkWatcher implements IWatcher {
  private page: Page;
  private events: (NetworkRequestEvent | NetworkResponseEvent)[] = [];
  private logger: Logger;
  private requestTimings: Map<string, number> = new Map();
  
  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }
  
  async initialize(): Promise<void> {
    this.logger.debug('Initializing Network Watcher');
    
    // Listen to requests
    this.page.on('request', (request: Request) => {
      const timestamp = Date.now();
      this.requestTimings.set(request.url(), timestamp);
      
      this.events.push({
        type: WatcherEventType.NETWORK_REQUEST,
        timestamp,
        data: {
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData() || undefined,
        },
      });
    });
    
    // Listen to responses
    this.page.on('response', (response: Response) => {
      const timestamp = Date.now();
      const requestTimestamp = this.requestTimings.get(response.url()) || timestamp;
      const timing = timestamp - requestTimestamp;
      
      this.events.push({
        type: WatcherEventType.NETWORK_RESPONSE,
        timestamp,
        data: {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          timing,
        },
      });
      
      this.requestTimings.delete(response.url());
    });
  }
  
  async start(): Promise<void> {
    this.logger.info('Network Watcher started');
  }
  
  async stop(): Promise<void> {
    this.logger.info('Network Watcher stopped');
  }
  
  async cleanup(): Promise<void> {
    this.logger.debug('Cleaning up Network Watcher');
    this.clearEvents();
    this.requestTimings.clear();
  }
  
  getEvents(): (NetworkRequestEvent | NetworkResponseEvent)[] {
    return this.events;
  }
  
  clearEvents(): void {
    this.events = [];
  }
  
  /**
   * Get failed requests
   */
  getFailedRequests(): NetworkResponseEvent[] {
    return this.events.filter(
      (event) => event.type === WatcherEventType.NETWORK_RESPONSE && event.data.status >= 400
    ) as NetworkResponseEvent[];
  }
  
  /**
   * Get requests by URL pattern
   */
  getRequestsByUrl(urlPattern: string): NetworkRequestEvent[] {
    const regex = new RegExp(urlPattern);
    return this.events.filter(
      (event) => event.type === WatcherEventType.NETWORK_REQUEST && regex.test(event.data.url)
    ) as NetworkRequestEvent[];
  }
  
  /**
   * Get average response time
   */
  getAverageResponseTime(): number {
    const responses = this.events.filter(
      (event) => event.type === WatcherEventType.NETWORK_RESPONSE
    ) as NetworkResponseEvent[];
    
    if (responses.length === 0) return 0;
    
    const total = responses.reduce((sum, event) => sum + event.data.timing, 0);
    return total / responses.length;
  }
}
