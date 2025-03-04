const { MCPServer } = require('@modelcontextprotocol/server');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Create an MCP server
const server = new MCPServer({
  name: 'File Explorer MCP',
  description: 'MCP server for browsing and manipulating files',
  version: '1.0.0',
});

// Register a tool to list files in a directory
server.registerTool({
  name: 'list_files',
  description: 'List files in a directory',
  parameters: {
    type: 'object',
    properties: {
      directory: {
        type: 'string',
        description: 'The directory path to list files from',
      },
    },
    required: ['directory'],
  },
  handler: async (params) => {
    try {
      const directory = params.directory;
      const files = await fs.readdir(directory);

      // Get detailed information about each file
      const fileDetails = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(directory, file);
          const stats = await fs.stat(filePath);

          return {
            name: file,
            path: filePath,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
      );

      return {
        success: true,
        directory,
        files: fileDetails,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

// Register a tool to read file contents
server.registerTool({
  name: 'read_file',
  description: 'Read the contents of a file',
  parameters: {
    type: 'object',
    properties: {
      filePath: {
        type: 'string',
        description: 'The path of the file to read',
      },
    },
    required: ['filePath'],
  },
  handler: async (params) => {
    try {
      const filePath = params.filePath;
      const content = await fs.readFile(filePath, 'utf8');
      const stats = await fs.stat(filePath);

      return {
        success: true,
        filePath,
        content,
        size: stats.size,
        modified: stats.mtime,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

// Register a tool to create a new file
server.registerTool({
  name: 'create_file',
  description: 'Create a new file with the specified content',
  parameters: {
    type: 'object',
    properties: {
      filePath: {
        type: 'string',
        description: 'The path where the file should be created',
      },
      content: {
        type: 'string',
        description: 'The content to write to the file',
      },
    },
    required: ['filePath', 'content'],
  },
  handler: async (params) => {
    try {
      const { filePath, content } = params;

      // Create parent directories if they don't exist
      const directory = path.dirname(filePath);
      await fs.mkdir(directory, { recursive: true });

      // Write the file
      await fs.writeFile(filePath, content);
      const stats = await fs.stat(filePath);

      return {
        success: true,
        filePath,
        size: stats.size,
        created: stats.birthtime,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

// Register a tool to delete a file
server.registerTool({
  name: 'delete_file',
  description: 'Delete a file or directory',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The path of the file or directory to delete',
      },
      recursive: {
        type: 'boolean',
        description: 'Whether to recursively delete directories',
      },
    },
    required: ['path'],
  },
  handler: async (params) => {
    try {
      const filePath = params.path;
      const recursive = params.recursive || false;
      const stats = await fs.stat(filePath);
      const isDirectory = stats.isDirectory();

      if (isDirectory) {
        if (recursive) {
          await fs.rm(filePath, { recursive: true, force: true });
        } else {
          // Check if directory is empty
          const files = await fs.readdir(filePath);
          if (files.length > 0) {
            return {
              success: false,
              error: 'Directory is not empty. Use recursive=true to delete non-empty directories.',
            };
          }
          await fs.rmdir(filePath);
        }
      } else {
        await fs.unlink(filePath);
      }

      return {
        success: true,
        path: filePath,
        isDirectory,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

// Start the server
const app = express();
const PORT = 3001;

server.applyMiddleware(app);

app.listen(PORT, () => {
  console.log(`File Explorer MCP server running at http://localhost:${PORT}`);
});