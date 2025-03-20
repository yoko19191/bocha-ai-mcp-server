import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { config } from "dotenv";
import { performWebSearch } from "./web_search.js";

// Load environment variables
config();

// Get API KEY from environment variables
const API_KEY = process.env.BOCHA_API_KEY;

// Create MCP server instance
const server = new McpServer({
    name: "bocha-ai",
    version: "0.0.1",
});

// Register MCP tools
server.tool(
    "bocha_web_search",
    "使用 Bocha AI 进行网页搜索，返回网页内容和相关图片。支持 Markdown 格式的易读输出或原始 JSON 数据",
    {
        query: z.string().describe("搜索关键词"),
        freshness: z.enum(["OneDay", "OneWeek", "OneMonth", "OneYear", "noLimit"]).optional().describe("搜索时间范围(default: noLimit)"),
        summary: z.boolean().optional().describe("是否显示详细文本摘要(default: false)"),
        count: z.number().min(1).max(50).optional().describe("返回结果数量(default: 10)"),
        raw_json: z.boolean().optional().describe("是否返回原始 JSON 数据而不是格式化的 Markdown(default: false)"),
    },
    async ({ query, freshness, summary, count, raw_json }) => {
        try {
            const searchResult = await performWebSearch(
                API_KEY!,
                { query, freshness, summary, count, raw_json }
            );

            return {
                content: [
                    {
                        type: "text",
                        text: typeof searchResult === 'string' ? searchResult : JSON.stringify(searchResult, null, 2),
                    },
                ],
            };
        } catch (error) {
            // McpError will be handled by MCP framework automatically
            throw error;
        }
    },
);

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Bocha AI MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});