# Codex Autonomous Guidelines


This document outlines the tools and logic Codex should use to manage this project. Codex is authorized to use these tools proactively—don't wait for permission; just solve the problem.


## MCP Toolset

### Project & Workspace Context
- Context7 (mcp_servers.context7): Use for high-density workspace mapping and semantic search. This is your primary tool for finding "where" things are across the entire repository.
- Serena (mcp_servers.serena): Use for localized @codex context and project-specific logic. Essential for understanding the current working directory's architectural intent.


### Logic & Research
- Sequential Thinking (mcp_servers.sequentialThinking): Use for complex debugging, multi-file refactors, or any task requiring a structured, step-by-step plan to avoid logic loops.
- DuckDuckGo Search (mcp_servers.ddg-search): Use for external documentation, error code lookups, or verifying the latest version of a dependency.
- Time (mcp_servers.time): Use for any task requiring real-world timestamps, scheduling logic, or temporal data.


## Browser Automation
- Playwright CLI: Utilize playwright-cli via playwright-cli **skill** for all browser automation, web testing, form filling, and data extraction needs whenever a task requires interacting with a live website or web application.


## Tool Selection Matrix
| If the task involves...                     | Use this tool...   |
|---------------------------------------------|--------------------|
| Finding a specific utility function         | context7           |
| Understanding the current project structure | serena             |
| Planning a complex feature migration        | sequentialThinking |
| Verifying a UI element on a dev site        | playwright-cli     |
| Checking for a library's breaking changes   | ddg-search         |
| Generating a log with a timestamp           | mcp-server-time    |


## Execution Protocol
- Analyze Context: Use context7 or serena to ground yourself in the existing code before writing a single line.
- Chain Tools: If a web search (ddg-search) suggests a fix, use sequentialThinking to plan the implementation, and playwright-cli to verify the result if it's a front-end change.
- Proactive Thinking: If a request is ambiguous, use sequentialThinking to explore possibilities before asking the user for clarification.

## Domain Rules: IB MYP
- All grading logic must follow the 0-8 Criterion scale.
- Refer to `.serena/memories/myp_grading_logic.md` for the specific subject-to-criteria mapping before writing any backend validation.


### Note to Codex: You have the keys to the kingdom. Use them to maintain a clean, efficient, and well-documented codebase.
