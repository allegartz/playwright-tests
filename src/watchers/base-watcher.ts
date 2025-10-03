/**
 * PHẦN 2: ADVANCED WATCHER IMPLEMENTATION
 * Base Watcher Interface
 * Interface chung cho tất cả watchers
 */

export interface IWatcher {
  /**
   * Initialize watcher
   */
  initialize(): Promise<void>;
  
  /**
   * Start watching
   */
  start(): Promise<void>;
  
  /**
   * Stop watching
   */
  stop(): Promise<void>;
  
  /**
   * Cleanup resources
   */
  cleanup(): Promise<void>;
  
  /**
   * Get collected events
   */
  getEvents(): any[];
  
  /**
   * Clear events
   */
  clearEvents(): void;
}

/**
 * Event types
 */
export enum WatcherEventType {
  DOM_MUTATION = 'dom_mutation',
  NETWORK_REQUEST = 'network_request',
  NETWORK_RESPONSE = 'network_response',
  CONSOLE_LOG = 'console_log',
  PAGE_ERROR = 'page_error',
  DIALOG = 'dialog',
  POPUP = 'popup',
}

/**
 * Base event structure
 */
export interface WatcherEvent {
  type: WatcherEventType;
  timestamp: number;
  data: any;
}
