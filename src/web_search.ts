import { McpError } from "@modelcontextprotocol/sdk/types.js";

// Web Search API 接口定义
export interface WebSearchResponse {
    code: number;
    log_id: string;
    msg: string | null;
    data: {
        _type: string;
        queryContext: {
            originalQuery: string;
        };
        webPages?: {
            totalEstimatedMatches: number;
            value: Array<{
                name: string;
                url: string;
                displayUrl: string;
                snippet: string;
                summary?: string;
                siteName: string;
                siteIcon?: string;
                dateLastCrawled: string;
                language: string;
                isFamilyFriendly: boolean;
                isNavigational: boolean;
            }>;
        };
        images?: {
            value: Array<{
                name: string;
                webSearchUrl: string;
                thumbnailUrl: string;
                datePublished: string;
                contentUrl: string;
                hostPageUrl: string;
                contentSize: string;
                encodingFormat: string;
                hostPageDisplayUrl: string;
                width: number;
                height: number;
                thumbnail: {
                    width: number;
                    height: number;
                    contentUrl: string;
                };
            }>;
        };
    };
}

export interface WebSearchParams {
    query: string;
    freshness?: "OneDay" | "OneWeek" | "OneMonth" | "OneYear" | "noLimit";
    summary?: boolean;
    count?: number;
    raw_json?: boolean;
}

export interface WebSearchImageValue {
    name: string;
    webSearchUrl: string;
    thumbnailUrl: string;
    datePublished: string;
    contentUrl: string;
    hostPageUrl: string;
    contentSize: string;
    encodingFormat: string;
    hostPageDisplayUrl: string;
    width: number;
    height: number;
    thumbnail: {
        width: number;
        height: number;
        contentUrl: string;
    };
}

export interface WebSearchResultValue {
    name: string;
    displayUrl: string;
    snippet: string;
    summary?: string;
    siteName: string;
    siteIcon?: string;
    dateLastCrawled: string;
    language: string;
    isFamilyFriendly: boolean;
    isNavigational: boolean;
    image?: WebSearchImageValue;
}

export interface FormattedWebSearchResult {
    query: string;
    totalEstimatedMatches: number;
    values: WebSearchResultValue[];
    images_values: WebSearchImageValue[];
}

// 错误处理函数
function handleSearchError(status: number, errorData: any): never {
    let code: number;
    let message: string;
    
    switch (status) {
        case 400:
            code = 3; // INVALID_ARGUMENT
            message = "请求参数错误";
            break;
        case 401:
            code = 16; // UNAUTHENTICATED
            message = "API KEY 无效";
            break;
        case 403:
            code = 7; // PERMISSION_DENIED
            message = "账户余额不足";
            break;
        case 429:
            code = 8; // RESOURCE_EXHAUSTED
            message = "请求频率超出限制";
            break;
        default:
            code = 2; // UNKNOWN
            message = errorData.message || "未知错误";
    }

    throw new McpError(code, `Bocha AI 搜索失败: ${message}`);
}

// 解析网页搜索结果
function parseWebPage(page: any): WebSearchResultValue {
    return {
        name: page.name,
        displayUrl: page.displayUrl || page.url,
        snippet: page.snippet,
        summary: page.summary,
        siteName: page.siteName,
        siteIcon: page.siteIcon,
        dateLastCrawled: page.dateLastCrawled,
        language: page.language || 'unknown',
        isFamilyFriendly: page.isFamilyFriendly || true,
        isNavigational: page.isNavigational || false
    };
}

// 解析图片搜索结果
function parseImage(image: any): WebSearchImageValue {
    return {
        name: image.name,
        webSearchUrl: image.webSearchUrl,
        thumbnailUrl: image.thumbnailUrl,
        datePublished: image.datePublished,
        contentUrl: image.contentUrl,
        hostPageUrl: image.hostPageUrl,
        contentSize: image.contentSize,
        encodingFormat: image.encodingFormat,
        hostPageDisplayUrl: image.hostPageDisplayUrl,
        width: image.width,
        height: image.height,
        thumbnail: {
            width: image.thumbnail?.width || 0,
            height: image.thumbnail?.height || 0,
            contentUrl: image.thumbnail?.contentUrl || image.thumbnailUrl
        }
    };
}

