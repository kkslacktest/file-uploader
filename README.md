# Slack File Uploader

A simple Node.js application that uploads files to Slack as a user using the Slack Web API.

## Features

- Upload files to Slack channels as a user
- Support for custom file titles and comments
- Command-line interface for easy usage
- User authentication verification
- Reusable class for programmatic usage

## Prerequisites

- Node.js (v14 or higher)
- A Slack workspace where you have permission to create apps
- A Slack User OAuth Token with `files:write` scope

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kkslacktest/file-uploader.git
   cd file-uploader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a Slack App and get a User OAuth Token**
   
   a. Go to https://api.slack.com/apps
   
   b. Click "Create New App" → "From scratch"
   
   c. Give it a name (e.g., "File Uploader") and select your workspace
   
   d. Navigate to "OAuth & Permissions" in the sidebar
   
   e. Under "User Token Scopes", add the following scope:
      - `files:write` - Upload, edit, and delete files as your user
   
   f. Scroll up and click "Install to Workspace"
   
   g. Authorize the app
   
   h. Copy the "User OAuth Token" (starts with `xoxp-`)

4. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Slack User OAuth Token:
   ```
   SLACK_USER_TOKEN=xoxp-your-token-here
   ```

## Usage

### Command Line

Upload a file to a Slack channel:

```bash
node index.js <file-path> <channel-id> [options]
```

**Arguments:**
- `file-path` - Path to the file you want to upload
- `channel-id` - Slack channel ID (e.g., C01234567)

**Options:**
- `--title <title>` - Set a custom title for the file
- `--comment <comment>` - Add an initial comment with the file
- `--help`, `-h` - Show help message

**Examples:**

```bash
# Basic upload
node index.js ./document.pdf C01234567

# Upload with custom title and comment
node index.js ./report.pdf C01234567 --title "Q4 Report" --comment "Please review this report"

# Upload an image
node index.js ./screenshot.png C01234567 --comment "Bug screenshot"
```

### Programmatic Usage

You can also use the `SlackFileUploader` class in your own Node.js code:

```javascript
const { SlackFileUploader } = require('./index');

async function uploadExample() {
  const uploader = new SlackFileUploader(process.env.SLACK_USER_TOKEN);
  
  // Get user info
  const userInfo = await uploader.getUserInfo();
  console.log('Authenticated as:', userInfo.user);
  
  // Upload a file
  const result = await uploader.uploadFile(
    './path/to/file.pdf',
    'C01234567',
    {
      title: 'My Document',
      initial_comment: 'Check this out!'
    }
  );
  
  console.log('Upload result:', result);
}

uploadExample();
```

## Finding Channel IDs

To get a Slack channel ID:

1. Open Slack in your web browser
2. Navigate to the channel
3. The URL will look like: `https://app.slack.com/client/T.../C01234567`
4. The part starting with `C` is your channel ID

Alternatively, right-click on a channel in Slack → "Copy link" → the ID is at the end of the URL.

## Security Notes

- **Never commit your `.env` file** - It contains sensitive tokens
- The `.gitignore` file is configured to exclude `.env` from version control
- User OAuth tokens are powerful - protect them like passwords
- Only share your token over secure channels

## Troubleshooting

**"SLACK_USER_TOKEN is required" error:**
- Make sure you have created a `.env` file with your token
- Verify the token starts with `xoxp-`

**"not_authed" or authentication errors:**
- Your token may be invalid or expired
- Reinstall the Slack app to get a new token

**"channel_not_found" error:**
- Verify the channel ID is correct
- Make sure your user has access to that channel

**"File not found" error:**
- Check that the file path is correct
- Use absolute paths or paths relative to where you run the command

## License

ISC