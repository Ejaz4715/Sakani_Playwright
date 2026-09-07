const fs = require('fs/promises');
const path = require('path');

class NetworkRecorder {
  constructor(page) {
    this.page = page;
    this.logs = [];
    this.isRecording = false;
    this._responseHandler = this._handleResponse.bind(this);
  }

  /**
   * Start intercepting network traffic
   */
  start() {
    if (this.isRecording) return;
    this.logs = [];
    this.isRecording = true;
    this.page.on('response', this._responseHandler);
    console.log('[NetworkRecorder] Recording STARTED.');
  }

  /**
   * Internal handler for processing Playwright responses
   */
  async _handleResponse(response) {
    const request = response.request();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';

    let responseBody = null;

    try {
      const isMediaOrBinary = contentType.includes('image') ||
                              contentType.includes('video') ||
                              contentType.includes('font') ||
                              contentType.includes('octet-stream') ||
                              contentType.includes('pdf');

      if (status >= 200 && status < 300 && !isMediaOrBinary) {
        const text = await response.text();
        try {
          responseBody = JSON.parse(text);
        } catch {
          responseBody = text;
        }
      } else if (isMediaOrBinary) {
        responseBody = `[Binary content skipped: ${contentType}]`;
      }
    } catch (err) {
      responseBody = `[Failed to read response body: ${err.message}]`;
    }

    this.logs.push({
      timestamp: new Date().toISOString(),
      request: {
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        resourceType: request.resourceType(),
        postData: request.postData() || null,
      },
      response: {
        status: status,
        statusText: response.statusText(),
        headers: response.headers(),
        body: responseBody,
      },
    });
  }

  /**
   * Stop intercepting traffic, delete existing file if present, and save new JSON log
   * 
   * @param {string} customFilePath - Target path for saving raw network logs JSON file
   */
  async stopAndSave(customFilePath) {
    if (!this.isRecording) return;
    
    // Remove network listener
    this.page.off('response', this._responseHandler);
    this.isRecording = false;
    console.log(`[NetworkRecorder] Recording STOPPED. Captured ${this.logs.length} requests.`);

    const resolvedPath = path.resolve(customFilePath);
    const targetDir = path.dirname(resolvedPath);

    // 1. Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // 2. Check if existing log file exists and delete it
    try {
      await fs.access(resolvedPath);
      await fs.unlink(resolvedPath);
      console.log(`[NetworkRecorder] Existing network log file deleted: ${resolvedPath}`);
    } catch (err) {
      // File does not exist, proceed
    }

    // 3. Write new network log JSON file
    await fs.writeFile(resolvedPath, JSON.stringify(this.logs, null, 2), 'utf-8');
    console.log(`[NetworkRecorder] New network logs saved to: ${resolvedPath}`);
  }

  /**
   * Key-anchored search for dynamic invoice and viban values.
   * Finds the object containing 'viban_number' (or 'viban') and reads its sibling keys.
   * 
   * @returns {{ invoiceNumber: string|null, viban: string|null }}
   */
  findInvoiceAndViban() {
    let extractedData = { invoiceNumber: null, viban: null };

    for (const entry of this.logs) {
      const body = entry.response.body;

      if (body && typeof body === 'object') {
        const targetBlock = this._findObjectByKey(body, 'viban_number') || 
                            this._findObjectByKey(body, 'viban');

        if (targetBlock) {
          extractedData.viban = targetBlock.viban_number || targetBlock.viban || null;
          extractedData.invoiceNumber = targetBlock.invoice_number || targetBlock.invoiceNumber || null;
          console.log('[NetworkRecorder] Target API payload located by key.');
          break;
        }
      }
    }

    return extractedData;
  }

  _findObjectByKey(obj, targetKey) {
    if (!obj || typeof obj !== 'object') return null;

    if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
      return obj;
    }

    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = this._findObjectByKey(obj[key], targetKey);
        if (result) return result;
      }
    }

    return null;
  }

  /**
   * Reads target test-data.json, updates/merges extracted keys, and writes back.
   * 
   * @param {string} testDataFilePath - Path to test-data.json
   * @param {Object} extractedData - Object containing extracted key-value pairs
   */
  async updateTestDataFile(testDataFilePath, extractedData) {
    const resolvedPath = path.resolve(testDataFilePath);
    const targetDir = path.dirname(resolvedPath);

    await fs.mkdir(targetDir, { recursive: true });

    let currentTestData = {};

    // Read existing file if present so we update rather than overwrite other test data
    try {
      const fileContent = await fs.readFile(resolvedPath, 'utf-8');
      currentTestData = JSON.parse(fileContent);
    } catch (err) {
      console.log(`[NetworkRecorder] Creating new test-data.json file at: ${resolvedPath}`);
    }

    // Update keys
    currentTestData.invoice_number = extractedData.invoiceNumber;
    currentTestData.viban_number = extractedData.viban;

    // Save updated test-data.json
    await fs.writeFile(resolvedPath, JSON.stringify(currentTestData, null, 2), 'utf-8');
    console.log(`[NetworkRecorder] Updated test-data.json successfully at: ${resolvedPath}`);
  }
}

module.exports = NetworkRecorder;