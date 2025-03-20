# AI Search API

**API 功能特性:**

调用AI搜索回答用户问题，返回网页、图片、多模态参考源（模态卡）、总结答案和追问问题。

**搜索结果**:

* 网页：返回最多50条网页信息，含摘要。
* 图片：网页中附带的图片。
* 模态卡：模态卡是指搜索引擎中，根据用户不同的搜索词，动态显示的更深层次的信息(例如天气、百科、医疗、万年历、火车、星座属相、贵金属、汇率、油价、手机、股票、汽车等)。当用户搜索：北京天气时返回天气卡，搜索日期时返回日历卡.
  * weather（天气）- 国内天气、国际天气
  * baike（百科）- 百科类内容
  * medical（医疗）- 医疗权威内容
  * calendar（万年历）- 日历
  * train（火车）- 火车交通车次（含票价）、火车时刻表
  * star（星座属相）- 星座运势、属相等
  * gold（贵金属）- 金价、期货价格等
  * exchangerate（汇率）- 汇率信息
  * oil（油价）- 油价信息
  * phone（手机参数对比）- 手机参数、手机参数对比
  * stock（股票）- 股票信息
  * car（汽车）- 汽车内容，包括车型库和汽车品牌

**API接口信息**:

- 接口域名：https://api.bochaai.com
- EndPoint：https://api.bochaai.com/v1/ai-search

## 请求方式(method)

POST

## 请求头(request_header)

| 参数          | 取值             | 说明                                                                                                               |
| ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| Authorization | Bearer {API KEY} | 鉴权参数，示例：Bearer xxxxxx，API KEY请先前往博查AI开放平台（https://open.bochaai.com）>** API KEY 管理**中获取。 |
| Content-Type  | application/json | 解释请求正文的方式。                                                                                               |
| Connection    | keep-alive       | 网络连接在当前请求/响应后是否应保持打开状态或应关闭。                                                              |
| Accept        | \*/\*            | 客户端可以接受的媒体类型。 设置为\*/\* 接受所有类型。                                                              |

## 请求体 (request_body)

| 参数      | 类型    | 必填 | 说明                                                                                                                                         | 可选项                                                            |
| --------- | ------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| query     | String  | 是   | 用户的搜索词。                                                                                                                               |                                                                   |
| fressness | String  | 否   | 搜索指定时间范围内的网页。                                                                                                                   | ["OneDay", "OneWeek", "OneMonth", "OneYear", "noLimit"(default))] |
| count     | Int     | 否   | 返回结果的条数（实际返回结果数量可能会小于count指定的数量）。                                                                                | range(0, 50), 10(default)                                         |
| answer    | Boolean | 否   | 是否使用大模型进行回答. 设置 true 表示使用大模型回答, 接口返回总结答案、追问问题; 设置 false 表示关闭大模型回答, 不在输出总结答案和追问问题. | [true(default), false]                                            |
| stream    | Boolean | 否   | 是否启动流式回答. 设置 true 表示采用非流式响应; 设置 false 表示使用流失响应.                                                                 | [true, false(default)]流式响应内容(streaming_content)             |

e.g. request

```json
curl --location 'https://api.bochaai.com/v1/ai-search' \
--header 'Authorization: Bearer sk-xxxxxxxx' \
--header 'Content-Type: application/json' \
--data '{
  "query": "西瓜的功效与作用",
  "freshness": "noLimit",
  "answer": false,
  "stream": false
}'
```

e.g. steam request

```json
curl --location 'https://api.bochaai.com/v1/ai-search' \
--header 'Authorization: Bearer sk-xxxxxxxx' \
--header 'Content-Type: application/json' \
--data '{
  "query": "天空为什么是蓝色的",
  "stream": true
}'
```

## 非流式响应返回(response_content)

当使用非流式响应时，在大模型生成了所有要返回的内容后，将返回的消息发送给客户端，调用者无需拼接返回内容。但客户端必须等待整个数据加载完毕才能处理它。

- `conversation_id` : string 会话ID
- `messages` : List `<Object>` 全部消息都处理完成后，以 JSON 数组形式返回。详情请参考流式返回中 **Message** **Object **消息结构的具体说明。
- `code`: Integer 状态码。
- `msg` : String 状态信息。

e.g. response_content

