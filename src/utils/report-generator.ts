/**
 * PHẦN 7: PRODUCTION-READY IMPLEMENTATION
 * Report Generator
 * Tạo report cho test execution
 */

import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

export interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: number;
    duration: number;
    startTime: string;
    endTime: string;
  };
  tests: TestReportItem[];
  errors: any[];
  environment: {
    browser: string;
    platform: string;
    timestamp: string;
  };
}

export interface TestReportItem {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshots?: string[];
  retries: number;
}

export class ReportGenerator {
  private logger: Logger;
  
  constructor() {
    this.logger = Logger.getInstance();
  }
  
  /**
   * Generate HTML report
   */
  generateHtmlReport(report: TestReport, outputPath: string): void {
    this.logger.info('Generating HTML report');
    
    const html = this.generateHtmlContent(report);
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    this.logger.info(`HTML report saved: ${outputPath}`);
  }
  
  /**
   * Generate JSON report
   */
  generateJsonReport(report: TestReport, outputPath: string): void {
    this.logger.info('Generating JSON report');
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    this.logger.info(`JSON report saved: ${outputPath}`);
  }
  
  /**
   * Generate HTML content
   */
  private generateHtmlContent(report: TestReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - ${report.environment.timestamp}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-box {
            padding: 15px;
            border-radius: 4px;
            text-align: center;
        }
        .stat-box.total { background-color: #2196F3; color: white; }
        .stat-box.passed { background-color: #4CAF50; color: white; }
        .stat-box.failed { background-color: #f44336; color: white; }
        .stat-box.duration { background-color: #FF9800; color: white; }
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .stat-label {
            font-size: 14px;
            opacity: 0.9;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
        }
        .status.passed {
            background-color: #4CAF50;
            color: white;
        }
        .status.failed {
            background-color: #f44336;
            color: white;
        }
        .error {
            color: #f44336;
            font-size: 12px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Test Execution Report</h1>
        
        <div class="summary">
            <div class="stat-box total">
                <div class="stat-label">Total Tests</div>
                <div class="stat-value">${report.summary.total}</div>
            </div>
            <div class="stat-box passed">
                <div class="stat-label">Passed</div>
                <div class="stat-value">${report.summary.passed}</div>
            </div>
            <div class="stat-box failed">
                <div class="stat-label">Failed</div>
                <div class="stat-value">${report.summary.failed}</div>
            </div>
            <div class="stat-box duration">
                <div class="stat-label">Pass Rate</div>
                <div class="stat-value">${report.summary.passRate.toFixed(1)}%</div>
            </div>
        </div>
        
        <h2>Test Details</h2>
        <table>
            <thead>
                <tr>
                    <th>Test Name</th>
                    <th>Status</th>
                    <th>Duration (ms)</th>
                    <th>Retries</th>
                </tr>
            </thead>
            <tbody>
                ${report.tests.map(test => `
                    <tr>
                        <td>${test.name}</td>
                        <td><span class="status ${test.status}">${test.status.toUpperCase()}</span></td>
                        <td>${test.duration}</td>
                        <td>${test.retries}</td>
                    </tr>
                    ${test.error ? `
                    <tr>
                        <td colspan="4">
                            <div class="error">Error: ${test.error}</div>
                        </td>
                    </tr>
                    ` : ''}
                `).join('')}
            </tbody>
        </table>
        
        <div style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">
            <small>
                Environment: ${report.environment.browser} on ${report.environment.platform}<br>
                Generated: ${report.environment.timestamp}<br>
                Duration: ${(report.summary.duration / 1000).toFixed(2)}s
            </small>
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}
