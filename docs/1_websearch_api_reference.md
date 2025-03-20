# Bocha AI Web Search API reference

**API 功能特性**:

从全网搜索任何网页信息和网页链接，结果准确、摘要完整，更适合AI使用, 还能配置搜索时间范围、是否显示摘要等, 允许搜索搜网页、搜图片.

**搜索结果**：

包括网页、图片、 ~视频~ ，Response格式兼容Bing Search API。

* 网页包括name、url、snippet、summary、siteName、siteIcon等信息
* 图片包括 contentUrl、hostPageUrl、width、height等信息
* 视频搜索目前在WebSearch中暂未开放

**API接口信息**：

- 接口域名是[https://api.bochaai.com](https://api.bochaai.com/)
- EndPoint为[https://api.bochaai.com/v1/web-search](https://api.bochaai.com/v1/web-search) 。

## 请求方式(method)

POST

## 请求头(request_header)

| 参数          | 取值             | 说明                                                                                                               |
| ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Authorization | Bearer {API KEY} | 鉴权参数，示例：Bearer xxxxxx，API KEY请先前往博查AI开放平台（https://open.bochaai.com）>** API KEY 管理**中获取。 |
| Content-Type  | application/json | 解释请求正文的方式。                                                                                               |

## 请求体 (request_body)

| 参数      | 类型    | 必填 | 说明                                                          | 可选项                                                            |
| --------- | ------- | ---- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| query     | String  | 是   | 用户的搜索词。                                                |                                                                   |
| fressness | String  | 否   | 搜索指定时间范围内的网页。                                    | ["OneDay", "OneWeek", "OneMonth", "OneYear", "noLimit"(default))] |
| summary   | Boolean | 否   | 是否显示文本摘要.                                             | [true, false(default))]                                           |
| count     | Int     | 否   | 返回结果的条数（实际返回结果数量可能会小于count指定的数量）。 | range(0, 50), 10(default)                                         |
| page      | Int     | 否   | 页码                                                          | 1(default)                                                        |

## 响应返回(response_content)

**SearchData**

- `_type`: "SearchResponse" 搜索的类型
- `queryContext`: WebSearchQueryContext
- `webPages`: WebSearchWebPages 搜索的网页结果
- `images`: WebSearchImages 搜索的图片结果
- `videos`: WebSearchVideos 搜索的视频结果

**WebSearchQueryContext**

- `originalQuery`: String 原始的搜索关键字

**WebSearchWebPages**

- `webSearchUrl`: String
- `totalEstimatedMatches`: int 搜索匹配的网页总数
- `value`: List `<WebPageValue>`
- `someResultsRemoved`: boolean 结果中是否有被安全过滤

**WebPageValue**

- `id`: String 网页的排序ID
- `name`: String 网页的标题
- `url`: String 网页的URL
- `displayUrl`: String 网页的展示URL（url decode后的格式）
- `snippet`: String 网页内容的简短描述
- `summary`: String 网页内容的文本摘要，当请求参数中 summary 为 true 时显示此属性
- `siteName`: String 网页的网站名称
- `siteIcon`: String 网页的网站图标
- `dateLastCrawled`: String 网页的 `发布时间`（此处其实是发布时间，名字起为LastCrawled是兼容性适配）
- `cachedPageUrl`: String 网页的缓存页面URL
- `language`: String 网页的语言
- `isFamilyFriendly`: boolean 是否为家庭友好的页面
- `isNavigational`: boolean 是否为导航性页面

> 接口中返回的值（例如：2025-02-23T08:18:30Z）实际上要表达的是 UTC+8 北京时间2025-02-23 08:18:30，并非UTC时间

**WebSearchImages**

- id: String
- readLink: String
- webSearchUrl: String
- isFamilyFriendly: boolean
- value: List `<ImageValue>`

**WebSearchVideos**

- id: String
- readLink: String
- webSearchUrl: String
- isFamilyFriendly: boolean
- scenario: String
- value: List `<VideoValue>`

**ImageValue**

- webSearchUrl: String
- name: String
- thumbnailUrl: String
- datePublished: String
- contentUrl: String
- hostPageUrl: String
- contentSize: String
- encodingFormat: String
- hostPageDisplayUrl: String
- width: int
- height: int
- thumbnail: Thumbnail

**VideoValue**

- webSearchUrl: String
- name: String
- description: String
- thumbnailUrl: String
- publisher: List `<Publisher>`
- creator: Creator
- contentUrl: String
- hostPageUrl: String
- encodingFormat: String
- hostPageDisplayUrl: String
- width: int
- height: int
- duration: String
- motionThumbnailUrl: String
- embedHtml: String
- allowHttpsEmbed: boolean
- viewCount: int
- thumbnail: Thumbnail
- allowMobileEmbed: boolean
- isSuperfresh: boolean
- datePublished: String

