"use client";

import { useEffect, useRef, useState } from "react";

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  sensitive?: boolean;
};

const ecomShots: GalleryItem[] = [
  { src: "/assets/ecomlens/ecomlens-01-overview.png", alt: "EcomLens 经营概览页面", caption: "经营概览：从评论样本提炼痛点、情感和行动方向" },
  { src: "/assets/ecomlens/ecomlens-02-evidence.png", alt: "EcomLens Listing 证据选择", caption: "证据选择：让生成内容绑定真实评论依据" },
  { src: "/assets/ecomlens/ecomlens-03-compare.png", alt: "EcomLens Listing 优化前后对照", caption: "双栏对照：原始 Listing 与优化结果同屏核验" },
  { src: "/assets/ecomlens/ecomlens-04-report.png", alt: "EcomLens 报告中心", caption: "报告中心：复盘摘要、原始证据和生成结果可导出" },
  { src: "/assets/ecomlens/ecomlens-05-architecture.png", alt: "EcomLens 工作流和技术架构", caption: "产品说明：从评论文件到报告导出的完整闭环" },
];

const agentShots: GalleryItem[] = [
  { src: "/assets/agent/agent-01-transfer.jpg", alt: "虚拟手机消息与转账卡片", caption: "虚拟转账、语音与消息气泡" },
  { src: "/assets/agent/agent-02-dialogue.jpg", alt: "虚拟手机对话页面", caption: "沉浸式对话、侧边头像和状态控制" },
  { src: "/assets/agent/agent-03-player.jpg", alt: "虚拟手机音乐播放器", caption: "玻璃拟态音乐播放器组件" },
  { src: "/assets/agent/agent-04-world.jpg", alt: "虚拟手机世界设定面板", caption: "世界设定、状态栏和信息层级" },
  { src: "/assets/agent/agent-05-message.jpg", alt: "虚拟手机群聊私聊面板", caption: "群聊、私聊与搜索残卷界面" },
  { src: "/assets/agent/agent-06-world-alt.jpg", alt: "世界设定面板备份截图", caption: "世界设定长页面的另一版记录" },
  { src: "/assets/agent/agent-07-player-alt.jpg", alt: "音乐播放器备份截图", caption: "播放器组件的另一版记录" },
  { src: "/assets/agent/agent-08-regex.jpg", alt: "正则管理界面", caption: "用正则规则过滤文本并稳定渲染交互" },
  { src: "/assets/agent/agent-09-transfer-alt.jpg", alt: "虚拟转账备份截图", caption: "虚拟消息与转账卡片的另一版记录" },
];

const agentXhsShots: GalleryItem[] = [
  { src: "/assets/xhs-agent/xhs-agent-01-post.jpg", alt: "小红书美化分享作品数据", caption: "单篇作品：1.1 万浏览、1961 赞、1083 收藏" },
  { src: "/assets/xhs-agent/xhs-agent-02-comments.jpg", alt: "小红书评论区正向反馈", caption: "评论区反馈：教程被用户理解并复用" },
  { src: "/assets/xhs-agent/xhs-agent-03-profile.jpg", alt: "上弦月小红书主页", caption: "从智能体界面改造延伸出的内容账号" },
];

const growthShots: GalleryItem[] = [
  { src: "/assets/xhs-growth/xhs-growth-01-profile.jpg", alt: "Yasmin 小红书主页", caption: "独立增长实验：1806 粉丝、5 万获赞与收藏" },
  { src: "/assets/xhs-growth/xhs-growth-02-posts.jpg", alt: "系列内容作品表现", caption: "连续系列内容，多篇点赞进入 3000—1.4 万区间" },
  { src: "/assets/xhs-growth/xhs-growth-03-fans.jpg", alt: "小红书三十日粉丝数据", caption: "30 日增长曲线：新增 1905，沉淀 1806 总粉丝" },
  { src: "/assets/xhs-growth/xhs-growth-04-account.jpg", alt: "小红书账号诊断数据", caption: "账号诊断：观看、互动、涨粉与主页访问表现" },
];

