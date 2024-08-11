import React from 'react';
import { KeepModeItemtype } from '../types';
import ReactDOMServer from 'react-dom/server';

export default function KeepMode(props: { items: KeepModeItemtype[] }) {
  const { items } = props;

  const renderItem = () => {
    // 将所有 item 的内容组合在一起
    const combinedContent = items.map((item, index) => (
      <div key={index}>
        <div>文章标题：{item.title}</div>
        <div>发布日期：08月08日</div>
        <div dangerouslySetInnerHTML={{ __html: item.content }} />
        {/* <div
          style={{
            borderTop: '2px solid #000',
            margin: '40px 0',
            textAlign: 'center',
          }}
        >
          <span style={{ padding: '0 10px', background: '#fff' }}>分割线</span>
        </div> */}
        <div style={{ textAlign: 'center', margin: '50px 0 0', color: '#888' }}>
          <strong>August 11, 2024</strong>
        </div>
      </div>
    ));
    // 使用 ReactDOMServer 渲染成静态标记
    const staticMarkup = ReactDOMServer.renderToStaticMarkup(combinedContent);
    // 将渲染结果包裹在 CDATA 中
    const cdataWrappedContent = `<![CDATA[${staticMarkup}]]>`;

    // 返回新的 RSS <item>
    return `
      <item>
        <title>Combined RSS Content</title>
        <description>${cdataWrappedContent}</description>
      </item>`;
  };

  return (
    <rss version="2.0">
      <channel>
        <title>My RSS Feed</title>
        <description>RSS 汇总</description>
        {/* 直接输出字符串 */}
        <div dangerouslySetInnerHTML={{ __html: renderItem() }} />
      </channel>
    </rss>
  );
}
