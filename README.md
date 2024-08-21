[![SVG Banners](https://svg-banners.vercel.app/api?type=rainbow&text1=RSS%20奏章%20📰&width=800&height=210)](https://github.com/Akshay090/svg-banners)


# RSS 奏章 📰

## 1. 项目简介
RSS-Zouzhang旨在解决RSS频繁更新导致的未读消息过多的问题。通过将特定周期内的RSS新闻总结和汇总成一个综合条目，用户可以像皇上阅读奏章一样，轻松阅读和处理信息，从而提升阅读体验，避免信息过载。

## 2. 项目功能
* 新闻总结：对每条RSS新闻进行简洁总结，提取关键内容。
* 关键字提取：从新闻中提取关键字，帮助识别主要信息。
* 新闻合并：将多条新闻合并成一条综合新闻条目，方便用户快速阅读。

## 3. 工作流程
* 爬取RSS源：从指定的RSS源中获取新闻信息。
* 新闻处理：对每条新闻进行处理，提取关键信息。
* 新闻合并：将多条新闻合并成一条综合新闻条目。
* 生成奏章：将综合新闻条目进行聚合，生成奏章。

## 4. 工作模式
* summary
  * 适用于新闻内容较多的RSS源。对每条新闻让LLM进行简洁总结，提取关键内容，再进行合并。
* keep
  * 保留原文，仅仅是将多个新闻进行合并，适用于内容简短的新闻。

## 配置项
配置文件存放于项目的根目录的，名称叫rss-config.json
```json
[
  {
  "sourceUrl": "https://rsshub.app/coolapk/hot",
  "customTitle": "酷安热榜",
  "updateInterval": 2,
  "tagName": "description",
  "dateTag": "pubDate",
  "mode": "keep",
  "customName": "coolapk-hot"
}
]
```
字段说明

- **sourceUrl:**
  - 说明: RSS 或 Atom 源的 URL 地址。
  - 示例: `"https://rsshub.app/coolapk/hot"`

- **customTitle:**
  - 说明: 自定义的标题，用于标识该数据源的名称。
  - 示例: `"酷安热榜"`

- **updateInterval:**
  - 说明: 数据源更新的间隔时间（以天为单位）。表示多久会检查一次数据源的更新。
  - 示例: `2`

- **tagName:**
  - 说明: 表示文章内容的标签。由于不同的 RSS 网站使用不同的标签来存放文章内容，需要指定具体的标签名。
  - 常见值: `description`, `content:encoded`, `content`
  - 示例: `"description"`

- **dateTag:**
  - 说明: 表示文章发布时间的标签。由于不同的 RSS 网站使用不同的标签来存放发布时间，需要指定具体的标签名。
  - 常见值: `pubDate`, `published`
  - 示例: `"pubDate"`

- **mode:**
  - 说明: 处理模式，用于指定如何处理文章内容。有三种模式可选：
    - `keep`: 保持原文内容不变。
    - `mix`: 将原文内容与其他信息混合处理。
    - `summarize`: 提取文章内容摘要。
    - `full`: 获取文章的全文内容。
  - 示例: `"keep"`

- **customName:**
  - 说明: 自定义的 RSS 名称，用于生成订阅地址。此名称不应重复。
  - 示例: `"coolapk-hot"`
  
为了处理 RSS 和 Atom 源的数据，我们需要这么多配置项的原因主要是因为这些协议本身非常灵活，字段名称并没有强制规定。不同的数据源可能会使用不同的标签来存放相同的信息。举个例子，某些源可能使用 description 标签来存放文章内容，而其他源可能用 content:encoded。

为了确保我们的程序能够正确地解析和处理各种源的数据，我们需要明确这些字段的名称。这样，我们就能避免在代码中做很多复杂的判断，从而提高程序的效率和稳定性。通过提供这些配置项，我们可以快速而准确地处理不同的数据源。
## Roadmap
- [x] 保留原文模式
- [ ] summary模式，利用LLM进行新闻内容的简洁总结
- [ ] 优化新闻的展示方式
- [ ] 增加favicon提取功能
