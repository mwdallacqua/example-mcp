/**
 * Task Manager MCP Client Example
 *
 * This example demonstrates how to use the Task Manager MCP server
 * from a Node.js client application.
 *
 * Note: In a real Cursor environment, the MCP client is built into
 * the application and you would interact with it through the AI interface.
 */

const fetch = require('node-fetch');

const MCP_SERVER_URL = 'http://localhost:3000';

/**
 * Helper function to call an MCP tool
 */
async function callMCPTool(toolName, params = {}) {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: 'invoke',
        params: {
          name: toolName,
          parameters: params,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`MCP Error: ${data.error.message}`);
    }

    return data.result;
  } catch (error) {
    console.error(`Error calling MCP tool ${toolName}:`, error.message);
    throw error;
  }
}

/**
 * Example usage of the Task Manager MCP server
 */
async function runTaskManagerExample() {
  console.log('Task Manager MCP Client Example\n');

  try {
    // 1. List all tasks
    console.log('Listing all tasks:');
    const listResult = await callMCPTool('list_tasks');
    console.log(JSON.stringify(listResult, null, 2));
    console.log('\n---\n');

    // 2. Create a new task
    console.log('Creating a new task:');
    const createResult = await callMCPTool('create_task', {
      title: 'Implement MCP client',
      description: 'Create a client application that demonstrates MCP functionality',
    });
    console.log(JSON.stringify(createResult, null, 2));
    console.log('\n---\n');

    // 3. List tasks again to see the new task
    console.log('Listing tasks after creation:');
    const updatedListResult = await callMCPTool('list_tasks');
    console.log(JSON.stringify(updatedListResult, null, 2));
    console.log('\n---\n');

    // 4. Complete a task
    console.log('Completing a task:');
    const completeResult = await callMCPTool('complete_task', {
      id: createResult.task.id,
    });
    console.log(JSON.stringify(completeResult, null, 2));
    console.log('\n---\n');

    // 5. List completed tasks
    console.log('Listing completed tasks:');
    const completedListResult = await callMCPTool('list_tasks', {
      filter: 'completed',
    });
    console.log(JSON.stringify(completedListResult, null, 2));
    console.log('\n---\n');

    // 6. Delete a task
    console.log('Deleting a task:');
    const deleteResult = await callMCPTool('delete_task', {
      id: createResult.task.id,
    });
    console.log(JSON.stringify(deleteResult, null, 2));
    console.log('\n---\n');

    // 7. List tasks after deletion
    console.log('Listing tasks after deletion:');
    const finalListResult = await callMCPTool('list_tasks');
    console.log(JSON.stringify(finalListResult, null, 2));

  } catch (error) {
    console.error('Error in task manager example:', error.message);
  }
}

// Run the example
console.log('Starting Task Manager MCP client example...');
console.log('Make sure the Task Manager MCP server is running at', MCP_SERVER_URL);
console.log('---\n');

runTaskManagerExample().then(() => {
  console.log('\nTask Manager MCP client example completed.');
});