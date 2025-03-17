# Coding Agent (LangGraph)

An example implementation of a CLI coding assistant built with LangGraph.

> [!NOTE]
> A more lightweight version without LangGraph is available in [my dotfiles repository](https://github.com/iinm/dotfiles/tree/main/agent).

## Features

- Available Tools
  - `exec_command`: Execute standard shell commands like `ls`, `cat`, etc.
  - `write_file`: Create or update files with specified content
  - `patch_file`: Apply changes to existing files using diff format
  - `tmux`: Run background processes or interactive sessions within tmux
  - `read_web_page`: Extract and process content from websites
  - (Experimental) `read_web_page_by_user_browser`: Access content from pages requiring authentication
- Supported Models
  - OpenAI
    - gpt-4o-mini
    - o3-mini
  - Anthropic
    - Claude Haiku
    - Claude Sonnet
    - Claude Sonnet (with extended thinking capabilities)
- Additional Features
  - Claude Prompt Caching: [See implementation](src/claude.ts)
  - (Experimental) Memory Bank: [See implementation details](src/agent.ts)

## Getting Started

### Installation

Install dependencies and build the agent:

```sh
npm install
npm run build
```

### Usage

Launch the agent with default settings:

```sh
./bin/agent
```

To use a specific model:

```sh
./bin/agent-<model>
```

(Replace `<model>` with your preferred model name)

### Development

For development work, run the agent without building:

```sh
env NODE_ENV=development ./bin/agent
```
