# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Configure Slack Token
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Slack User OAuth Token:
   ```
   SLACK_USER_TOKEN=xoxp-your-token-here
   ```

## 3. Upload a File
```bash
node index.js /path/to/your/file.pdf YOUR_CHANNEL_ID
```

## Getting Your Slack Token

1. Go to https://api.slack.com/apps
2. Create a new app or select existing one
3. Go to "OAuth & Permissions"
4. Add `files:write` scope under "User Token Scopes"
5. Install/reinstall app to workspace
6. Copy the "User OAuth Token" (starts with `xoxp-`)

## Finding Channel IDs

1. Open Slack in browser
2. Click on the channel
3. Look at the URL: `https://app.slack.com/client/T.../C01234567`
4. The part starting with `C` is your channel ID

## Example Commands

```bash
# Simple upload
node index.js ./document.pdf C01234567

# With title and comment
node index.js ./report.pdf C01234567 --title "Monthly Report" --comment "Please review"

# Get help
node index.js --help
```

## Troubleshooting

- **Token error**: Make sure `.env` file exists with valid token
- **Channel error**: Verify you have access to the channel
- **File error**: Check file path is correct

For more details, see [README.md](README.md)
