/**
 * PHẦN 1: CORE CONCEPT
 * Configuration Management System
 * Quản lý cấu hình toàn cục cho framework
 */

export interface FrameworkConfig {
  // Browser settings
  browser: {
    headless: boolean;
    slowMo: number;
    defaultTimeout: number;
    navigationTimeout: number;
  };
  
  // Concurrent execution settings
  execution: {
    maxWorkers: number;
    retries: number;
    parallel: boolean;
  };
  
  // Element handling settings
  elements: {
    autoRetry: boolean;
    retryAttempts: number;
    retryDelay: number;
    waitForStable: boolean;
  };
  
  // Watcher settings
  watchers: {
    enabled: boolean;
    domMutation: boolean;
    networkMonitoring: boolean;
    consoleMonitoring: boolean;
  };
  
  // Logging settings
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file: string;
    console: boolean;
  };
  
  // Screenshot and reporting
  reporting: {
    screenshots: boolean;
    video: boolean;
    trace: boolean;
    reportPath: string;
  };
}

/**
 * Default configuration
 * Cấu hình mặc định cho framework
 */
export const defaultConfig: FrameworkConfig = {
  browser: {
    headless: true,
    slowMo: 0,
    defaultTimeout: 30000,
    navigationTimeout: 60000,
  },
  execution: {
    maxWorkers: 4,
    retries: 2,
    parallel: true,
  },
  elements: {
    autoRetry: true,
    retryAttempts: 3,
    retryDelay: 1000,
    waitForStable: true,
  },
  watchers: {
    enabled: true,
    domMutation: true,
    networkMonitoring: true,
    consoleMonitoring: true,
  },
  logging: {
    level: 'info',
    file: 'logs/test.log',
    console: true,
  },
  reporting: {
    screenshots: true,
    video: true,
    trace: true,
    reportPath: 'test-results',
  },
};

/**
 * Config Manager
 * Quản lý và merge cấu hình
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: FrameworkConfig;
  
  private constructor() {
    this.config = { ...defaultConfig };
  }
  
  /**
   * Singleton pattern - đảm bảo chỉ có 1 instance
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  
  /**
   * Lấy toàn bộ config
   */
  public getConfig(): FrameworkConfig {
    return this.config;
  }
  
  /**
   * Update config với partial values
   */
  public updateConfig(partialConfig: Partial<FrameworkConfig>): void {
    this.config = {
      ...this.config,
      ...partialConfig,
    };
  }
  
  /**
   * Reset về default config
   */
  public resetConfig(): void {
    this.config = { ...defaultConfig };
  }
  
  /**
   * Load config từ file JSON
   */
  public loadFromFile(filePath: string): void {
    // TODO: Implement file loading
    // const fileConfig = require(filePath);
    // this.updateConfig(fileConfig);
  }
}