```json
{
    "code": 200,
    "log_id": "1c66382f8ee339f4",
    "conversation_id": "8eaad0b73cf342d299579cc3f7aa364c",
    "messages": [
        {
            "role": "assistant",
            "type": "source",
            "content_type": "webpage", // 网页信息
            "content": "{\"webSearchUrl\":\"https://bochaai.com/search?q=西瓜的功效与作用\",\"value\":[{\"id\":\"https://api.bochaai.com/v1/#WebPages.0\",\"name\":\"半截楼西瓜\",\"url\":\"https://baike.sogou.com/v66235606.htm\",\"displayUrl\":\"https://baike.sogou.com/v66235606.htm\",\"snippet\":\"西瓜性寒，味甘，归心、胃、膀胱经；具有清热解暑、生津止渴、利尿除烦的功效；主治胸膈气壅，满闷不舒，小便不利，口鼻生疮，暑热，中暑，解酒毒等症。\",\"summary\":\"西瓜性寒，味甘，归心、胃、膀胱经；具有清热解暑、生津止渴、利尿除烦的功效；主治胸膈气壅，满闷不舒，小便不利，口鼻生疮，暑热，中暑，解酒毒等症。\",\"siteName\":\"搜狗百科\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://baike.sogou.com/v66235606.htm\",\"dateLastCrawled\":\"2022-06-08T08:57:00Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.1\",\"name\":\"排毒\",\"url\":\"https://baike.sogou.com/v111643.htm\",\"displayUrl\":\"https://baike.sogou.com/v111643.htm\",\"snippet\":\"是瓜果之首，不仅具有食用价值，而且医药价值颇高，是消暑、解渴、利尿之佳品，民间有“天然白虎汤”之称。当遇到酷热特别是发烧时，抱着西瓜睡觉，比敷冰袋降温还有效。主要功效可概括如下： 1、西瓜可清热解暑，...\",\"summary\":\"是瓜果之首，不仅具有食用价值，而且医药价值颇高，是消暑、解渴、利尿之佳品，民间有“天然白虎汤”之称。当遇到酷热特别是发烧时，抱着西瓜睡觉，比敷冰袋降温还有效。主要功效可概括如下： 1、西瓜可清热解暑，除烦止渴：西瓜中含有大量的水分，在急性热病发烧、口渴汗多、烦躁时，吃上一块又甜又沙、水分十足的西瓜，症状会马上改善; 2、西瓜所含的糖和盐能利尿并消除肾脏炎症，蛋白酶能把不溶性蛋白质转化为可溶的蛋白质，增加肾炎病人的营养 3、西瓜还含有能使血压降低的物质; 4、吃西瓜后尿量会明显增加，这可以减少胆色素的含量，并可使大便通畅，对治疗黄疸有一定作用; 5、新鲜的西瓜汁和鲜嫩的瓜皮增加皮肤弹性，减少皱纹，增添光泽。 Tips：但西瓜性寒，一次不能吃得过多。\",\"siteName\":\"搜狗百科\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://baike.sogou.com/v111643.htm\",\"dateLastCrawled\":\"2024-09-25T21:17:07Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.2\",\"name\":\"西瓜\",\"url\":\"https://baike.sogou.com/v174417913.htm\",\"displayUrl\":\"https://baike.sogou.com/v174417913.htm\",\"snippet\":\"清热解暑，除烦止渴，利小便。主治：暑热或温热病热盛伤津，心烦口渴；心火上炎，口舌生疮；湿热蕴结下焦，小便黄赤不利。 \",\"summary\":\"清热解暑，除烦止渴，利小便。主治：暑热或温热病热盛伤津，心烦口渴；心火上炎，口舌生疮；湿热蕴结下焦，小便黄赤不利。 \",\"siteName\":\"搜狗百科\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://baike.sogou.com/v174417913.htm\",\"dateLastCrawled\":\"2023-08-28T15:27:14Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.3\",\"name\":\"西瓜的功效与作用\",\"url\":\"https://www.rwys.com/articlecontent/74868\",\"displayUrl\":\"https://www.rwys.com/articlecontent/74868\",\"snippet\":\"清热去火､通便､除烦解渴｡西瓜的第一个作用是可以清热去火,由于从中医养生的视角上而言西瓜性偏寒性,在夏季假如适度服食可以非常好的消除炎热｡西瓜的第二个作用是可以通便,假如由于肝脏功能､肾脏功能和心脏功...\",\"summary\":\"清热去火､通便､除烦解渴｡西瓜的第一个作用是可以清热去火,由于从中医养生的视角上而言西瓜性偏寒性,在夏季假如适度服食可以非常好的消除炎热｡西瓜的第二个作用是可以通便,假如由于肝脏功能､肾脏功能和心脏功能阻碍所导致的浮肿,适度服食西瓜可以针对小便不畅造成的浮肿具有显著的减轻功效｡西瓜的第三个作用是可以除烦解渴,由于西瓜之中含有很多水份可以为人体填补充裕的液体,从而做到除烦解渴的作用｡\",\"siteName\":\"如闻医生\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://www.rwys.com/articlecontent/74868\",\"dateLastCrawled\":\"2024-12-25T03:57:59Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.4\",\"name\":\"西瓜功效与作用-有来医生\",\"url\":\"https://www.youlai.cn/ask/856112.html\",\"displayUrl\":\"https://www.youlai.cn/ask/856112.html\",\"snippet\":\"西瓜功效与作用｡第一､西瓜可清热解暑,除烦止渴｡第二､西瓜所含的糖和盐能利尿并消除肾脏炎症,蛋白酶能把不溶性蛋白质转化为可溶性蛋白质,增加肾炎病人的营养｡第三､西瓜还有能使血压降低的物质,能起到降血压...\",\"summary\":\"西瓜功效与作用｡第一､西瓜可清热解暑,除烦止渴｡第二､西瓜所含的糖和盐能利尿并消除肾脏炎症,蛋白酶能把不溶性蛋白质转化为可溶性蛋白质,增加肾炎病人的营养｡第三､西瓜还有能使血压降低的物质,能起到降血压的作用｡第四､吃西瓜后尿量会明显增加,这可以减少胆色素的含量,并可使大便通畅｡治疗黄疸有一定作用｡注意事项:产妇的体质比较虚弱,而从中医的角度来说,西瓜属寒性,所以吃多了会导致过寒而损伤脾胃｡ \",\"siteName\":\"有来医生\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://www.youlai.cn/ask/856112.html\",\"dateLastCrawled\":\"2023-10-15T18:00:00Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.5\",\"name\":\"西瓜的功效与作用及禁忌是什么-有来医生\",\"url\":\"https://www.youlai.cn/ask/1805824.html\",\"displayUrl\":\"https://www.youlai.cn/ask/1805824.html\",\"snippet\":\"西瓜是一种日常生活中非常常见的水果,从中医的角度来讲具有一定的清热利湿､利水消肿的功效｡适量的吃一些西瓜可以有效的预防感冒,并且可以在一定程度上改善水肿的现象,能够加速身体内废物的排出,从而起到一定的...\",\"summary\":\"西瓜是一种日常生活中非常常见的水果,从中医的角度来讲具有一定的清热利湿､利水消肿的功效｡适量的吃一些西瓜可以有效的预防感冒,并且可以在一定程度上改善水肿的现象,能够加速身体内废物的排出,从而起到一定的降低血压､降低血脂的作用｡但是需要注意,因为西瓜本身属于一种寒凉性的食物,吃得太多容易导致腹泻现象,脾胃虚弱的人群建议最好不要使用｡ \",\"siteName\":\"有来医生\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://www.youlai.cn/ask/1805824.html\",\"dateLastCrawled\":\"2023-03-25T13:46:00Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.6\",\"name\":\"西瓜的功效与作用-有来医生\",\"url\":\"https://www.youlai.cn/ask/856114.html\",\"displayUrl\":\"https://www.youlai.cn/ask/856114.html\",\"snippet\":\"西瓜的功效与作用有以下几点:第一,防治肾炎,因为西瓜中含有瓜氨酸和精氨酸,能够起到利尿的作用,还能达到消除肾炎的效果;第二,营养丰富,因为西瓜中含有丰富的营养物质,是除了脂肪和胆固醇外,几乎所有的人体...\",\"summary\":\"西瓜的功效与作用有以下几点:第一,防治肾炎,因为西瓜中含有瓜氨酸和精氨酸,能够起到利尿的作用,还能达到消除肾炎的效果;第二,营养丰富,因为西瓜中含有丰富的营养物质,是除了脂肪和胆固醇外,几乎所有的人体所需营养物质;第三,美容养颜,因为西瓜含有丰富的维生素C,能够减少皮肤的皱纹,还能够增加皮肤的光泽和弹性,从而达到美容养颜的功效｡ \",\"siteName\":\"有来医生\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://www.youlai.cn/ask/856114.html\",\"dateLastCrawled\":\"2023-03-05T09:28:00Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.7\",\"name\":\"西瓜的功效和作用\",\"url\":\"https://www.meilo.cn/317/626448.html\",\"displayUrl\":\"https://www.meilo.cn/317/626448.html\",\"snippet\":\"病情分析:西瓜一般可以清热解暑,另外西瓜还可以起到生津止渴的功效,同时西瓜也可以为机体提供膳食纤维,通常可以起到刺激肠道蠕动的作用,在预防便秘的方面可以起到非常好的作用｡西瓜本身水分含量比较丰富,适当...\",\"summary\":\"病情分析:西瓜一般可以清热解暑,另外西瓜还可以起到生津止渴的功效,同时西瓜也可以为机体提供膳食纤维,通常可以起到刺激肠道蠕动的作用,在预防便秘的方面可以起到非常好的作用｡西瓜本身水分含量比较丰富,适当的吃些西瓜对身体有一定的好处,但一定不能过量,否则会引起腹泻的症状｡\",\"siteName\":\"美咯\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://www.meilo.cn/317/626448.html\",\"dateLastCrawled\":\"2022-04-07T17:30:14Z\"},{\"id\":\"https://api.bochaai.com/v1/#WebPages.8\",\"name\":\"西瓜的作用与功效-有来医生\",\"url\":\"https://www.youlai.cn/ask/1305285.html\",\"displayUrl\":\"https://www.youlai.cn/ask/1305285.html\",\"snippet\":\"西瓜堪称“瓜中之王”,它的味道甘甜多汁,清爽解渴,是所有水果中果汁含量最丰富的｡但除此之外,它的营养成分没有明显的特色,和其他的水果基本上一致｡西瓜的果皮,果肉以及种子都可以食用和药用｡具有清咽,利喉...\",\"summary\":\"西瓜堪称“瓜中之王”,它的味道甘甜多汁,清爽解渴,是所有水果中果汁含量最丰富的｡但除此之外,它的营养成分没有明显的特色,和其他的水果基本上一致｡西瓜的果皮,果肉以及种子都可以食用和药用｡具有清咽,利喉,消炎作用的西瓜霜就是用西瓜皮加工而成的｡但是西瓜寒凉,脾胃虚寒､消化不良以及有胃肠疾患的病人不宜一次吃得太多｡ \",\"siteName\":\"有来医生\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://www.youlai.cn/ask/1305285.html\",\"dateLastCrawled\":\"2023-07-03T17:48:00Z\"}],\"someResultsRemoved\":true}"
        },
        {
            "role": "assistant",
            "type": "source",
            "content_type": "baike_pro", //模态卡 - 百科卡
            "content": "[{\"id\":null,\"name\":\"西瓜 - 搜狗百科\",\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C\",\"displayUrl\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=西瓜\",\"snippet\":null,\"summary\":null,\"siteName\":\"baike.sogou.com\",\"siteIcon\":\"https://th.bochaai.com/favicon?domain_url=https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C\",\"datePublished\":\"2025-01-03T00:00:00Z\",\"modelCard\":{\"module_list\":[{\"item_list\":[{\"data\":{\"baikeURL\":[\"https://baike.sogou.com/m/v181522625.htm\"],\"card\":{\"abstract_info\":\"西瓜（学名：Citrullus lanatus(Thunb.) Matsum. et Nakai），葫芦科西瓜属植物。西瓜是一年生蔓生藤本，茎、枝粗壮，卷须较粗壮，具短柔毛，叶柄粗，密被柔毛，叶片纸质，轮廓三角状卵形，带白绿色，果实大型，近于球形或椭圆形，肉质，多汁，果皮光滑。西瓜喜温暖、干燥的气候，不耐寒，其原种可能来自非洲，久已广泛栽培于世界热带到温带。中文学名：西瓜；拉丁学名：Citrullus lanatus(Thunb.) Matsum. et Nakai；别称：夏瓜，寒瓜，青门绿玉房；二名法：Citrullus lanatus；界：植物界；门：被子植物门；纲：双子叶植物纲又称木兰纲；亚纲：五桠果亚纲；目：葫芦目；科：葫芦科；属：西瓜属；种：西瓜；英文名：Watermelon；域：真核域；族：南瓜族；亚族：葫芦亚族；花果期：夏季；类型：一年生蔓生藤本；生长习性：喜温暖、干燥的气候、不耐寒；生长适温：24-30度；分布范围：温带、热带区域均有栽培；命名者及年代：Thunb，1916。栽培历史中国是世界上最大的西瓜产地，但关于西瓜的由来，说法不一。一种说法认为西瓜并非源于中国，而是产自于非洲，于西域传来，故名西瓜。另一种说法源于神农尝百草的传说，相传西瓜在神农尝百草时被发现，原名叫稀瓜，意思是水多肉稀的瓜，但后来传着传着就变成了西瓜。较为流行的观点认为，西瓜的原生地在非洲，它原是葫芦科的野生植物，后经人工培植成为食用西瓜。早在四千年前，埃及人就种植西瓜，后来逐渐北移，最初由地中海沿岸传至北欧，而后南下进入中东、印度等地，四五世纪时，由西域传入中国，所以称之为“西瓜”。据明代科学家徐光启《农政全书》记载：“西瓜，种出西域，故之名。”明李时珍在《本草纲目》中记载：“按胡峤于回纥得瓜种，名曰西瓜。则西瓜自五代时始入中国；今南北皆有。”这说明西瓜在中国的栽培已有悠久的历史。过去，有人引宋代欧阳修《新五代史·四夷附录》说：五代同州郃阳县令胡峤入契丹“始食西瓜”，“契丹破回纥得此种，以牛粪覆棚而种，大如中国冬瓜而味甘”，“周广顺三年（953）……峤归”。于是，西瓜从五代时由西域传入中国的说法，似乎成了定论。1981年湖南人民出版社出版的中学生课外读物《衣食住行史话》中就有“西瓜始于五代”一节。其实，这种说法并不确切。明代李时珍在《本草纲目》中指出：西瓜又名寒瓜。“陶弘景（南北朝时人）注瓜蒂言永嘉（晋怀帝年号）有寒瓜甚大，可藏至春音，即此也。盖五代之先瓜种已入浙东，但无西瓜之名，未遍中国尔。”《南史·滕昙恭传》说，昙恭“年五岁，母杨氏患热，思食寒瓜，土俗所不产。昙恭历访不能得，衔悲哀切。俄遇一桑门问其故，昙恭具以告。桑门曰：‘吾有两瓜，分一相遗。’还以与母，举室惊异，寻访桑门，莫知所在”。唐代段成式的《酉阳杂俎》卷十九记载隐侯（沈约）的《行园》诗云：“寒瓜方卧垅，秋蒲正满陂。紫茄纷烂熳，绿芋都参差。”从诗中谈到寒瓜卧垅的时节看，正跟西瓜相符。另外，旧北京曾称先上市的西瓜为“水瓜”，后上市的为“寒瓜”；今访老农，也说晚西瓜确有“寒瓜”一称。看来，上述文献资料可以和李时珍的说法相印证。然而，李时珍的说法几百年来似乎并未引起人们的注意。1976年，广西贵县西汉墓椁室淤泥中曾发现西瓜籽；1980年，江苏省扬州西郊邗江县汉墓随葬漆笥中出有西瓜籽，墓主卒于汉宣帝本始三年（前71年）。名称来源因9世纪自西域传入中国，故名西瓜。1、茎、枝粗壮，具明显的棱沟，被长而密的白色或淡黄褐色长柔毛。2、卷须较粗壮，具短柔毛，2歧，叶柄粗，长3-12厘米，粗0.2-0.4厘米，具不明显的沟纹，密被柔毛。3、叶片纸质，轮廓三角状卵形，带白绿色，长8-20厘米，宽5-15厘米，两面具短硬毛，脉上和背面较多，3深裂，中裂片较长，倒卵形、长圆状披针形或披针形，顶端急尖或渐尖，裂片又羽状或二重羽状浅裂或深裂，边缘波状或有疏齿，末次裂片通常有少数浅锯齿，先端钝圆，叶片基部心形，有时形成半圆形的弯缺，弯缺宽1-2厘米，深0.5-0.8厘米。4、雌雄同株。雌、雄花均单生于叶腋。（1）雄花：花梗长3-4厘米，密被黄褐色长柔毛；花萼筒宽钟形，密被长柔毛，花萼裂片狭披针形，与花萼筒近等长，长2-3毫米；花冠淡黄色，径2.5-3厘米，外面带绿色，被长柔毛，裂片卵状长圆形，长1-1.5厘米，宽0.5-0.8厘米，顶端钝或稍尖，脉黄褐色，被毛；雄蕊3，近离生，1枚1室，2枚2室，花丝短，药室折曲。（2）雌花：花萼和花冠与雄花同；子房卵形，长0.5-0.8厘米，宽0.4厘米，密被长柔毛，花柱长4-5毫米，柱头3，肾形。5、果实大型，近于球形或椭圆形，肉质，多汁，果皮光滑，色泽及纹饰各式。种子多数，卵形，黑色、红色，有时为白色、黄色、淡绿色或有斑纹，两面平滑，基部钝圆，通常边缘稍拱起，长1-1.5厘米，宽0.5-0.8厘米，厚1-2毫米，花果期夏季。西瓜喜温暖、干燥的气候、不耐寒，生长发育的最适温度24-30度，根系生长发育的最适温度30-32度，根毛发生的最低温度14度。西瓜在生长发育过程中需要较大的昼夜温差，较大的昼夜温差能培育高品质西瓜。西瓜耐旱、不耐湿，阴雨天多时，湿度过大，易感病，产量低，品质差。西瓜喜光照，在日照充足的条件下，产量高，品质好。西瓜生育期长，产量高，因此需要大量养分。每生产100公斤西瓜约需吸收氮0.19公斤、磷0.092公斤，钾0.136公斤，但不同生育期对养分的吸收量有明显的差异，在发芽期占0.01%，幼苗期占0.54%，抽蔓期占14.6%，结果期是西瓜吸收养分最旺盛的时期，占总养分量的84.8%，因此，西瓜随着植株的生长，需肥量逐渐增加，到果实旺盛生长时，达到最大值。西瓜适应性强，以土质疏松，土层深厚，排水良好的砂质土最佳。喜弱酸性，PH5-7。中国各地栽培，品种甚多，外果皮、果肉及种子形式多样，以新疆、甘肃兰州、山东德州、江苏溧阳等地最为有名。其原种可能来自非洲，久已广泛栽培于世界热带到温带，金、元时始传入中国。营养土配制：营养土配制方法较多，常用2/3草炭土加1/3未种过瓜的大田土拌匀过筛，或1/3腐熟农家肥加2/3大田土。每方土加2kg过磷酸钙，用800倍多菌灵液消毒，或用甲醛熏蒸。浸种催芽：可用55℃温水浸种消毒，不断搅拌至水温降至30℃左右。浸泡4小时后，清洗种子，然后用湿毛巾包紧置于30℃左右环境下催芽。播种：播种前一天应用800倍甲基托布津液浇透苗土，待种子芽长到0.5cm左右时，播种于育苗盘内，种子应平放，芽尖向上，上盖细营养土1.5cm厚，并用800倍甲基托布津液浇透育苗盘，温度保持在25～30℃，以保证出苗整齐。出苗后温度保持在18～28℃即可。苗床宁干勿湿。早春应防止冻害，保证充足光照。夏季应防幼苗高温徒长。\",\"ambiguation\":\"西瓜\",\"catalogList\":[{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_1\",\"value\":\"物种起源\"},{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_2\",\"value\":\"形态特征\"},{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_3\",\"value\":\"生长习性\"},{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_9\",\"value\":\"分布范围\"},{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_10\",\"value\":\"繁殖栽培\"},{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_14\",\"value\":\"种类介绍\"},{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_19\",\"value\":\"主要价值\"},{\"url\":\"https://baike.sogou.com/v181522625.htm?ch=frombaikevr&fromTitle=%E8%A5%BF%E7%93%9C#paragraph_25\",\"value\":\"植物文化\"}],\"dynAbstract\":\"西瓜（学名：Citrullus lanatus(Thunb.) Matsum. et Nakai），葫芦科西瓜属植物。西瓜是一年生蔓生藤本，茎、枝粗壮，卷须较粗壮，具短柔毛，叶柄粗，密被柔毛，叶片纸质，轮廓三角状卵形，带白绿色，果实大型，近于球形或椭圆形，肉质，多汁，果皮光滑。西瓜喜温暖、干燥的气候，不耐寒，其原种可能来自非洲，久已广泛栽培于世界热带到温带。\",\"lemmaStructTitle\":\"{\\\"aliasList\\\":[],\\\"ambiList\\\":[{\\\"lid\\\":181522625,\\\"ambi\\\":\\\"西瓜\\\",\\\"ambiTitle\\\":\\\"葫芦科西瓜属植物\\\"},{\\\"lid\\\":6589833,\\\"ambi\\\":\\\"西瓜\\\",\\\"ambiTitle\\\":\\\"王晓申、李欣蔓主演电影\\\"},{\\\"lid\\\":106820529,\\\"ambi\\\":\\\"西瓜\\\",\\\"ambiTitle\\\":\\\"2003年日剧\\\"},{\\\"lid\\\":174417913,\\\"ambi\\\":\\\"西瓜\\\",\\\"ambiTitle\\\":\\\"中药\\\"},{\\\"lid\\\":195385553,\\\"ambi\\\":\\\"西瓜\\\",\\\"ambiTitle\\\":\\\"动漫《Dr.STONE 石纪元》及其衍生作品中的角色\\\"}],\\\"ambiSize\\\":5,\\\"ambiguation\\\":\\\"西瓜\\\",\\\"ambiguationTitle\\\":\\\"葫芦科西瓜属植物\\\",\\\"lemmaId\\\":181522625,\\\"type\\\":1}\",\"oriPicList\":[\"http://pic.baike.soso.com/ugc/baikepic2/0/20231030183213-1120068479_jpg_1600_900_161584.jpg/0\"],\"subTitle\":\"葫芦科西瓜属植物\",\"title\":\"西瓜\"}}}]}]}}]"
        },
        {
            "role": "assistant",
            "type": "source",
            "content_type": "medical_common", //模态卡 - 医疗卡
            "content": "[{\"id\":null,\"name\":\"西瓜的功效与作用_三甲医生权威解读\",\"url\":null,\"displayUrl\":null,\"snippet\":null,\"summary\":null,\"siteName\":null,\"siteIcon\":null,\"datePublished\":\"2025-01-03T00:00:00Z\",\"modelCard\":{\"recommendVideos\":null,\"subitem\":[{\"content\":\"具体功效如下:1、解暑生津:西瓜清甜多汁、口感爽脆,可以生食也可以榨汁,是纯天然的饮品,富含多种营养素,对人体都是大有益处的,西瓜属于寒味,性寒味甘、生津消渴,适用于暑热烦躁、口舌长疮、消渴多饮、咽喉肿痛;2、防晒美白:西瓜的含水量很高,富含多种有益于健康和美容的化学成分,西瓜含有的氨基酸,包括腺嘌呤等重要的代谢成分、糖类、维生素、矿物质等营养物质,这些成分很容易被人体皮肤所吸收,对于面部皮肤滋润...\",\"department\":\"临床营养科\",\"doctorLevel\":\"主任医师\",\"doctorName\":\"马方\",\"hospital\":\"北京协和医院\",\"hospitalLv\":\"三级甲等\",\"title\":\"<em>西瓜的功效与作用</em>\",\"wapUrl4Resin\":\"https://m.youlai.cn/a/video/350041.html\"},{\"content\":\"西瓜是夏季最畅销的一种瓜类食品,老少都爱吃.在炎热的夏天,吃上一块冰镇的西瓜,那简直是一种享受.西瓜还可以给小朋友榨西瓜汁喝,西瓜能解暑降温,还能解渴.还有很多有利于人体所需要的营养,那么让我们来了解一下西瓜的功效与作用吧.西瓜的作用西瓜可清热解暑,除烦止渴:西瓜中含有大量的水分,在急性热病发烧、口渴汗多、烦躁时,吃上一块又甜又沙、水分十足的西瓜,症状会马上改善.西瓜所含的糖和盐能利尿并消除肾脏炎症,蛋白酶能把不溶性蛋白质转化为可溶的蛋白质,增加肾炎病人的营养.西瓜含有能使血压降低的物质,能起到降血压的作用.吃西瓜后尿量会明显增加,这可以减少胆色素的含量,并可使大便通畅,对治疗黄疸有一定作用新鲜的西瓜汁和鲜嫩的瓜皮增加皮肤弹性,减少皱纹,增添光泽.西瓜的功效西瓜可以补充体内水分的损失,可以补充体力、功能,还含有丰富的维生素、矿物质,还有利尿消肿的功能,所以体内有水分存积的患这可以多吃.西瓜的功效与作用主要是根据它的成分来的,首先,它含有大量水分,可以补充我们体内的损失,另外,它含有充足的糖分,可以补充体力,供能,而且它含有丰富的维生素、矿物质,对我们人体都是比较有益的营养素.而且西瓜还有利尿消肿的作用,所以夏季吃西瓜是非常有好处的.而对于这个体内容易有水份存积的患者,也是可以多吃一些西瓜的.\",\"department\":\"营养科\",\"doctorLevel\":\"主任医师\",\"doctorName\":\"王兴国\",\"hospital\":\"大连市中心医院\",\"hospitalLv\":\"三级甲等\",\"title\":\"<em>西瓜的功效与作用</em>\",\"wapUrl4Resin\":\"https://m.bohe.cn/article/mingyi/73244.html\"}]}}]"
        }
    ]
}
```