const schoolShots: GalleryItem[] = [
  { src: "/assets/experience/school/school-01.jpg", alt: "学校大型活动全景", caption: "远足拉练活动全景记录" },
  { src: "/assets/experience/school/school-02.jpg", alt: "学校活动开场表演", caption: "活动开场与现场内容采集", sensitive: true },
  { src: "/assets/experience/school/school-03.jpg", alt: "植树节活动合影", caption: "植树节活动执行与传播素材" },
  { src: "/assets/experience/school/school-04.jpg", alt: "学生远足队伍", caption: "远足活动现场记录", sensitive: true },
  { src: "/assets/experience/school/school-05.jpg", alt: "朗读活动颁奖合影", caption: "朗读者决赛暨知识竞赛内容素材", sensitive: true },
  { src: "/assets/experience/school/school-06.jpg", alt: "植树活动公众号署名", caption: "公众号成稿与编辑署名证据" },
  { src: "/assets/experience/school/school-07.jpg", alt: "朗读活动公众号署名", caption: "活动推文编辑与审校署名", sensitive: true },
  { src: "/assets/experience/school/school-08.jpg", alt: "活动短视频分镜表", caption: "1 分 50 秒活动视频的镜头、台词和音乐规划" },
  { src: "/assets/experience/school/school-09.jpg", alt: "远足短视频公开页面", caption: "公开短视频发布与传播数据", sensitive: true },
  { src: "/assets/experience/school/school-10.jpg", alt: "远足短视频评论页面", caption: "活动视频的公开反馈", sensitive: true },
  { src: "/assets/experience/school/school-11.jpg", alt: "远足活动公开文章", caption: "远足拉练校本课程公开文章" },
];

const weishiShots: GalleryItem[] = [
  { src: "/assets/experience/weishi/weishi-01.jpg", alt: "微视河南文化传媒中心主页", caption: "微视河南公开账号主页" },
  { src: "/assets/experience/weishi/weishi-02.jpg", alt: "微视河南公开文章署名", caption: "公开文章中的作者署名" },
  { src: "/assets/experience/weishi/weishi-03.jpg", alt: "微视河南文章阅读量与署名", caption: "10 万+阅读的公开文章与来源署名" },
  { src: "/assets/experience/weishi/weishi-04.jpg", alt: "搜狐新闻转载页面", caption: "同一内容在搜狐新闻转载" },
  { src: "/assets/experience/weishi/weishi-05.jpg", alt: "顶端新闻转载页面", caption: "同一内容在顶端新闻转载" },
  { src: "/assets/experience/weishi/weishi-06.jpg", alt: "小红书风格文案策划", caption: "内容风格适配与脚本策划记录" },
  { src: "/assets/experience/weishi/weishi-07.jpg", alt: "中医活动公开报道", caption: "公开活动内容采编记录" },
  { src: "/assets/experience/weishi/weishi-08.jpg", alt: "微视河南视频号页面", caption: "视频号内容矩阵与多类型选题" },
];

const workflow = [
  ["01", "评论接入", "CSV / Excel 数据导入"],
  ["02", "清洗归类", "保留原文与可追溯证据"],
  ["03", "AI 洞察", "情感、维度与问题优先级"],
  ["04", "行动生成", "运营建议与 Listing 优化"],
  ["05", "报告交付", "对照、版本与 Excel 导出"],
];

