# Cursor Model Context Protocol (MCP) Example

This repository contains example implementations of Model Context Protocol (MCP) servers that can be used with Cursor IDE to enhance AI capabilities with custom tools and data sources.

## What is the Model Context Protocol?

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). It allows you to create custom tools that can be used by AI assistants in Cursor.

Think of MCP like a USB-C port for AI applications:
- Just as USB-C provides a standardized way to connect your devices to various peripherals, MCP provides a standardized way to connect AI models to different data sources and tools
- It enables AI assistants to access real-time information, execute specialized functions, and enhance their capabilities beyond their training data

## Project Structure

```
example-mcp/
├── mcp-servers/                # Different MCP server implementations
│   ├── task-manager/           # Task manager MCP server example
│   ├── file-explorer/          # File explorer MCP server example
│   └── weather-service/        # Weather service MCP server example
├── client-examples/            # Example code for testing MCP servers
├── docs/                       # Additional documentation
└── README.md                   # This file
```

## MCP Server Examples

This repository includes several example MCP servers:

### 1. Task Manager MCP Server

A simple MCP server that provides tools for managing tasks:
- Create new tasks
- List all tasks
- Mark tasks as completed
- Delete tasks

### 2. File Explorer MCP Server

An MCP server that allows browsing and manipulating files:
- List files in a directory
- Read file contents
- Create new files
- Delete files

### 3. Weather Service MCP Server

An MCP server that provides weather information:
- Get current weather for a location
- Get weather forecast for a location
- Get historical weather data

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Cursor IDE](https://cursor.sh/)

### Setting Up an MCP Server

1. Navigate to one of the server directories:
   ```bash
   cd example-mcp/mcp-servers/task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Connecting to Cursor

To connect your MCP server to Cursor:

1. Open Cursor IDE
2. Go to Settings (gear icon in the bottom left)
3. Navigate to the "Features" section
4. Scroll down to "MCP"
5. Click "Add New MCP Server"
6. Enter a name for your server (e.g., "Task Manager MCP")
7. Choose the transport type:
   - **SSE**: Enter the URL of your MCP server (e.g., `http://localhost:3000`)
   - **Stdio**: Enter the command to start your server (e.g., `node /path/to/example-mcp/mcp-servers/task-manager/index.js`)
8. Click "Add"

## Using MCP Tools in Cursor

Once your MCP server is connected, you can use it in Cursor's AI features:

1. Open the AI chat panel (Cmd+I or Ctrl+I)
2. Ask the AI to use your MCP tools:
   ```
   Please create a new task titled "Implement user authentication" with the description "Add user login and registration functionality to the application."
   ```

3. The AI will use your MCP server to create the task and respond with the result

4. You can also ask for a list of tasks:
   ```
   Show me all the current tasks in the task manager.
   ```

## MCP Architecture

The Model Context Protocol follows a client-server architecture:

- **MCP Hosts**: Programs like Cursor IDE that want to access data through MCP
- **MCP Clients**: Protocol clients that maintain connections with servers
- **MCP Servers**: Lightweight programs that expose specific capabilities through the standardized Model Context Protocol
- **Local Data Sources**: Your computer's files, databases, and services that MCP servers can securely access
- **Remote Services**: External systems available over the internet that MCP servers can connect to

## Transports

MCP supports multiple transport mechanisms:

1. **Stdio transport**:
   - Uses standard input/output for communication
   - Ideal for local processes

2. **HTTP with SSE transport**:
   - Uses Server-Sent Events for server-to-client messages
   - HTTP POST for client-to-server messages

All transports use JSON-RPC 2.0 to exchange messages.

## Creating Your Own MCP Server

To create your own MCP server:

1. Create a new directory for your server
2. Initialize a Node.js project:
   ```bash
   npm init -y
   ```

3. Install required dependencies:
   ```bash
   npm install @modelcontextprotocol/server express
   ```

4. Create an index.js file with your server implementation
5. Register tools with names, descriptions, and parameter schemas
6. Implement handlers for each tool
7. Set up an Express server and apply the MCP middleware

See the example servers in this repository for reference implementations.

## Troubleshooting

If you encounter issues with your MCP server:

1. **Check server logs** for any errors
2. **Verify the server is running** and accessible at the specified URL
3. **Restart Cursor** if the connection status doesn't update
4. **Check Cursor's logs** for any connection errors (Help > Toggle Developer Tools)

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
- [Cursor MCP Documentation](https://docs.cursor.com/context/model-context-protocol)
- [MCP GitHub Repository](https://github.com/anthropics/model-context-protocol)

## License

This project is licensed under the MIT License - see the LICENSE file for details.