## 流式响应返回(stream_response_content)

当使用流式响应时，会实时增量返回消息内容。即大语言模型一生成返回消息就会将消息返回给客户端。

- `event` : String 当前流式返回的数据包事件，不同 event 下，数据包会返回不同字段。
  - message：返回的消息内容, ``json data:{"event":"message","message":{"role":"assistant","type":"follow_up","content":"你觉得《三国演义》对中国历史和文化的影响有哪些？","content_type":"text"},"is_finish":true,"index":3,"conversation_id":"123","seq_id": 0}``
  - done：正常结束标志, ``json data:{"event":"done"}``
  - error：错误结束标志   ``json data:{"event":"error", "error_information":{"code": 具体错误码,"msg": 具体错误信息}}``
- `message` : Object 增量返回的消息内容。 详情请参考返回参数内容中 Message 消息结构和模态卡字段说明
  - `role`: String 发送这条消息的实体。取值： user：代表该条消息内容是用户发送的。 assistant：代表该条消息内容是 博查 发送的
  - `type`: String 当 role=assistant 时，用于标识消息类型，取值： (source:  参考源，此时content_type会有webpage、video、image三种，分别代表网页、视频和图片。如果没有搜索结果，则不返回source; answer：最终返回给用户的消息内容; follow_up：推荐问题。)
  - `content`: String 消息内容。 当type=answer时，content_type=text。消息内容是 Markdown 格式. 如果content_type != text，返回的是json encode后的文本
  - `content_type`: String 消息内容的类型。

    - text: 文本类型, type=source（来自网页搜索到的参考源）：

      - webpage：网页Object，每个Message返回一条
      - image:  图片Object，每个Message返回一条
      - video：视频Object，每个Message返回一条
    - type=source（来自多模态卡片搜索到的参考源）： 

      - douyin：抖音短视频Object，每个Message返回一条
      - weather_china：国内天气，示例搜索词：“北京天气”、“杭州天气”
      - weather_international：国际天气，示例搜索词：“巴黎天气”
      - baike_pro: 百科专业版，示例搜索词：“西瓜的功效与作用”
      - medical_common：医疗普通版，示例搜索词：“站着和坐着哪个对腰椎伤害大”
      - medical_pro：医疗专业版，示例搜索词：“站着和坐着哪个对腰椎伤害大”
      - calendar：万年历，示例搜索词：万年历
      - train_line：火车线路、车票信息，示例搜索词：“长春到白城火车时刻表”
      - train_station_common：火车站点信息、列车时刻表，示例搜索词："K84次列车途经站点"
      - train_station_pro：火车站点信息、列车时刻表专业版，示例搜索词："G2556高铁时刻表停靠站"
      - star_chinese_zodiac_animal：中国属相、生肖运势，示例搜索词："属虎男最佳婚配属相"、 "属马人性格好吗"
      - star_chinese_zodiac：中国属相年份，示例搜索词："2024年是什么年"、 "94年属什么的"
      - star_western_zodiac_sign：星座，示例搜索词：“水瓶座、射手座性格”
      - star_western_zodiac：星座日期，示例搜索词: “12月是什么星座”、 “8月份星座”
      - gold_price：贵金属价格，示例搜索词：“今日金价”、 “现在黄金多少钱一克”
      - gold_price_trend：贵金属价格趋势，示例搜索词：“黄金今日价格”
      - gold_price_futures_trend：贵金属期货价格趋势，示例搜索词：“黄金期货实时行情”
      - exchangerate：汇率，示例搜索词：“美元对人民币汇率”、 “一美元等于多少人民币”
      - oil_price：油价，示例搜索词：“今日油价”、“北京今日油价92汽油”
      - phone：手机参数、参数对比，示例搜索词：“华为pura70和mate60哪个好”
      - stock：股票，示例搜索词：“东方财富股票”
      - car_common：汽车信息，示例搜索词：“长安汽车”
      - car_pro：汽车信息专业版，示例搜索词：“宝马x3”
