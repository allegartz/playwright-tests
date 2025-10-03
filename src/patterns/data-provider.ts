/**
 * PHẦN 6: ADVANCED PATTERNS & OPTIMIZATIONS
 * Data-Driven Test Framework
 * Support cho data-driven testing
 */

import { Logger } from '../utils/logger';

export interface TestData {
  [key: string]: any;
}

export interface DataSet {
  name: string;
  data: TestData;
}

export class DataProvider {
  private logger: Logger;
  private dataSets: Map<string, DataSet[]> = new Map();
  
  constructor() {
    this.logger = Logger.getInstance();
  }
  
  /**
   * Load data từ array
   */
  loadData(testName: string, data: TestData[]): void {
    const dataSets = data.map((item, index) => ({
      name: `${testName}-dataset-${index + 1}`,
      data: item,
    }));
    
    this.dataSets.set(testName, dataSets);
    this.logger.info(`Loaded ${dataSets.length} datasets for: ${testName}`);
  }
  
  /**
   * Load data từ JSON file
   */
  async loadFromFile(testName: string, filePath: string): Promise<void> {
    // TODO: Implement file loading
    this.logger.info(`Loading data from file: ${filePath}`);
    // const data = require(filePath);
    // this.loadData(testName, data);
  }
  
  /**
   * Get data sets for test
   */
  getDataSets(testName: string): DataSet[] {
    return this.dataSets.get(testName) || [];
  }
  
  /**
   * Execute test với mỗi dataset
   */
  async executeWithData<T>(
    testName: string,
    testFn: (data: TestData) => Promise<T>
  ): Promise<Map<string, T>> {
    const dataSets = this.getDataSets(testName);
    const results = new Map<string, T>();
    
    this.logger.info(`Executing test with ${dataSets.length} datasets`);
    
    for (const dataSet of dataSets) {
      this.logger.info(`Executing: ${dataSet.name}`);
      
      try {
        const result = await testFn(dataSet.data);
        results.set(dataSet.name, result);
        this.logger.info(`Completed: ${dataSet.name}`);
      } catch (error) {
        this.logger.error(`Failed: ${dataSet.name}`, error as Error);
        throw error;
      }
    }
    
    return results;
  }
  
  /**
   * Clear all data
   */
  clear(): void {
    this.dataSets.clear();
    this.logger.debug('All data cleared');
  }
}

/**
 * CSV Parser for data-driven tests
 */
export class CsvParser {
  /**
   * Parse CSV string to array of objects
   */
  static parse(csvString: string): TestData[] {
    const lines = csvString.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map((h) => h.trim());
    const data: TestData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row: TestData = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      data.push(row);
    }
    
    return data;
  }
}
