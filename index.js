#!/usr/bin/env node

const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Simple Slack File Uploader
 * Uploads files to Slack as a user using the Slack Web API
 */
class SlackFileUploader {
  constructor(token) {
    if (!token) {
      throw new Error('SLACK_USER_TOKEN is required. Please set it in .env file.');
    }
    this.client = new WebClient(token);
  }

  /**
   * Upload a file to Slack
   * @param {string} filePath - Path to the file to upload
   * @param {string} channelId - Slack channel ID to upload to
   * @param {Object} options - Additional options (title, initial_comment)
   * @returns {Promise<Object>} - Upload result
   */
  async uploadFile(filePath, channelId, options = {}) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Get file info
      const fileName = options.filename || path.basename(filePath);
      const fileStream = fs.createReadStream(filePath);

      console.log(`Uploading ${fileName} to channel ${channelId}...`);

      // Upload file using Slack Web API
      const result = await this.client.files.uploadV2({
        channel_id: channelId,
        file: fileStream,
        filename: fileName,
        title: options.title || fileName,
        initial_comment: options.initial_comment || ''
      });

      console.log('✓ File uploaded successfully!');
      console.log(`File ID: ${result.file.id}`);
      
      return result;
    } catch (error) {
      console.error('✗ Error uploading file:', error.message);
      throw error;
    }
  }

  /**
   * Get information about the authenticated user
   * @returns {Promise<Object>} - User info
   */
  async getUserInfo() {
    try {
      const result = await this.client.auth.test();
      return result;
    } catch (error) {
      console.error('✗ Error getting user info:', error.message);
      throw error;
    }
  }
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Slack File Uploader - Upload files to Slack as a user

Usage:
  node index.js <file-path> <channel-id> [options]

Arguments:
  file-path    Path to the file to upload
  channel-id   Slack channel ID (e.g., C01234567)

Options:
  --title <title>              Set custom title for the file
  --comment <comment>          Add initial comment with the file
  --help, -h                   Show this help message

Environment Variables:
  SLACK_USER_TOKEN            Slack user OAuth token (required)
                              Set in .env file or as environment variable

Example:
  node index.js ./document.pdf C01234567 --title "Important Document" --comment "Please review"
    `);
    process.exit(0);
  }

  const filePath = args[0];
  const channelId = args[1];

  if (!filePath || !channelId) {
    console.error('Error: Both file path and channel ID are required.');
    console.error('Run with --help for usage information.');
    process.exit(1);
  }

  // Parse options
  const options = {};
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) {
      options.title = args[i + 1];
      i++;
    } else if (args[i] === '--comment' && args[i + 1]) {
      options.initial_comment = args[i + 1];
      i++;
    }
  }

  try {
    const uploader = new SlackFileUploader(process.env.SLACK_USER_TOKEN);
    
    // Test authentication
    const userInfo = await uploader.getUserInfo();
    console.log(`✓ Authenticated as: ${userInfo.user} (${userInfo.user_id})`);
    
    // Upload file
    await uploader.uploadFile(filePath, channelId, options);
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to upload file:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { SlackFileUploader };