- `is_finish` : Boolean 当前 message 是否结束。 false：未结束; true：结束。注意当该值为 true 时仅表示一条完整的消息已经发送完成，不代表整个模型返回结束。
- `index` : Interger 同一个 index 的增量返回属于同一条消息。
- `conversation_id` : String 会话 ID。
- `seq_id`: Integer 全部流式返回内容中，当前event的序号。从0开始。
- `code` : Integer 状态码。 0 代表调用成功。 stream模式下，只有出错时的 error_information 里面才会出现 code
- `msg` : String 状态信息。 stream模式下，只有出错时的 error_information 里面才会出现 msg

e.g. MessageObject

```json
// webpage object，注意：stream 中是在 content 中以 json_encode 后的字符串格式返回的
{
    "id": "https://api.bing.microsoft.com/api/v7/#WebPages.0", 
    "name": "每日科普|为啥天空是蓝色的？_人民号", 
    "url": "https://mp.pdnews.cn/Pc/ArtInfoApi/article?id=37552812", 
    "displayUrl": "https://mp.pdnews.cn/Pc/ArtInfoApi/article?id=37552812", 
    "snippet": "太阳光接近水平射入大气层，阳光中的偏蓝光都因为瑞利散射而被散射到了我们看不到的角度，因此，天空就被印成了美丽的橙红色。 因为太阳位置和我们观测时所处位置的变化，天空也会呈现为十分美丽的渐变色。 朝阳升起时，随着太阳的角度越来越高，蓝光开始占领天空，于是天空由橙红转向蓝色。 夕阳落下时，随着太阳的角度越来越低，红橙光洒满天际，于是天空便映衬着十分美丽的晚霞，太阳本身也会在此时显得格外红。 说到这里，你大概会想问既然较短波长的光被散射得比较厉害，那么比蓝光波长更短的紫光呢？ 比它波长稍长一些的绿光呢？ 其实，这就与人类的眼睛以及大脑构造有关了。 事实上，天空中散射的紫光当然比蓝光多得多，但是很可惜，人眼并不能识别出它们。 人类是三色视觉，拥有三种识别颜色的视锥以及单色视杆。", 
    "dateLastCrawled": "2024-06-30T11:11:00Z", 
    "cachedPageUrl": "http://cncc.bingj.com/cache.aspx?q=%E5%A4%A9%E7%A9%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E8%93%9D%E8%89%B2%E7%9A%84&d=5001627273276920&mkt=zh-CN&setlang=en-US&w=wsl35u7nrlziehuVZIhDtTBgTXH9L4rm", 
    "language": "zh_chs", 
    "isFamilyFriendly": true, 
    "isNavigational": false
}

// webpage object 时的 json
{
    "event": "message",
    "message": {
        "role": "assistant",
        "type": "source",
        "content_type": "webpage",
        "content": "{\"id\":\"https://api.bing.microsoft.com/api/v7/#WebPages.0\",\"name\":\"每日科普|为啥天空是蓝色的？_人民号\",\"url\":\"https://mp.pdnews.cn/Pc/ArtInfoApi/article?id=37552812\",\"displayUrl\":\"https://mp.pdnews.cn/Pc/ArtInfoApi/article?id=37552812\",\"snippet\":\"太阳光接近水平射入大气层，阳光中的偏蓝光都因为瑞利散射而被散射到了我们看不到的角度，因此，天空就被印成了美丽的橙红色。 因为太阳位置和我们观测时所处位置的变化，天空也会呈现为十分美丽的渐变色。 朝阳升起时，随着太阳的角度越来越高，蓝光开始占领天空，于是天空由橙红转向蓝色。 夕阳落下时，随着太阳的角度越来越低，红橙光洒满天际，于是天空便映衬着十分美丽的晚霞，太阳本身也会在此时显得格外红。 说到这里，你大概会想问既然较短波长的光被散射得比较厉害，那么比蓝光波长更短的紫光呢？ 比它波长稍长一些的绿光呢？ 其实，这就与人类的眼睛以及大脑构造有关了。 事实上，天空中散射的紫光当然比蓝光多得多，但是很可惜，人眼并不能识别出它们。 人类是三色视觉，拥有三种识别颜色的视锥以及单色视杆。\",\"dateLastCrawled\":\"2024-06-30T11:11:00Z\",\"cachedPageUrl\":\"http://cncc.bingj.com/cache.aspx?q=%E5%A4%A9%E7%A9%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E8%93%9D%E8%89%B2%E7%9A%84&d=5001627273276920&mkt=zh-CN&setlang=en-US&w=wsl35u7nrlziehuVZIhDtTBgTXH9L4rm\",\"language\":\"zh_chs\",\"isFamilyFriendly\":true,\"isNavigational\":false}"
    },
    "index": 0,
    "conversation_id": "3884a14cd62d4c228194eefbad885e02",
    "seq_id": 0,
    "is_finish": false
}

// image object，注意：stream 中是在 content 中以 json_encode 后的字符串格式返回的
{
    "webSearchUrl": "https://www.bing.com/images/search?q=%E5%A4%A9%E7%A9%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E8%93%9D%E8%89%B2%E7%9A%84&id=678CDEA1B1B8BB1EB57466421C23E9AE8EE70039&FORM=IQFRBA",
    "name": "为什么天空是蓝色的原理（地球大气层为什么是蓝色，蓝天是如何形成的？） | 说明书网",
    "thumbnailUrl": "https://tse1-mm.cn.bing.net/th?id=OIP-C.9f9RwmII52Po_WqIC6lZegHaEo&pid=Api",
    "datePublished": "2022-10-27T06:52:00Z",
    "contentUrl": "https://www.shuomingshu.cn/wp-content/uploads/images/2022/10/27/d1525a40f3714fa19b860b65b807d0ff_2ioofc53dak.jpg",
    "hostPageUrl": "https://www.shuomingshu.cn/changshi/159108.html",
    "contentSize": "316482 B",
    "encodingFormat": "jpeg",
    "hostPageDisplayUrl": "https://www.shuomingshu.cn/changshi/159108.html",
    "width": 1920,
    "height": 1200,
    "thumbnail": {
        "height": 296,
        "width": 474
    }
}

// image object 时的 stream json
{
    "event": "message",
    "message": {
        "role": "assistant",
        "type": "source",
        "content_type": "image",
        "content": "{\"webSearchUrl\":\"https://www.bing.com/images/search?q=%E5%A4%A9%E7%A9%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E8%93%9D%E8%89%B2%E7%9A%84&id=678CDEA1B1B8BB1EB57466421C23E9AE8EE70039&FORM=IQFRBA\",\"name\":\"为什么天空是蓝色的原理（地球大气层为什么是蓝色，蓝天是如何形成的？） | 说明书网\",\"thumbnailUrl\":\"https://tse1-mm.cn.bing.net/th?id=OIP-C.9f9RwmII52Po_WqIC6lZegHaEo&pid=Api\",\"datePublished\":\"2022-10-27T06:52:00Z\",\"contentUrl\":\"https://www.shuomingshu.cn/wp-content/uploads/images/2022/10/27/d1525a40f3714fa19b860b65b807d0ff_2ioofc53dak.jpg\",\"hostPageUrl\":\"https://www.shuomingshu.cn/changshi/159108.html\",\"contentSize\":\"316482 B\",\"encodingFormat\":\"jpeg\",\"hostPageDisplayUrl\":\"https://www.shuomingshu.cn/changshi/159108.html\",\"width\":1920,\"height\":1200,\"thumbnail\":{\"height\":296,\"width\":474}}"
    },
    "index": 0,
    "conversation_id": "3884a14cd62d4c228194eefbad885e02",
    "seq_id": 0,
    "is_finish": false
}

// video object，注意：stream 中是在 content 中以 json_encode 后的字符串格式返回的


// douyin object，注意：stream 中是在 content 中以 json_encode 后的字符串格式返回的
{
  "type": "short_video",
  "description": "为什么会有金灿灿的天空呢？ #原创动画 #轻漫计划#天空为什么是蓝色 #科普 #天空 @抖音青少年动画 @抖音动漫 @抖音知识 @抖音科普 @抖音青少年 #轻漫计划",
  "width": 540,
  "height": 960,
  "definition": "540p",
  "duration": 95,
  "size": 4412697,
  "creator": {
    "name": "珍妮马斯JellieMons",
    "avatar_url": "https://p3-open-sign.onewsimg.com/aweme-avatar/tos-cn-i-0813_oAGgICDnAbbAOBCAylseALSQAAeWU9A33ACLYg~tplv-tt-cs0:300:300.jpeg?lk3s=7b4e885f&scene=core&x-expires=1782909478&x-signature=J9ufTuon3KXaFoeoyuQ77wQ3GS4%3D",
    "followers_count": 52760
  },
  "interactions": {
    "read_count": 3363,
    "digg_count": 79,
    "share_count": 1,
    "comment_count": 0
  },
  "publish_time": 1708510845,
  "article_url": "https://feedcoop.douyin.com/d7337999632162816562/?biz_log=B6fXnNwwCKhTbtuG2PEqiKQdeLSmqZuZ5b1RLPHGs84ZKF3zxWAZfzFDqGcfNnVQPGkWaUa5Yp7FzZMPjzvxbEusgENh17pJQZQNwx3jMW7naT5ZfKbo345VGJkYqmStnhfFL2Vvcx5YTYbW1TUyrm8&group_id=7337999632162816562&label=torchlight&platform_source=1&utm_source=bochaaisearch_default_content",
  "content_url": "https://open.toutiao.com/video/url/?param=E3CDqwMWmNTSqVQDQRkJjCLnLjn9W3Cxk4rfrrWB3s2EtxDAVuspu8DL4S2ywGzyU3Q65e8VUERHPhq5fFU2AWELJNAdWW2NsstavEeq2oRK6haMooiTdcYf61qhJKDqg6dHuNzGFsu9ELGCAzG8NS6YttyVxyVCaNqyrsWc4K68iGTvGo47tVWoLKvS7FYVg9Mi4kEK2YARTjNM8Ey9gV623ZkBBdHd6dzGg&partner=bochaaisearch_default_content&version=3",
  "cover_images": [
    {
      "height": 1920,
      "width": 1080,
      "url": "https://p9-open-sign.onewsimg.com/tos-cn-p-0015/oEz1nbRFADsDQPnzdBlgeBtrQR9bAPFw2AflSz~tplv-obj.jpeg?lk3s=2c3e0c70&scene=torchlight&x-expires=1782909478&x-signature=DnylPFZ0Kh0YMMFaqgvapj8uJ2U%3D"
    }
  ]
}

// douyin object 时的 stream json
{
    "event": "message",
    "message": {
        "role": "assistant",
        "type": "source",
        "content_type": "douyin",
        "content": "{\"type\":\"short_video\",\"description\":\"为什么会有金灿灿的天空呢？ #原创动画 #轻漫计划#天空为什么是蓝色 #科普 #天空 @抖音青少年动画 @抖音动漫 @抖音知识 @抖音科普 @抖音青少年 #轻漫计划\",\"width\":540,\"height\":960,\"definition\":\"540p\",\"duration\":95,\"size\":4412697,\"creator\":{\"name\":\"珍妮马斯JellieMons\",\"avatar_url\":\"https://p3-open-sign.onewsimg.com/aweme-avatar/tos-cn-i-0813_oAGgICDnAbbAOBCAylseALSQAAeWU9A33ACLYg~tplv-tt-cs0:300:300.jpeg?lk3s=7b4e885f&scene=core&x-expires=1782909478&x-signature=J9ufTuon3KXaFoeoyuQ77wQ3GS4%3D\",\"followers_count\":52760},\"interactions\":{\"read_count\":3363,\"digg_count\":79,\"share_count\":1,\"comment_count\":0},\"publish_time\":1708510845,\"article_url\":\"https://feedcoop.douyin.com/d7337999632162816562/?biz_log=B6fXnNwwCKhTbtuG2PEqiKQdeLSmqZuZ5b1RLPHGs84ZKF3zxWAZfzFDqGcfNnVQPGkWaUa5Yp7FzZMPjzvxbEusgENh17pJQZQNwx3jMW7naT5ZfKbo345VGJkYqmStnhfFL2Vvcx5YTYbW1TUyrm8&group_id=7337999632162816562&label=torchlight&platform_source=1&utm_source=bochaaisearch_default_content\",\"content_url\":\"https://open.toutiao.com/video/url/?param=E3CDqwMWmNTSqVQDQRkJjCLnLjn9W3Cxk4rfrrWB3s2EtxDAVuspu8DL4S2ywGzyU3Q65e8VUERHPhq5fFU2AWELJNAdWW2NsstavEeq2oRK6haMooiTdcYf61qhJKDqg6dHuNzGFsu9ELGCAzG8NS6YttyVxyVCaNqyrsWc4K68iGTvGo47tVWoLKvS7FYVg9Mi4kEK2YARTjNM8Ey9gV623ZkBBdHd6dzGg&partner=bochaaisearch_default_content&version=3\",\"cover_images\":[{\"height\":1920,\"width\":1080,\"url\":\"https://p9-open-sign.onewsimg.com/tos-cn-p-0015/oEz1nbRFADsDQPnzdBlgeBtrQR9bAPFw2AflSz~tplv-obj.jpeg?lk3s=2c3e0c70&scene=torchlight&x-expires=1782909478&x-signature=DnylPFZ0Kh0YMMFaqgvapj8uJ2U%3D\"}]}"
    },
    "index": 3,
    "conversation_id": "56ec3222e5c04094a6f47271387a1407",
    "seq_id": 0,
    "is_finish": false
}
```

