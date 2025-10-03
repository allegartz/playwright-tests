/**
 * PHẦN 7: PRODUCTION-READY IMPLEMENTATION
 * Logger System
 * Hệ thống logging sử dụng Winston
 */

import * as winston from 'winston';
import { ConfigManager } from '../core/config';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  
  private constructor() {
    const config = ConfigManager.getInstance().getConfig();
    
    // Winston format
    const customFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
        }
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    );
    
    // Create transports
    const transports: winston.transport[] = [];
    
    // Console transport
    if (config.logging.console) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            customFormat
          ),
        })
      );
    }
    
    // File transport
    transports.push(
      new winston.transports.File({
        filename: config.logging.file,
        format: customFormat,
      })
    );
    
    // Initialize logger
    this.logger = winston.createLogger({
      level: config.logging.level,
      transports,
    });
  }
  
  /**
   * Singleton pattern
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  /**
   * Log debug message
   */
  public debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }
  
  /**
   * Log info message
   */
  public info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }
  
  /**
   * Log warning message
   */
  public warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }
  
  /**
   * Log error message
   */
  public error(message: string, error?: Error, ...meta: any[]): void {
    if (error) {
      this.logger.error(message, { error: error.message, stack: error.stack, ...meta });
    } else {
      this.logger.error(message, ...meta);
    }
  }
}
