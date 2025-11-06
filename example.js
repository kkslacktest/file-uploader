#!/usr/bin/env node

/**
 * Example: Using SlackFileUploader programmatically
 * 
 * This demonstrates how to use the SlackFileUploader class
 * in your own Node.js applications.
 */

const { SlackFileUploader } = require('./index');
const fs = require('fs');
require('dotenv').config();

async function exampleUsage() {
  try {
    // Initialize the uploader with your token
    const uploader = new SlackFileUploader(process.env.SLACK_USER_TOKEN);
    
    // Test authentication and get user info
    console.log('Testing authentication...');
    const userInfo = await uploader.getUserInfo();
    console.log(`✓ Authenticated as: ${userInfo.user} (${userInfo.user_id})`);
    console.log(`  Team: ${userInfo.team} (${userInfo.team_id})`);
    
    // Example 1: Upload a simple text file
    console.log('\nExample 1: Creating and uploading a text file...');
    const testFilePath = '/tmp/example-upload.txt';
    fs.writeFileSync(testFilePath, 'This is a test file created by the example script.');
    
    // Replace with your actual channel ID
    const channelId = process.env.SLACK_CHANNEL_ID || 'YOUR_CHANNEL_ID';
    
    if (channelId === 'YOUR_CHANNEL_ID') {
      console.log('⚠ Please set SLACK_CHANNEL_ID in your .env file to run this example');
      console.log('  Example: SLACK_CHANNEL_ID=C01234567');
      return;
    }
    
    const result = await uploader.uploadFile(testFilePath, channelId, {
      title: 'Example Upload',
      initial_comment: 'This file was uploaded using the SlackFileUploader class!'
    });
    
    console.log(`✓ File uploaded successfully!`);
    console.log(`  File ID: ${result.file.id}`);
    console.log(`  File Name: ${result.file.name}`);
    
    // Clean up
    fs.unlinkSync(testFilePath);
    
    console.log('\n✓ Example completed successfully!');
    
  } catch (error) {
    console.error('Error in example:', error.message);
    
    if (error.message.includes('SLACK_USER_TOKEN')) {
      console.log('\nTip: Make sure you have set SLACK_USER_TOKEN in your .env file');
    }
    
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  console.log('=== Slack File Uploader - Example Usage ===\n');
  exampleUsage();
}

module.exports = { exampleUsage };