e.g. stream_response_content

```json
data:{"event": "message", "message": {"role": "assistant", "type": "source", "content_type": "webpage", "content": "{\"id\":\"https://api.bing.microsoft.com/api/v7/#WebPages.0\",\"name\":\"\u6bcf\u65e5\u79d1\u666e|\u4e3a\u5565\u5929\u7a7a\u662f\u84dd\u8272\u7684\uff1f_\u4eba\u6c11\u53f7\",\"url\":\"https://mp.pdnews.cn/Pc/ArtInfoApi/article?id=37552812\",\"displayUrl\":\"https://mp.pdnews.cn/Pc/ArtInfoApi/article?id=37552812\",\"snippet\":\"\u989c\u8272\u7684\u89c6\u9525\u4ee5\u53ca\u5355\u8272\u89c6\u6746\u3002\",\"dateLastCrawled\":\"2024-06-30T11:11:00Z\",\"cachedPageUrl\":\"http://cncc.bingj.com/cache.aspx?q=%E5%A4%A9%E7%A9%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E8%93%9D%E8%89%B2%E7%9A%84&d=5001627273276920&mkt=zh-CN&setlang=en-US&w=wsl35u7nrlziehuVZIhDtTBgTXH9L4rm\",\"language\":\"zh_chs\",\"isFamilyFriendly\":true,\"isNavigational\":false}"}, "index": 0, "conversation_id": "4cc9e91fded948328e82739390db9c36", "seq_id": 0, "is_finish": false}
data:{"event": "message", "message": {"role": "assistant", "type": "source", "content_type": "webpage", "content": "{\"id\":\"https://api.bing.microsoft.com/api/v7/#WebPages.1\",\"name\":\"\u5929\u7a7a\u4e3a\u4ec0\u4e48\u662f\u84dd\u8272\u7684\uff1f\u770b\u4f3c\u5f88\u7b80\u5355\u7684\u95ee\u9898\uff0c\u4f46\u5230\u5e95\u4e3a\u4ec0\u4e48 ...\",\"url\":\"https://www.163.com/dy/article/IS74BSFT0511A3AG.html\",\"displayUrl\":\"https://www.163.com/dy/article/IS74BSFT0511A3AG.html\",\"snippet\":\"u7684\u3002\",\"dateLastCrawled\":\"2024-06-30T14:08:00Z\",\"cachedPageUrl\":\"http://cncc.bingj.com/cache.aspx?q=%E5%A4%A9%E7%A9%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E8%93%9D%E8%89%B2%E7%9A%84&d=4890619555020860&mkt=zh-CN&setlang=en-US&w=zCJY62V1lPuv_wQTdXL1AMw2YJH0dgrj\",\"language\":\"zh_chs\",\"isFamilyFriendly\":true,\"isNavigational\":false}"}, "index": 1, "conversation_id": "4cc9e91fded948328e82739390db9c36", "seq_id": 0, "is_finish": false}
data:{"event": "message", "message": {"role": "assistant", "type": "source", "content_type": "webpage", "content": "{\"id\":\"https://api.bing.microsoft.com/api/v7/#WebPages.2\",\"name\":\"\u5929\u7a7a\u4e3a\u4ec0\u4e48\u6709\u4e0d\u540c\u7684\u989c\u8272 - \u4e2d\u56fd\u6c14\u8c61\u5c40\u653f\u5e9c\u95e8\u6237\u7f51\u7ad9\",\"url\":\"https://www.cma.gov.cn/kppd/kppdqxwq/kppdjckp/202111/t20211103_4162011.html\",\"displayUrl\":\"https://www.cma.gov.cn/kppd/kppdqxwq/kppdjckp/202111/t...\",\"snippet\":\"\u3002\",\"dateLastCrawled\":\"2024-06-29T17:31:00Z\",\"cachedPageUrl\":\"http://cncc.bingj.com/cache.aspx?q=%E5%A4%A9%E7%A9%BA%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E8%93%9D%E8%89%B2%E7%9A%84&d=4888815674019519&mkt=zh-CN&setlang=en-US&w=F2epRHJOO1SvLVAQA8Ew3iKNY3NWDDL9\",\"language\":\"zh_chs\",\"isFamilyFriendly\":true,\"isNavigational\":false}"}, "index": 2, "conversation_id": "4cc9e91fded948328e82739390db9c36", "seq_id": 0, "is_finish": false}
···
data:{"event": "message", "message": {"role": "assistant", "type": "answer", "content_type": "text", "content": "\u4e4b\u6240\u4ee5\u5448\u73b0\u84dd\u8272"}, "index": 1, "conversation_id": "4cc9e91fded948328e82739390db9c36", "seq_id": 0, "is_finish": false}
data:{"event": "message", "message": {"role": "assistant", "type": "answer", "content_type": "text", "content": "\uff0c\u662f\u7531\u4e8e\u592a\u9633\u5149"}, "index": 2, "conversation_id": "4cc9e91fded948328e82739390db9c36", "seq_id": 0, "is_finish": false}
data:{"event": "message", "message": {"role": "assistant", "type": "answer", "content_type": "text", "content": "\u5728\u8fdb\u5165\u5927\u6c14\u5c42"}, "index": 3, "conversation_id": "4cc9e91fded948328e82739390db9c36", "seq_id": 0, "is_finish": false}
···
data:{"event": "done"}
```