function EvidenceGallery({ items, compact = false }: { items: GalleryItem[]; compact?: boolean }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((active + 1) % items.length);
      if (event.key === "ArrowLeft") setActive((active - 1 + items.length) % items.length);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [active, items.length]);

  return (
    <>
      <div className={`evidence-grid ${compact ? "evidence-grid-compact" : ""}`}>
        {items.map((item, index) => (
          <button className="evidence-card" type="button" key={`${item.src}-${index}`} onClick={() => setActive(index)}>
            <img className={item.sensitive ? "privacy-soft" : ""} src={item.src} alt={item.alt} loading="lazy" />
            <span><b>{String(index + 1).padStart(2, "0")}</b>{item.caption}</span>
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="项目素材预览">
          <button className="lightbox-close" type="button" aria-label="关闭预览" onClick={() => setActive(null)}>×</button>
          <button className="lightbox-arrow lightbox-prev" type="button" aria-label="上一张" onClick={(event) => { event.stopPropagation(); setActive((active - 1 + items.length) % items.length); }}>←</button>
          <figure>
            <img className={items[active].sensitive ? "privacy-soft" : ""} src={items[active].src} alt={items[active].alt} />
            <figcaption><span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>{items[active].caption}</figcaption>
          </figure>
          <button className="lightbox-arrow lightbox-next" type="button" aria-label="下一张" onClick={(event) => { event.stopPropagation(); setActive((active + 1) % items.length); }}>→</button>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));

    const hero = heroRef.current;
    const handlePointer = (event: PointerEvent) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    };
    hero?.addEventListener("pointermove", handlePointer);
    return () => {
      observer.disconnect();
      hero?.removeEventListener("pointermove", handlePointer);
    };
  }, []);

  return (
    <main id="top">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="回到顶部"><strong>Shay</strong><span>portfolio / 2026</span></a>
        <nav aria-label="主导航">
          <a href="#work">项目</a>
          <a href="#research">研究</a>
          <a href="#experience">经历</a>
          <a className="nav-cta" href="#contact">联系我 <span>↗</span></a>
        </nav>
      </header>

      <section className="hero" ref={heroRef}>
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-copy" data-reveal>
          <p className="eyebrow"><i /> FDE · AI 应用交付 · 前端体验</p>
          <h1>把复杂问题，<br /><em>做成能用、</em><br /><span>好用、能讲清</span>的<br />AI 应用。</h1>
          <div className="hero-intro">
            <p>你好，我是 <b>Shay / 杨舒雅</b>。我喜欢把业务理解、AI 能力、数据证据和精细的界面体验串成一条完整交付路径。</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">查看作品 <span>↓</span></a>
              <a className="button button-secondary" href="#contact">联系 Shay <span>↗</span></a>
            </div>
          </div>
        </div>
        <div className="hero-portrait" data-reveal>
          <figure className="portrait-main"><img src="/assets/profile/profile-02.jpg" alt="Shay 手持相机的生活照" /><figcaption>SHAY / DESIGNING WITH EVIDENCE</figcaption></figure>
          <figure className="portrait-secondary"><img src="/assets/profile/profile-01.jpg" alt="Shay 的餐厅生活照" /></figure>
          <div className="portrait-sticker"><span>01</span><b>产品感</b><b>设计感</b><b>交付感</b></div>
        </div>
        <div className="hero-meta">
          <span>BASED IN CHINA</span><span>AVAILABLE FOR FULL-TIME</span><span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div><span>BUSINESS FRAMING</span><i>✦</i><span>AI APPLICATION</span><i>✦</i><span>FRONTEND UI</span><i>✦</i><span>DELIVERY STORYTELLING</span><i>✦</i><span>BUSINESS FRAMING</span><i>✦</i><span>AI APPLICATION</span><i>✦</i><span>FRONTEND UI</span><i>✦</i></div></div>

      <section className="positioning section-shell" data-reveal>
        <span className="section-index">00 / POSITIONING</span>
        <h2>我不把 AI 当作孤立功能。<br />我关心它怎样进入真实工作流，<br /><em>被人理解、使用和验证。</em></h2>
        <div className="positioning-note"><span>MY WORKING FORMULA</span><strong>业务理解 × AI 应用 × 前端体验 × 内容表达</strong></div>
      </section>

      <section className="work" id="work">
        <div className="section-shell section-heading" data-reveal>
          <div><span className="section-index">01 / SELECTED WORK</span><h2>项目不是功能清单，<br />而是问题如何被解决。</h2></div>
          <p>每个案例都回答四件事：为什么做、怎样拆、如何实现、用什么证据验证。</p>
        </div>

        <article className="case case-ecom section-shell" data-reveal>
          <div className="case-media">
            <div className="media-label"><span>FEATURED / 01</span><b>ECOMLENS AI</b></div>
            <video controls muted playsInline preload="metadata" poster="/assets/ecomlens/ecomlens-01-overview.png">
              <source src="/assets/ecomlens/ecomlens-demo.mp4" type="video/mp4" />
            </video>
            <small>真实项目录屏 · 点击播放</small>
          </div>
          <div className="case-copy">
            <div className="case-kicker"><span>AI 经营洞察工作台</span><span>REACT + FASTAPI</span></div>
            <h3>让每一条经营结论，都能回到评论证据。</h3>
            <p className="case-lead">把评论文件接入、清洗、AI 分类、痛点排序、行动建议、Listing 优化和报告导出串成闭环。生成不是终点，核验与运营执行才是。</p>
            <div className="metric-row"><div><strong>200</strong><span>演示评论样本</span></div><div><strong>34</strong><span>高优先级痛点</span></div><div><strong>7</strong><span>待执行建议</span></div></div>
            <dl className="fact-list"><div><dt>我的角色</dt><dd>产品梳理、前端 UI、AI 工作流与演示交付</dd></div><div><dt>核心原则</dt><dd>保留原文证据，不伪造评分，不自动发布</dd></div><div><dt>技术栈</dt><dd>React · TypeScript · FastAPI · pandas · LLM API</dd></div></dl>
            <a className="text-link" href="https://github.com/yshuya530-svg/EcomLens-AI" target="_blank" rel="noreferrer">查看 GitHub <span>↗</span></a>
          </div>
        </article>

        <div className="workflow section-shell" data-reveal>
          <div className="workflow-title"><span>FROM RAW DATA TO ACTION</span><b>端到端工作流</b></div>
          <div className="workflow-track">{workflow.map(([n, title, text]) => <div className="workflow-step" key={n}><span>{n}</span><i /><h4>{title}</h4><p>{text}</p></div>)}</div>
        </div>

        <div className="gallery-block section-shell" data-reveal>
          <div className="gallery-heading"><div><span>ECOMLENS / PRODUCT EVIDENCE</span><h3>从概览到报告的 5 个关键界面</h3></div><p>点击任意画面逐张查看，使用键盘方向键也可以切换。</p></div>
          <EvidenceGallery items={ecomShots} compact />
        </div>

        <article className="case case-agent section-shell" data-reveal>
          <div className="case-copy">
            <div className="case-kicker"><span>02 / INTERACTION EXPERIMENT</span><span>CSS + REGEX</span></div>
            <h3>把对话页面，做成一个有情绪、有状态的虚拟手机。</h3>
            <p className="case-lead">围绕角色互动场景设计消息气泡、语音、转文字、撤回、状态栏、音乐播放器和小手机组件。用 CSS 控制视觉层级，用正则规则过滤文本并触发稳定渲染。</p>
            <div className="notice"><b>演示说明</b><p>画面中的转账金额、聊天内容与角色互动均为前端虚拟模拟，不代表真实交易或真实用户数据。</p></div>
            <ul className="feature-list"><li><span>01</span>手机框架、状态栏与侧边控件</li><li><span>02</span>消息 / 语音 / 撤回 / 虚拟转账组件</li><li><span>03</span>正则过滤与稳定交互渲染</li><li><span>04</span>玻璃拟态播放器与视觉主题</li></ul>
          </div>
          <div className="agent-stage"><div className="agent-orbit" aria-hidden="true" /><EvidenceGallery items={agentShots} compact /></div>
        </article>

        <div className="content-cases section-shell" data-reveal>
          <article className="content-card content-card-blue">
            <div className="content-number">03A</div><span className="card-label">产品衍生内容</span><h3>把一次界面改造，变成用户愿意收藏和复用的教程。</h3>
            <p>围绕虚拟手机的界面美化与交互实现做内容拆解，用评论区反馈验证教程是否真正解决问题。</p>
            <div className="content-metrics"><div><strong>1.1万</strong><span>单篇浏览</span></div><div><strong>1961</strong><span>点赞</span></div><div><strong>1083</strong><span>收藏</span></div></div>
            <EvidenceGallery items={agentXhsShots} compact />
          </article>
          <article className="content-card content-card-coral">
            <div className="content-number">03B</div><span className="card-label">独立增长实验</span><h3>从 0 到 1800+ 粉丝，用系列选题和数据复盘跑出增长。</h3>
            <p>把内容拆成连续主题，观察曝光、互动、主页访问和涨粉曲线，让“灵感”变成可复盘的内容系统。</p>
            <div className="content-metrics"><div><strong>1806</strong><span>总粉丝</span></div><div><strong>5.0万</strong><span>获赞与收藏</span></div><div><strong>93.7%</strong><span>活跃粉丝占比</span></div></div>
            <EvidenceGallery items={growthShots} compact />
          </article>
        </div>
      </section>

      <section className="research" id="research">
        <div className="section-shell research-grid" data-reveal>
          <div className="research-heading"><span className="section-index">02 / DATA RESEARCH</span><h2>电商用户购买意图识别与转化预测研究</h2><p>把毕业论文重新整理成一个可读的业务研究案例：从行为日志出发，识别高意向特征，并讨论模型怎样帮助运营分层。</p></div>
          <div className="research-stats"><div><strong>8,477</strong><span>用户样本</span></div><div><strong>1,696</strong><span>测试集样本</span></div><div><strong>0.7602</strong><span>AUC</span></div><div><strong>67.98%</strong><span>准确率</span></div></div>
        </div>
        <div className="section-shell research-flow" data-reveal>
          <div><span>01</span><h3>数据处理</h3><p>清洗浏览、收藏、加购与购买行为，构建用户层面的行为特征。</p></div>
          <div><span>02</span><h3>特征工程</h3><p>提取加购次数、品类多样性、访问深度与转化路径等变量。</p></div>
          <div><span>03</span><h3>模型验证</h3><p>以逻辑回归完成预测，并用准确率、精确率、召回率和 AUC 评估。</p></div>
          <div><span>04</span><h3>运营启示</h3><p>加购数量和品类多样性是关键变量，可用于高、中、低意向用户分层。</p></div>
        </div>
        <div className="section-shell model-panel" data-reveal>
          <div className="model-score"><span>MODEL CHECK</span><strong>74%</strong><small>PRECISION</small></div>
          <div className="model-score"><span>MODEL CHECK</span><strong>60%</strong><small>RECALL</small></div>
          <div className="model-insight"><span>KEY FINDING</span><h3>用户“加了多少”和“看得多广”，比单一浏览次数更能解释购买意向。</h3><p>研究价值不在于追求一个孤立分数，而在于把模型结果翻译成可执行的人群分层和触达策略。</p></div>
        </div>
      </section>

      <section className="experience section-shell" id="experience">
        <div className="section-heading" data-reveal><div><span className="section-index">03 / FIELD NOTES</span><h2>真实现场、内容证据<br />与协作交付。</h2></div><p>公开照片与发布记录先全部入库；涉及学生清晰人像的画面已做柔化展示。</p></div>
        <article className="experience-case" data-reveal>
          <div className="experience-copy"><span>2026 / SCHOOL COMMUNICATION</span><h3>玉林新世纪高级中学</h3><p>参与校园活动内容策划、现场采集、短视频分镜与公众号编辑。从活动发生，到内容成稿，再到公开发布，保留完整交付链路。</p><div className="experience-tags"><span>活动策划</span><span>分镜脚本</span><span>图文编辑</span><span>现场协作</span></div></div>
          <EvidenceGallery items={schoolShots} compact />
        </article>
        <article className="experience-case experience-case-alt" data-reveal>
          <div className="experience-copy"><span>2025 / MEDIA DELIVERY</span><h3>微视河南文化传媒中心</h3><p>参与公开内容采编、平台适配与多渠道分发。署名、阅读量和转载页面构成可核验的工作证据。</p><div className="experience-tags"><span>内容采编</span><span>多平台分发</span><span>风格适配</span><span>公开传播</span></div></div>
          <EvidenceGallery items={weishiShots} compact />
        </article>
      </section>

      <section className="about section-shell" data-reveal>
        <div className="about-photos"><figure><img src="/assets/profile/profile-01.jpg" alt="Shay 的生活照" /></figure><figure><img src="/assets/profile/profile-02.jpg" alt="Shay 手持相机的生活照" /></figure></div>
        <div className="about-copy"><span className="section-index">04 / ABOUT SHAY</span><h2>有商业理解，也在意每一个像素。</h2><p>电子商务背景让我习惯先理解业务和用户；前端与 AI 实践让我能把想法做成可演示的产品；内容经验则训练我把复杂方案讲清楚。我正在寻找 FDE、AI 应用交付或偏产品的前端机会。</p><div className="skill-cloud"><span>React</span><span>TypeScript</span><span>Python</span><span>FastAPI</span><span>LLM Workflow</span><span>UI Motion</span><span>Content Ops</span></div></div>
      </section>

      <footer id="contact">
        <div className="section-shell footer-main"><span>LET&apos;S BUILD SOMETHING USEFUL</span><h2>如果你也在寻找<br /><em>能把 AI 做成产品的人，</em><br />欢迎来聊。</h2><div className="contact-grid"><a href="mailto:15669517568@163.com"><span>EMAIL</span><b>15669517568@163.com</b><i>↗</i></a><a href="tel:15669517568"><span>PHONE</span><b>156 6951 7568</b><i>↗</i></a><div><span>WECHAT</span><b>lxyg0228</b><i>复制添加</i></div></div></div>
        <div className="section-shell footer-bottom"><span>© 2026 SHAY / YANG SHUYA</span><span>DESIGNED & BUILT WITH CURIOSITY</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