// Merge web pages and images results
function mergeWebPagesAndImages(webPages: any[], images: any[]): FormattedWebSearchResult['values'] {
    const imageMap = new Map(images.map(img => [img.hostPageUrl, img]));
    
    return webPages.map(page => ({
        ...parseWebPage(page),
        image: imageMap.get(page.url) ? parseImage(imageMap.get(page.url)) : undefined
    }));
}

// Parse web search response
export function parseWebSearchResponse(response: WebSearchResponse, includeImages: boolean = false): FormattedWebSearchResult {
    const webPages = response.data.webPages?.value || [];
    const images = includeImages ? (response.data.images?.value || []) : [];

    // Merge web pages and images results
    const values = mergeWebPagesAndImages(webPages, images);
    
    // Get unused images if there are unmerged images
    const unusedImages = images.filter(img => 
        !webPages.some(page => page.url === img.hostPageUrl)
    ).map(parseImage);

    return {
        query: response.data.queryContext.originalQuery,
        totalEstimatedMatches: response.data.webPages?.totalEstimatedMatches || 0,
        values,
        images_values: unusedImages
    };
}

// 格式化为 Markdown
function formatToMarkdown(result: FormattedWebSearchResult): string {
    let markdown = `## 搜索结果：${result.query}\n\n`;
    markdown += `找到约 ${result.totalEstimatedMatches} 条结果\n\n`;

    // 格式化网页结果
    result.values.forEach((value, index) => {
        markdown += `引用: ${index + 1}\n`;
        markdown += `标题: ${value.name}\n`;
        markdown += `URL: ${value.displayUrl}\n`;
        markdown += `摘要: ${value.snippet}\n`;
        if (value.summary) {
            markdown += `详细内容: ${value.summary}\n`;
        }
        markdown += `网站名称: ${value.siteName}\n`;
        if (value.siteIcon) {
            markdown += `网站图标: ${value.siteIcon}\n`;
        }
        markdown += `发布时间: ${value.dateLastCrawled}\n`;
        if (value.image) {
            markdown += `\n![${value.image.name}](${value.image.thumbnailUrl})\n`;
        }
        markdown += `\n---\n\n`;
    });

    // 格式化未匹配的图片
    if (result.images_values.length > 0) {
        markdown += `## 相关图片\n\n`;
        result.images_values.forEach((image, index) => {
            markdown += `引用: ${index + 1}\n`;
            markdown += `标题: ${image.name}\n`;
            markdown += `URL: ${image.contentUrl}\n`;
            markdown += `来源页面: ${image.hostPageDisplayUrl}\n`;
            markdown += `发布时间: ${image.datePublished}\n`;
            markdown += `尺寸: ${image.width}x${image.height}\n`;
            markdown += `\n![${image.name}](${image.thumbnailUrl})\n`;
            markdown += `\n---\n\n`;
        });
    }

    return markdown;
}

// Web Search API call function
export async function performWebSearch(
    apiKey: string,
    params: WebSearchParams
): Promise<string | FormattedWebSearchResult> {
    if (!apiKey) {
        throw new McpError(
            16, // UNAUTHENTICATED
            "BOCHA_API_KEY 没有设置"
        );
    }

    try {
        const response = await fetch("https://api.bochaai.com/v1/web-search", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: params.query,
                freshness: params.freshness || "noLimit",
                summary: params.summary || false,
                count: params.count || 10,
                includeImages: true, // 总是获取图片，由 raw_json 参数决定返回格式
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            handleSearchError(response.status, errorData);
        }

        const searchData = await response.json() as WebSearchResponse;
        
        // Validate response data
        if (!searchData.data || typeof searchData.data !== 'object') {
            throw new McpError(
                13, // INTERNAL
                "API 返回的数据格式无效"
            );
        }

        const result = parseWebSearchResponse(searchData, true);
        return params.raw_json ? result : formatToMarkdown(result);
    } catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        
        throw new McpError(
            13, // INTERNAL
            `搜索请求失败: ${error instanceof Error ? error.message : "未知错误"}`
        );
    }
} 