## 模态卡片字段说明

modelCard里直接包含了回答用户问题最有用的内容, 支持从天气查询、医疗、贵金属价格查询等等专业信息的查询.

| 名称          | 类型            | 中文名           | 说明                                   |
| ------------- | --------------- | ---------------- | -------------------------------------- |
| id            | string          |                  |                                        |
| name          | string          | 网页标题         |                                        |
| url           | string          | 网页Url          |                                        |
| displayUrl    | string          | 网页显示Url      |                                        |
| snippet       | string          | 文本摘要         |                                        |
| summary       | string          | 总结摘要         |                                        |
| siteName      | string          | 网站名称         |                                        |
| sitelcon      | string          | 网站图标         |                                        |
| datePublished | string          | 网页发布日期 陈  |                                        |
| modelCard     | Object 或 Array | 模态卡结构化信息 | 根据模态卡类型不同，是 Object 或 Array |


modelCard 内容

**weather_china：** 国内天气，示例搜索词：北京天气、杭州天气

- day: List `<Object>`
- hour: List `<Object>`
- url: String

```
"modelCard": {
	"day": [], // 天级天气
	"hour": [], //小时级天气
	"url": "" // string 天气跳转页

}
```



**weather_international：** 国际天气，示例搜索词：巴黎天气

```json
"modelCard": {
	"key", "", //string 国家_城市
	"subDisplay", {
		"day": "" // string 天级天气
	}
}
```