**Creator**

- name: String

**Publisher**

- name: String

**Thumbnail**

- height: int
- width: int

**RankingResponse**

- mainline: Mainline

**Mainline**

- items: List `<MainlineItem>`

**MainlineItem**

- answerType: String
- value: MainlineItemValue

**MainlineItemValue**

- id: String

## example

e.g.request_body

```json
{
    "query": "阿里巴巴2024年的esg报告",
    "freshness": "noLimit",
    "summary": false, // 当设置为 true 的时候显示摘要
    "count": 10
}
```

e.g.response_content

```json
{
    "code": 200,
    "log_id": "d71841ad20095f61",
    "msg": null,
    "data": {
        "_type": "SearchResponse",
        "queryContext": {
            "originalQuery": "阿里巴巴2024年的esg报告"
        },
        "webPages": {
            "webSearchUrl": "",
            "totalEstimatedMatches": 8912791,
            "value": [
                {
                    "id": null,
                    "name": "阿里巴巴发布2024年ESG报告　持续推进减碳与数字化普惠",
                    "url": "https://www.alibabagroup.com/document-1752073403914780672",
                    "displayUrl": "https://www.alibabagroup.com/document-1752073403914780672",
                    "snippet": "阿里巴巴集团发布《2024财年环境、社会和治理（ESG）报告》（下称“报告”），详细分享过去一年在ESG各方面取得的进展。报告显示，阿里巴巴扎实推进减碳举措，全集团自身运营净碳排放和价值链碳...",
                    "siteName": "www.alibabagroup.com",
                    "siteIcon": "https://th.bochaai.com/favicon?domain_url=https://www.alibabagroup.com/document-1752073403914780672",
                    "dateLastCrawled": "2024-07-22T00:00:00Z",
                    "cachedPageUrl": null,
                    "language": null,
                    "isFamilyFriendly": null,
                    "isNavigational": null
                },
                {
                    "id": null,
                    "name": "阿里巴巴发布2024年ESG报告: 保持前瞻、保持善意、保持务实",
                    "url": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "displayUrl": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "snippet": "2024财年是阿里巴巴深化ESG治理的一年。在环境保护议题中，阿里巴巴以ESG治理机制的保障为基础，继续探索“在发展中减碳”，通过科技提升能源利用效率，使用可再生能源、带动生态伙伴参与等方式，推进绿色低碳高质量发展。数据显示，2024财年，阿里巴巴实现自身运营碳排放和价值链碳排放强度的“双降”目标；自身运营中的减排量达到232.0万吨，相比上一财年显著提升63.5%；清洁电力使用比例...",
                    "siteName": "大鱼号",
                    "siteIcon": "https://th.bochaai.com/favicon?domain_url=https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "dateLastCrawled": "2024-07-22T11:54:00Z",
                    "cachedPageUrl": null,
                    "language": null,
                    "isFamilyFriendly": null,
                    "isNavigational": null
                },
                {
                    "id": null,
                    "name": "186页|阿里巴巴：2024年环境、社会和治理（ESG）报告",
                    "url": "https://m.sohu.com/a/815036254_121819701/?pvid=000115_3w_a",
                    "displayUrl": "https://m.sohu.com/a/815036254_121819701/?pvid=000115_3w_a",
                    "snippet": "阿里巴巴集团的2024年环境、社会和治理（ESG）报告涵盖了公司在可持续发展方面的多项进展和成就。报告强调了公司的使命—“让天下没有难做的生意”，并通过技术创新和平台优势，支持中小微企...",
                    "siteName": "搜狐网",
                    "siteIcon": "https://th.bochaai.com/favicon?domain_url=https://m.sohu.com/a/815036254_121819701/?pvid=000115_3w_a",
                    "dateLastCrawled": "2024-11-07T06:50:00Z",
                    "cachedPageUrl": null,
                    "language": null,
                    "isFamilyFriendly": null,
                    "isNavigational": null
                },
                {
                    "id": null,
                    "name": "阿里巴巴发布2024年ESG报告，阿里云数据中心清洁能源占比达56.0%",
                    "url": "http://tech.cnr.cn/techph/20240722/t20240722_526807992.shtml",
                    "displayUrl": "http://tech.cnr.cn/techph/20240722/t20240722_526807992.shtml",
                    "snippet": "阿里巴巴集团发布《环境、社会和治理报告（2024）》（以下简称“ESG报告”）提及，阿里巴巴自身运营减少碳排放量达232.0万吨，相比上一财年显著提升63.5%，其中，阿里云自建数据中心电力使用效率（PUE）从 2023财年1.215降至1.2...",
                    "siteName": "央广网",
                    "siteIcon": "https://th.bochaai.com/favicon?domain_url=http://tech.cnr.cn/techph/20240722/t20240722_526807992.shtml",
                    "dateLastCrawled": "2024-07-22T17:54:38Z",
                    "cachedPageUrl": null,
                    "language": null,
                    "isFamilyFriendly": null,
                    "isNavigational": null
                },
                {
                    "id": null,
                    "name": "CSR周刊：京东物流携手野生救援共推环境保护，阿里巴巴发布2024年ESG报告引领可持续发展",
                    "url": "https://m.thepaper.cn/newsDetail_forward_28258281",
                    "displayUrl": "https://m.thepaper.cn/newsDetail_forward_28258281",
                    "snippet": "·阿里巴巴发布2024年ESG报告：保持前瞻、保持善意、保持务实·TT语音发布首份网络信息内容生态治理报告·Atlas Corp.发布《2023年可持续发展报告》·唯品会发布《环境、社会及治理报告（2023...",
                    "siteName": "澎拜",
                    "siteIcon": "https://th.bochaai.com/favicon?domain_url=https://m.thepaper.cn/newsDetail_forward_28258281",
                    "dateLastCrawled": "2024-07-31T18:09:00Z",
                    "cachedPageUrl": null,
                    "language": null,
                    "isFamilyFriendly": null,
                    "isNavigational": null
                },
                {
                    "id": null,
                    "name": "阿里巴巴ESG报告：2024财年优酷无障碍剧场播放次数近百万",
                    "url": "https://t.m.youth.cn/transfer/index/url/news.youth.cn/yl/202407/t20240722_15396110.htm",
                    "displayUrl": "https://t.m.youth.cn/transfer/index/url/news.youth.cn/yl/202407/t20240722_15396110.htm",
                    "snippet": "阿里巴巴2024年ESG报告截图 无障碍电影在影片台词与声效间隙增加旁白解说，帮助视障观众了解剧情。过去一年，优酷无障碍剧场以科技推动无障碍观影建设，开发明星AI语音讲述包;在线上积极扩充片库，加快新热剧集、电影的更新速度;在线下进社区、进影院、进校园，为视障者带去不一样的观影体验。在取得诸多成绩此同时，越来越多的公益机构和爱心人士也加入其中，共同为中国无障碍事业发展贡献力量。前沿技术是优酷无障碍剧场发展的重要力量。两个月前，无障碍剧场上线演员胡歌的AI语音讲述包，这也是国内视听平台首次运...",
                    "siteName": "中国青年网",
                    "siteIcon": "https://th.bochaai.com/favicon?domain_url=https://t.m.youth.cn/transfer/index/url/news.youth.cn/yl/202407/t20240722_15396110.htm",
                    "dateLastCrawled": "2024-07-22T18:48:00Z",
                    "cachedPageUrl": null,
                    "language": null,
                    "isFamilyFriendly": null,
                    "isNavigational": null
                },
                {
                    "id": null,
                    "name": "2024年阿里巴巴环境、社会和治理（ESG）报告-阿里巴巴",
                    "url": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "displayUrl": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "snippet": "《2024年阿里巴巴环境、社会和治理（ESG）报告》由阿里巴巴集团发布，涵盖修复绿色星球、支持员工发展、服务可持续的美好生活、助力中小微企业高质量发展、助力提升社会包容和韧性、推动人人参与的公益、构建信任等方面内容。在修复绿色星球方面，阿里巴巴致力于实现碳中和，通过技术创新和管理优化降低自身运营和价值链的碳排放，同时带动和赋能平台生态减排；在支持员工发展方面，推动多元、平等和共融，吸引和保留人才，促进员工健康与活力；在...",
                    "siteName": "搜狐网",
                    "siteIcon": "https://th.bochaai.com/favicon?domain_url=https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "dateLastCrawled": "2024-07-26T12:33:00Z",
                    "cachedPageUrl": null,
                    "language": null,
                    "isFamilyFriendly": null,
                    "isNavigational": null
                }
            ],
            "someResultsRemoved": true
        },
        "images": {
            "id": null,
            "readLink": null,
            "webSearchUrl": null,
            "value": [
                {
                    "webSearchUrl": null,
                    "name": null,
                    "thumbnailUrl": "http://dayu-img.uc.cn/columbus/img/oc/1002/45628755e2db09ccf7e6ea3bf22ad2b0.jpg",
                    "datePublished": null,
                    "contentUrl": "http://dayu-img.uc.cn/columbus/img/oc/1002/45628755e2db09ccf7e6ea3bf22ad2b0.jpg",
                    "hostPageUrl": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "contentSize": null,
                    "encodingFormat": null,
                    "hostPageDisplayUrl": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "width": 553,
                    "height": 311,
                    "thumbnail": null
                },
                {
                    "webSearchUrl": null,
                    "name": null,
                    "thumbnailUrl": "http://image.uczzd.cn/15500294364735623464.jpg?id=0&from=export",
                    "datePublished": null,
                    "contentUrl": "http://image.uczzd.cn/15500294364735623464.jpg?id=0&from=export",
                    "hostPageUrl": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "contentSize": null,
                    "encodingFormat": null,
                    "hostPageDisplayUrl": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "width": 0,
                    "height": 0,
                    "thumbnail": null
                },
                {
                    "webSearchUrl": null,
                    "name": null,
                    "thumbnailUrl": "http://image.uczzd.cn/11174338884233139640.jpg?id=0&from=export",
                    "datePublished": null,
                    "contentUrl": "http://image.uczzd.cn/11174338884233139640.jpg?id=0&from=export",
                    "hostPageUrl": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "contentSize": null,
                    "encodingFormat": null,
                    "hostPageDisplayUrl": "https://mparticle.uc.cn/article_org.html?uc_param_str=frdnsnpfvecpntnwprdssskt#!wm_cid=632457937121448960!!wm_id=b3f0578cbbd8434da8e437702e399f91",
                    "width": 0,
                    "height": 0,
                    "thumbnail": null
                },
                {
                    "webSearchUrl": null,
                    "name": null,
                    "thumbnailUrl": "http://q9.itc.cn/q_70/images01/20240726/3bbb91f089924a56b5abb95d0776fcc5.png",
                    "datePublished": null,
                    "contentUrl": "http://q9.itc.cn/q_70/images01/20240726/3bbb91f089924a56b5abb95d0776fcc5.png",
                    "hostPageUrl": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "contentSize": null,
                    "encodingFormat": null,
                    "hostPageDisplayUrl": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "width": 1285,
                    "height": 722,
                    "thumbnail": null
                },
                {
                    "webSearchUrl": null,
                    "name": null,
                    "thumbnailUrl": "http://q6.itc.cn/q_70/images01/20240726/490b71f2963b43588bb053f20bb4d775.png",
                    "datePublished": null,
                    "contentUrl": "http://q6.itc.cn/q_70/images01/20240726/490b71f2963b43588bb053f20bb4d775.png",
                    "hostPageUrl": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "contentSize": null,
                    "encodingFormat": null,
                    "hostPageDisplayUrl": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "width": 883,
                    "height": 374,
                    "thumbnail": null
                },
                {
                    "webSearchUrl": null,
                    "name": null,
                    "thumbnailUrl": "http://q7.itc.cn/q_70/images01/20240726/ee26d6fa8658472d8b4c5e7236b1640a.png",
                    "datePublished": null,
                    "contentUrl": "http://q7.itc.cn/q_70/images01/20240726/ee26d6fa8658472d8b4c5e7236b1640a.png",
                    "hostPageUrl": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "contentSize": null,
                    "encodingFormat": null,
                    "hostPageDisplayUrl": "https://m.sohu.com/a/796245119_121713887/?pvid=000115_3w_a",
                    "width": 1285,
                    "height": 722,
                    "thumbnail": null
                }
            ],
            "isFamilyFriendly": null
        },
        "videos": null
    }
}
```

## 异常码处理

**403 error**

余额不足

```json
{
  "code": "403",
  "message": "You do not have enough money",
  "log_id": "c66aac17eab1bb7e"
}
```

**400 error**

请求参数缺失

```json
{
  "code": "400",
  "message": "Missing parameter query",
  "log_id": "c66aac17eab1bb7e"
}
```

**400 error**
权限校验失败，Header 缺少 Authorization

```json
{
  "code": "400",
  "message": "The API KEY is missing",
  "log_id": "c66aac17eab1bb7e"
}
```

**401 error**
API KEY无效

```json
{
  "code": "401",
  "message": "Invalid API KEY",
  "log_id": "c66aac17eab1bb7e"
}
```

**429 error**
请求频达到率限制

```json
{
  "code": "429",
  "message": "You have reached the request limit",
  "log_id": "c66aac17eab1bb7e"
}
```

**500 error**
各种异常

```json
{
  "code": "500",
  "message": "xxxx",
  "log_id": "c66aac17eab1bb7e"
}
```
