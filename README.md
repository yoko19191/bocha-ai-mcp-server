# Bocha AI Web Search MCP Server

An MCP (Model Context Protocol) server for Bocha AI web search functionality. This server provides a powerful search tool that returns web content and related images, supporting both human-readable Markdown output and raw JSON data.

## About Bocha AI

[Bocha AI (博查AI)](https://open.bochaai.com/) is a legal and compliant AI search service operating in the People's Republic of China(PRC), specifically designed for searching Chinese internet content. It provides comprehensive search capabilities while adhering to all relevant Chinese regulations and standards.

## Features

- Web Search: Retrieve relevant web content, summaries, and images
- Flexible Time Range: Search from the past day to unlimited time periods
- Smart Summaries: Optional detailed text summaries
- Dual Output Formats:
  - Markdown: Human-readable format with links and image previews
  - JSON: Structured data for programmatic processing
- Robust Error Handling: Comprehensive error management with clear messages

## Tools

### `bocha_web_search`

A powerful web search tool that retrieves content from Chinese internet sources.

- `query` (required): Search keywords

  - Type: string
  - Description: The search terms to look up
- `freshness` (optional): Time range for search results

  - Type: enum
  - Values: "OneDay", "OneWeek", "OneMonth", "OneYear", "noLimit"
  - Default: "noLimit"
  - Description: Filter results by time period
- `summary` (optional): Enable detailed text summaries

  - Type: boolean
  - Default: false
  - Description: Whether to generate comprehensive summaries for search results
- `count` (optional): Number of results to return

  - Type: number
  - Range: 1-50
  - Default: 10
  - Description: Control the amount of search results
- `raw_json` (optional): Return format control

  - Type: boolean
  - Default: false
  - Description: When false, returns human-readable Markdown; when true, returns structured JSON data

## Setup

make sure you have node.js and npm install already.

```bash
git clone git@github.com:yoko19191/bocha-ai-mcp-server.git
cd bocha-ai-mcp
cp .env.example .env # configure your bocha api key
npm install
npm run build
```


## Configuration

**mcp.json**
```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/bocha-ai-mcp-server/build/index.js"
      ],
      "env": {
        "BOCHA_API_KEY": "<YOUR_BOCHA_API_KEY>"
      }
    }
  }
}
```


**cursor**
```bash
env BOCHA_API_KEY=YOUR_BOCHA_API_KEY node /ABSOLUTE/PATH/bocha-ai-mcp-server/build/index.js
```



## FURTURE_WORK

This project currently implements the Web Search API functionality of Bocha AI. Future updates will include support for:

- AI Search: Advanced semantic search capabilities
- Agent Search: Intelligent agent-based search features

## License

MIT