**baike_pro:** 百科专业版，示例搜索词：西瓜的功效与作用

- module_list : []
  - item_list: []
  - data: object
    - baikeURL: String
    - card: Object

      - lemmaStruct: String 词条的多义项信息
      - title: String 结果标题
      - subTitle: String 词条副标题
      - dynAbstract: String 搜索结束展示的短暂词条解释
      - abstract_info: String 完整词条摘要
      - ambiguation: String 结果标题
      - oriPrice: String 结果配图
      - catalogoList: String 百科词条的一级目录



**medical_common：** 医疗普通版，示例搜索词：站着和坐着哪个对腰椎伤害大

- subitem : Object
  - title: String 子结果标题
  - content: String 子结果摘要
  - wapUrl4Resin : String 子结果 URL
  - doctorName: String 提供内容的医生姓名
  - doctorLevel: String 提供内容的医生等级
  - hospital: String 提供内容的医生所在的医院
  - hospitalLv: String 提供内容的医生所在的医院等级
  - department: String 提供内容的医生所在科室


**medical_pro：** 医疗专业版，示例搜索词：站着和坐着哪个对腰椎伤害大

- title : String 子结果标题
- content: Object
  - detail : Object
    - content_detail : String 子结果摘要
  - doctor : String 提供内容的医生姓名
  - doctor_title: String 提供内容的医生等级
  - hospital : String  提供内容的医生所在的医院
  - hospital_level: String 提供内容的医生所在的医院等级
  - department: String 提供内容的医生所在科室


**calendar：** 万年历，示例搜索词：万年历



**train_line：** 笼统的铁道信息， 火车线路、车票信息，示例搜索词：长春到白城火车时刻表

- [] : array 整体是个车次数组
- subDisplay : Object 
  - H5url : String 时刻表H5页面
  - num : String 车次
  - type : String 火车类型
  - alltime: String 全程时间
  - date : String 日期
  - start_city : String 出发地
  - start_station : String 出发站
  - end_city : String 到达地
  - end_station : String 到达站
  - end_time : 到达时间
  - ticket : Object 票务信息


**train_station_common**：具体车次的信息比如火车站点信息、列车时刻表，示例搜索词：K84次列车途经站点

- key : string 车次
- subDisplay : Object 
  - H5url : String 时刻表H5页面
  - url : String 时刻表页面
  - checi_num : String 车次
  - type : String 火车类型
  - alltime: String 全程时间
  - date : String 日期
  - start_city : String 出发地
  - start_station : String 出发站
  - end_city : String 到达地
  - end_station : String 到达站
  - end_time : 到达时间


