# Integrating MCP Servers with Cursor IDE

This guide explains how to integrate your Model Context Protocol (MCP) servers with Cursor IDE to enhance AI capabilities.

## Prerequisites

- [Cursor IDE](https://cursor.sh/) installed on your computer
- An MCP server (either one of the examples in this repository or your own)

## Adding an MCP Server to Cursor

### Step 1: Start Your MCP Server

Before adding your MCP server to Cursor, make sure it's running. For example, to start the Task Manager MCP server:

```bash
cd example-mcp/mcp-servers/task-manager
npm install
npm start
```

This will start the server on http://localhost:3000 (or another port if configured differently).

### Step 2: Open Cursor Settings

1. Open Cursor IDE
2. Click on the gear icon (⚙️) in the bottom left corner of the window
3. Alternatively, use the keyboard shortcut:
   - macOS: `Cmd + ,`
   - Windows/Linux: `Ctrl + ,`

### Step 3: Navigate to MCP Settings

1. In the Settings panel, select "Features" from the left sidebar
2. Scroll down to find the "MCP" section

### Step 4: Add a New MCP Server

1. Click the "Add New MCP Server" button
2. Fill in the following information:
   - **Name**: A descriptive name for your MCP server (e.g., "Task Manager MCP")
   - **Transport Type**: Choose between SSE (HTTP) or Stdio

   For SSE (HTTP) transport:
   - **URL**: The URL where your MCP server is running (e.g., `http://localhost:3000`)

   For Stdio transport:
   - **Command**: The command to start your MCP server (e.g., `node /path/to/example-mcp/mcp-servers/task-manager/index.js`)

3. Click "Add" to save the configuration

### Step 5: Verify the Connection

After adding the MCP server, you should see it listed in the MCP servers section with a status indicator:

- **Green**: The server is connected and working properly
- **Yellow**: The server is connecting or has encountered a non-critical issue
- **Red**: The server is disconnected or has encountered a critical error

If the status is not green, check the following:
- Make sure your MCP server is running
- Verify the URL or command is correct
- Check for any error messages in the Cursor developer console (Help > Toggle Developer Tools)

## Using MCP Tools in Cursor

Once your MCP server is connected, you can use its tools through Cursor's AI features:

### Step 1: Open the AI Chat Panel

Press `Cmd+I` (macOS) or `Ctrl+I` (Windows/Linux) to open the AI chat panel.

### Step 2: Ask the AI to Use Your MCP Tools

You can now ask the AI to use the tools provided by your MCP server. For example:

```
Please create a new task titled "Implement user authentication" with a description "Add user login and registration functionality to the application."
```

The AI will:
1. Recognize that this request can be fulfilled using the `create_task` tool
2. Call the tool with the appropriate parameters
3. Return the result to you

### Step 3: View Tool Usage

When the AI uses an MCP tool, it will typically:
1. Mention that it's using a tool to fulfill your request
2. Show the result of the tool invocation
3. Provide additional context or explanation based on the result

## Troubleshooting

### Server Not Connecting

If your MCP server isn't connecting to Cursor:

1. **Check if the server is running**:
   - Verify that the server process is active
   - Make sure it's listening on the expected port

2. **Verify network settings**:
   - For HTTP transport, ensure the port isn't blocked by a firewall
   - Check if the server is bound to the correct network interface

3. **Restart Cursor**:
   - Sometimes restarting Cursor can resolve connection issues

### Tools Not Working as Expected

If the AI isn't using your MCP tools correctly:

1. **Check tool descriptions**:
   - Make sure your tools have clear, detailed descriptions
   - The AI relies on these descriptions to understand when to use each tool

2. **Verify parameter schemas**:
   - Ensure parameter schemas are correctly defined
   - Include descriptions for each parameter

3. **Be explicit in your requests**:
   - When asking the AI to use a specific tool, be clear about what you want
   - Provide all necessary information for the tool to work

## Advanced Configuration

### Environment Variables

You can use environment variables to configure your MCP servers when using Stdio transport:

```
env API_KEY=your_api_key node /path/to/server.js
```

### Multiple MCP Servers

You can add multiple MCP servers to Cursor, each providing different capabilities. The AI will automatically select the appropriate server based on your request.

### Custom MCP Servers

To create your own custom MCP server:

1. Use the `@modelcontextprotocol/server` package
2. Define your tools with clear names, descriptions, and parameter schemas
3. Implement handlers for each tool
4. Set up an HTTP server or use Stdio for communication

See the example servers in this repository for reference implementations.

## Resources

- [Cursor Documentation](https://docs.cursor.com/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
- [MCP GitHub Repository](https://github.com/anthropics/model-context-protocol)