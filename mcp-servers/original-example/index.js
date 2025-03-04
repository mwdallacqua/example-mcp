const { MCPServer } = require('@modelcontextprotocol/server');
const express = require('express');

// Create a simple MCP server
const server = new MCPServer({
  name: 'Task Manager MCP',
  description: 'MCP server for the Task Manager application',
  version: '1.0.0',
});

// Register a tool to create a new task
server.registerTool({
  name: 'create_task',
  description: 'Create a new task in the task manager',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the task',
      },
      description: {
        type: 'string',
        description: 'The description of the task',
      },
    },
    required: ['title'],
  },
  handler: async (params) => {
    // In a real implementation, this would interact with your task manager
    return {
      success: true,
      task: {
        id: Math.floor(Math.random() * 1000),
        title: params.title,
        description: params.description || '',
        completed: false,
      },
    };
  },
});

// Register a tool to list all tasks
server.registerTool({
  name: 'list_tasks',
  description: 'List all tasks in the task manager',
  parameters: {
    type: 'object',
    properties: {},
  },
  handler: async () => {
    // In a real implementation, this would fetch tasks from your task manager
    return {
      success: true,
      tasks: [
        { id: 1, title: 'Example Task 1', description: 'This is an example task', completed: false },
        { id: 2, title: 'Example Task 2', description: 'Another example task', completed: true },
      ],
    };
  },
});

// Register a tool to mark a task as completed
server.registerTool({
  name: 'complete_task',
  description: 'Mark a task as completed',
  parameters: {
    type: 'object',
    properties: {
      task_id: {
        type: 'number',
        description: 'The ID of the task to mark as completed',
      },
    },
    required: ['task_id'],
  },
  handler: async (params) => {
    // In a real implementation, this would update the task in your task manager
    return {
      success: true,
      message: `Task ${params.task_id} marked as completed`,
    };
  },
});

// Register a tool to delete a task
server.registerTool({
  name: 'delete_task',
  description: 'Delete a task',
  parameters: {
    type: 'object',
    properties: {
      task_id: {
        type: 'number',
        description: 'The ID of the task to delete',
      },
    },
    required: ['task_id'],
  },
  handler: async (params) => {
    // In a real implementation, this would delete the task from your task manager
    return {
      success: true,
      message: `Task ${params.task_id} deleted`,
    };
  },
});

// Start the server
const app = express();
const PORT = 3000;

server.applyMiddleware(app);

app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
});