**train_station_pro**：火车站点信息、列车时刻表专业版，示例搜索词：G2556高铁时刻表停靠站

- key : string 车次
- subDisplay : Object 
  - H5url : String 时刻表H5页面
  - url : String 时刻表页面
  - type : String 火车类型
  - checi_num : String 车次
  - type : String 车次
  - alltime: String 全程时间
  - date : String 日期
  - start_city : String 出发地
  - start_station : String 出发站
  - end_city : String 到达地
  - end_station : String 到达站
  - end_time : 到达时间



**star_chinese_zodiac_animal**：中国属相、生肖运势，示例搜索词："属虎男最佳婚配属相“ ”属马人性格好吗”

 - key： string		
 - subdisplay : object		
   - name: string	属相名称	
   - othername: string	属相名称（别名）	
   - pic: string	属相的卡通图片	
   - year1: string	属相的对应年份	
   - character: string	性格	
   - yearfortune: string	属相运势介绍文案	、
   - good: string	宜配属相	
   - bad: string	忌配属相	
   - match : object	宜配属相信息	
   - matchtab : string	配对的tab标签	
   - fortune : string	综合运势星数	满星5星
   - fortunetab :	string	运势的的tab标签	
   - caiyun	: string	财运运势星数	满星5星
   - hunyin :	string	婚姻运势星数	满星5星
   - jiankang :	string	健康	满星5星
   - shiye :	string	事业	满星5星


**star_chinese_zodiac**：中国属相年份，示例搜索词："2024年是什么年" "94年属什么的" 

- key: string		
  - subdisplay: object		
    - nianfen: string	年份的名称	例：辰龙
    - nongli: string	农历年份名称	例：农历 甲辰年
    - date1: string	当年第1个属相的时间范围	2024.1.1-2024.2.9
    - date2: string	当年第2个属相的时间范围	2024.2.10-2024.12.31
    - img1: string	第1个属相的图片	
    - img2: string	第2个属相的时间	
    - name1: string	第1个属相的名称	属兔
    - name1link: string	第1个属相的星座屋链接	
    - name2: string	第2个属相的名称	属龙
    - name2url: string	第2个属相的星座屋链接	


**star_western_zodiac_sign**：星座，示例搜索词："水瓶座" "射手座性格" 

- info_subdisplay: 	array		
  - name: string		
  - name_english: string		
  - date: string	星座日期范围	例：3.21~4.19
  - attribute: string	星座属相	例：火象星座
  - color: string	幸运颜色	例：红色
  - diamond: string	幸运宝石	
  - summary: string	星座性格	
  - female: string	女生性格	
  - male: string	男生性格 	
  - number_info: string	幸运数字	
  - tag_star: string	守护星	
  - url_female: string	女生信息页	
  - url_male: string	男生信息页	


**star_western_zodiac**：星座日期，示例搜索词："12月是什么星座" "8月份星座"

- accurContent: string	当月包含的星座	日期&星座名称&星座logo图片&星座屋的链接&星座简介
- voiceinfo: string	当月包含的星座	


**gold_price**：贵金属价格，示例搜索词："今日金价" "现在黄金多少钱一克"

 - key : string		
 - subdisplay			
   - date:	string	日期	
   - tab:	array		
     - morelink:	string	黄金行情页面	
     - morelink2:	string	黄金行情页面	
     - type:	string	类型	例：金店、银行
     - symbol:	array	不同商家列表	
       - mpcurl:	string	wap页面地址	
       - pcurl:	string	pc页面地址	
       - name:	string	商品名称
       - price:	string	价格	例：748元/克
       - shopname:	string	品牌名称	
       - updown:	string	涨跌	


**gold_price_trend**：贵金属价格趋势，示例搜索词：黄金今日价格

 - source: string	信息来源	
 - tab_location: array		
   - current: array	最新信息	
     - key_status:	string	涨跌状态	up/down/draw
     - number_info:	string	价格	
     - number_per:	string	涨跌幅度	
     - range:	string	涨跌金额	
     - unit:	string	单位	 
   - list:	array	统计信息卡	
     - key_status:	string	涨跌状态	
     - name:	string	属性名	
     - value:	string	属性值	


**gold_price_futures_trend**：贵金属期货价格趋势，示例搜索词："黄金期货实时行情"

 - source:	string	信息来源	
 - tab_location:	array		
   - current: array	最新信息	
     - key_status:	string	涨跌状态	up/down/draw
     - number_info:	string	价格	
     - number_per:	string	涨跌幅度	
     - range: string	涨跌金额	
     - unit: string	单位	
   - list: array	统计信息卡	
     - key_status:	string	涨跌状态	
     - name: string	属性名	
     - value: string	属性值	


**exchangerate**：汇率，示例搜索词："美元对人民币汇率" "一美元等于多少人民币"

- source:	string	信息来源	
- tab_location:	array		
  - current:	array	最新信息	
    - key_status:	string	涨跌状态	up/down/draw
    - number_info:	string	价格	
    - number_per:	string	涨跌幅度	
    - range:	string	涨跌金额	
    - unit:	string	单位	 
  - list:	array	统计信息卡	
    - key_status:	string	涨跌状态	
    - name:	string	属性名	
    - value:	string	属性值	


**oil_price**：油价，示例搜索词："今日油价" "北京今日油价92汽油"

- key: string		
- subdisplay			
  - city: string		
  - date:	string	日期	
  - guonei:	array		
  - alias$:	string	油的别名1	$为数组下标
  - increase$:	string	涨价	
  - name1:	string	油名称	
  - price1:	string	今日油价（元/升）	
  - price2:	string	历史油价（元/升）	
  - type$:	string	类型	



**phone**：手机参数、参数对比，示例搜索词："华为pura70和mate60哪个好"

 - key: string	
 - subdisplay: object	
   - date: string	日期
   - modelbrand1: string	机型A品牌
   - modelbrand2: string	机型B品牌
   - modelimg1: string	机型A产品图
   - modelimg2: string	机型B产品图
   - modelname1: string	机型A名称
   - modelname2: string	机型B名称
   - modelprice1: string	机型A的参考价格
   - modelprice2: string	机型B的参考价格
   - modelpcurl1: string	机型A的参数详情web页
   - modelpcurl2: string	机型B的参数详情web页
   - modelwapurl1: string	机型A的参数详情wap页
   - modelwapurl2: string	机型B的参数详情wap页
   - model1_parameter:	object	机型A参数详细数据
     - show_parameter1:	array	
       - par_name1:	string	属性名
       - val1: string	属性值 
   - model1_parameter:	object	机型B参数详细数据
     - show_parameter2:	array	
       - par_name1:	string	属性名
       - val1:	string	属性值


**stock**：股票，示例搜索词："东方财富股票"

- group: array	命中的股票列表	
  - name: string	股票名称	
  - alias: string	涨跌状态	
  - name_exchange:	string	交易所	
  - code_stock: string	股票代码	
  - type: string	股票类型	
  - key_status: string	交易状态	
  - price: string	最新价格	可能存在误差
  - number_closed: string	昨日收盘价	
  - number_open: string	今日开盘价	
  - number_high: string	最高	
  - number_low: string	最低	
  - time: string	价格更新时间	可能存在误差


**car_common**：汽车信息，示例搜索词："长安汽车"


- []: array		整体是个汽车数组
  - subitem: array		
    - key: string		
    - subdisplay: object		
      - brand: string	品牌名称	
      - carLevel: string	车型类型	
      - carSeries: string	车型所属系列	
      - guidedPrice: string	指导价	
      - nation: string	生产国家
      - wx_logo: string	车型品牌logo图片	
      - wx_carurl: string	车型详情页-wap	


**car_pro**：汽车信息专业版，示例搜索词：宝马x3

 - info_sub: object	
   - name_car: string	车型名称
   - price_manual_guide: string	指导价
   - type_year: string	车型年份
   - url_car: string	车型页面url
   - url_min_price: string	咨询底价页面链接
 - info_subdisplay: object	
   - key_brand: string	品牌名称
   - sub_brand: string	所属品牌
   - name: string	车型名称
   - name_series: string	车型系列名称
   - displacement: string	排量
   - oilwear: string	油耗
   - price_guide	string	指导价
   - url: string	车型详情页
   - url_conf: string	车型详情页-配置