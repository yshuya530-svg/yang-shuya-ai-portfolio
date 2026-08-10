"use client";

import { useEffect } from "react";
import AccordionGallery from "@/components/AccordionGallery";
import BounceCards from "@/components/BounceCards";
import DepthCarousel from "@/components/DepthCarousel";
import DriftWall from "@/components/DriftWall";
import FlowingMenu from "@/components/FlowingMenu";
import Lanyard from "@/components/Lanyard";
import LineSidebar from "@/components/LineSidebar";
import SplashCursor from "@/components/SplashCursor";
import StackGallery from "@/components/StackGallery";
import StrokeText from "@/components/StrokeText";

type MediaItem = { image: string; alt: string; caption: string };

const ecomShots: MediaItem[] = [
  { image: "/assets/ecomlens/ecomlens-01-overview.png", alt: "EcomLens 经营概览页面", caption: "经营概览：评论样本、痛点分布与情感概览" },
  { image: "/assets/ecomlens/ecomlens-02-evidence.png", alt: "EcomLens Listing 证据选择", caption: "证据选择：生成前先绑定真实评论依据" },
  { image: "/assets/ecomlens/ecomlens-03-compare.png", alt: "EcomLens Listing 优化前后对照", caption: "双栏核验：原始 Listing 与优化结果同屏对照" },
  { image: "/assets/ecomlens/ecomlens-04-report.png", alt: "EcomLens 报告中心", caption: "报告中心：复盘摘要、证据和生成结果可导出" },
  { image: "/assets/ecomlens/ecomlens-05-architecture.png", alt: "EcomLens 工作流和技术架构", caption: "产品说明：从评论文件到报告交付的完整链路" },
];

const agentShots: MediaItem[] = [
  { image: "/assets/agent/agent-01-transfer.jpg", alt: "仿手机消息与虚拟转账组件", caption: "仿手机组件：消息、语音与虚拟转账交互" },
  { image: "/assets/agent/agent-02-dialogue.jpg", alt: "角色互动场景的对话界面", caption: "角色互动场景：对话、头像和快捷控制" },
  { image: "/assets/agent/agent-03-player.jpg", alt: "侧边栏音乐播放器组件", caption: "侧边栏组件：玻璃拟态音乐播放器" },
  { image: "/assets/agent/agent-04-world.jpg", alt: "智能体世界设定面板", caption: "信息面板：世界设定、状态与内容层级" },
  { image: "/assets/agent/agent-05-message.jpg", alt: "群聊私聊与搜索面板", caption: "交互模块：群聊、私聊与搜索记录" },
  { image: "/assets/agent/agent-06-world-alt.jpg", alt: "世界设定长页面记录", caption: "长页面记录：设定内容与状态信息组织" },
  { image: "/assets/agent/agent-07-player-alt.jpg", alt: "音乐播放器另一状态", caption: "播放器组件的展开状态" },
  { image: "/assets/agent/agent-08-regex.jpg", alt: "正则规则管理界面", caption: "正则管理：规则开关、编辑与预览" },
  { image: "/assets/agent/agent-09-transfer-alt.jpg", alt: "仿手机虚拟转账另一状态", caption: "仿手机组件的消息与虚拟转账状态" },
];

const agentXhsShots: MediaItem[] = [
  { image: "/assets/xhs-agent/xhs-agent-01-post.jpg", alt: "小红书界面美化分享作品数据", caption: "教程作品：1.1 万浏览、1961 赞、1083 收藏" },
  { image: "/assets/xhs-agent/xhs-agent-02-comments.jpg", alt: "小红书教程评论反馈", caption: "评论反馈：用户按教程完成界面美化" },
  { image: "/assets/xhs-agent/xhs-agent-03-profile.jpg", alt: "上弦月小红书主页", caption: "内容主页：智能体界面改造的公开分享记录" },
];

const growthShots: MediaItem[] = [
  { image: "/assets/xhs-growth/xhs-growth-01-profile.jpg", alt: "Yasmin 小红书主页", caption: "独立账号：1806 粉丝、5 万获赞与收藏" },
  { image: "/assets/xhs-growth/xhs-growth-02-posts.jpg", alt: "小红书系列内容作品", caption: "连续选题：系列内容形成稳定浏览与点赞" },
  { image: "/assets/xhs-growth/xhs-growth-03-fans.jpg", alt: "小红书三十日粉丝数据", caption: "30 日粉丝曲线：新增 1905，沉淀 1806" },
  { image: "/assets/xhs-growth/xhs-growth-04-account.jpg", alt: "小红书账号诊断数据", caption: "账号诊断：曝光、观看、互动和主页访问" },
];

const schoolShots: MediaItem[] = [
  { image: "/assets/experience/school/school-01.jpg", alt: "学校远足拉练活动全景", caption: "远足拉练：大型活动全景记录" },
  { image: "/assets/experience/school/school-02.jpg", alt: "远足拉练活动开场表演", caption: "活动开场：现场内容采集" },
  { image: "/assets/experience/school/school-03.jpg", alt: "学校植树节活动合影", caption: "植树节：活动执行与传播素材" },
  { image: "/assets/experience/school/school-04.jpg", alt: "远足拉练学生队伍", caption: "远足拉练：队伍行进现场" },
  { image: "/assets/experience/school/school-05.jpg", alt: "最美朗读者活动颁奖", caption: "朗读者决赛：颁奖与活动记录" },
  { image: "/assets/experience/school/school-06.jpg", alt: "植树活动公众号编辑署名", caption: "公众号交付：植树活动推文与编辑署名" },
  { image: "/assets/experience/school/school-07.jpg", alt: "朗读活动公众号编辑署名", caption: "公众号交付：朗读活动推文与编辑署名" },
  { image: "/assets/experience/school/school-09.jpg", alt: "远足短视频公开发布页面", caption: "公开发布：远足短视频与传播数据" },
  { image: "/assets/experience/school/school-10.jpg", alt: "远足短视频公开评论", caption: "公开反馈：远足视频评论区" },
  { image: "/assets/experience/school/school-11.jpg", alt: "远足校本课程公开文章", caption: "公开文章：远足拉练校本课程" },
];

const weishiShots: MediaItem[] = [
  { image: "/assets/experience/weishi/weishi-01.jpg", alt: "微视河南文化传媒中心主页", caption: "官方账号：公开内容主页" },
  { image: "/assets/experience/weishi/weishi-02.jpg", alt: "微视河南公开文章标题与署名", caption: "内容采编：公开文章标题与作者署名" },
  { image: "/assets/experience/weishi/weishi-03.jpg", alt: "微视河南文章阅读量与署名", caption: "传播结果：102468 阅读与来源署名" },
  { image: "/assets/experience/weishi/weishi-04.jpg", alt: "搜狐新闻转载页面", caption: "多平台分发：搜狐新闻转载" },
  { image: "/assets/experience/weishi/weishi-05.jpg", alt: "顶端新闻转载页面", caption: "多平台分发：顶端新闻转载" },
  { image: "/assets/experience/weishi/weishi-06.jpg", alt: "小红书与抖音文案策划记录", caption: "内容策划：平台风格文案与选题记录" },
  { image: "/assets/experience/weishi/weishi-07.jpg", alt: "中医活动公开报道", caption: "内容采编：公开活动报道记录" },
  { image: "/assets/experience/weishi/weishi-08.jpg", alt: "微视河南视频号内容矩阵", caption: "内容矩阵：视频号多类型选题" },
];

const workflow = [
  ["01", "评论接入", "CSV / Excel 数据导入"],
  ["02", "清洗归类", "原文和处理结果可追溯"],
  ["03", "AI 洞察", "情感、问题与优先级"],
  ["04", "行动生成", "运营建议与 Listing 优化"],
  ["05", "报告交付", "对照、版本与 Excel 导出"],
];

const ecomFacts = [
  { title: "我的工作", detail: "产品梳理、前端 UI、AI 工作流和演示交付" },
  { title: "交付边界", detail: "保留原文证据，不伪造评分，不自动发布" },
  { title: "技术", detail: "React · TypeScript · FastAPI · pandas · LLM API" },
];

const contactItems = [
  { label: "EMAIL", value: "15669517568@163.com", href: "mailto:15669517568@163.com" },
  { label: "PHONE", value: "156 6951 7568", href: "tel:15669517568" },
  { label: "WECHAT · 点击复制", value: "lxyg0228", copy: "lxyg0228" },
];

export default function Home() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      }
    }), { threshold: .08 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="top">
      <SplashCursor />
      <header className="site-header">
        <a className="wordmark" href="#top"><strong>Shay</strong><span>PORTFOLIO / 2026</span></a>
        <nav aria-label="主导航"><a href="#work">项目</a><a href="#research">研究</a><a href="#experience">实习</a><a className="nav-cta" href="#contact">联系我 ↗</a></nav>
      </header>

      <section className="hero section-shell">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow"><i /> FDE · AI 应用交付 · 前端体验</p>
          <h1>
            <StrokeText className="hero-stroke hero-stroke-one" text="把真实业务需求，" delay={.05} />
            <StrokeText className="hero-stroke hero-stroke-two" text="做成可用、" strokeColor="#c95d42" fillColor="#c95d42" delay={.16} />
            <StrokeText className="hero-stroke hero-stroke-three" text="可核验的 AI 应用。" delay={.27} />
          </h1>
          <p className="hero-summary">我是 Shay / 杨舒雅。我关注用户和商家实际遇到的问题，完成需求梳理、AI 工作流、前端界面和演示交付。</p>
          <div className="hero-actions"><a className="button button-secondary" href="#contact">联系 Shay ↗</a><span className="lanyard-action-copy">右侧轻拉吊牌，直接进入项目 ↓</span></div>
          <div className="hero-roles"><span>需求理解</span><span>AI 应用</span><span>前端 UI</span><span>交付表达</span></div>
        </div>
        <div className="hero-lanyard" data-reveal>
          <Lanyard frontImage="/assets/profile/profile-02.jpg" backImage="/assets/profile/profile-02.jpg" onActivate={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })} />
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div>BUSINESS NEEDS <i>✦</i> AI APPLICATION <i>✦</i> FRONTEND UI <i>✦</i> DELIVERY <i>✦</i> BUSINESS NEEDS <i>✦</i> AI APPLICATION <i>✦</i></div></div>

      <section className="positioning section-shell" data-reveal>
        <span className="section-index">00 / HOW I WORK</span>
        <h2>先弄清楚用户怎么用、商家想改善什么，<br />再决定 AI 放在哪一步。</h2>
        <div className="positioning-grid"><p>我的工作从真实需求和使用场景开始：整理输入、设计处理流程、完成界面，再用证据和结果检查方案是否有效。</p><strong>业务需求 → 工作流 → 界面 → 验证</strong></div>
      </section>

      <section id="work" className="work">
        <div className="section-shell section-heading" data-reveal><div><span className="section-index">01 / PROJECTS · 项目</span><h2>三个项目，三条从需求<br />走到交付结果的路径。</h2></div><p>每个项目独立成章；页面中的数据、界面与公开反馈均来自实际材料。</p></div>

        <div className="section-shell project-divider" data-reveal><span>PROJECT 01</span><strong>EcomLens AI</strong><p>电商评论洞察与经营行动</p></div>

        <article className="case section-shell" data-reveal>
          <div className="case-media"><div className="media-label"><span>FEATURED / 01</span><b>ECOMLENS AI</b></div><video controls muted playsInline preload="metadata" poster="/assets/ecomlens/ecomlens-01-overview.png"><source src="/assets/ecomlens/ecomlens-demo.mp4" type="video/mp4" /></video><small>完整界面录屏 · 点击播放</small></div>
          <div className="case-copy"><div className="case-kicker"><span>AI 经营洞察工作台</span><span>REACT + FASTAPI</span></div><h3>把评论变成可追溯的经营建议和 Listing 优化方案。</h3><p className="case-lead">导入评论后，系统完成清洗、分类、痛点排序、行动建议、Listing 优化和报告导出。结论保留原文证据，运营人员可以核验后再执行。</p><div className="metric-row"><div><strong>200</strong><span>演示评论样本</span></div><div><strong>34</strong><span>高优先级痛点</span></div><div><strong>7</strong><span>待执行建议</span></div></div><FlowingMenu items={ecomFacts} /><a className="text-link" href="https://github.com/yshuya530-svg/EcomLens-AI" target="_blank" rel="noreferrer">查看 GitHub ↗</a></div>
        </article>

        <div className="workflow section-shell" data-reveal><div className="workflow-title"><span>FROM RAW DATA TO ACTION</span><b>端到端工作流</b></div><div className="workflow-track">{workflow.map(([n,title,text]) => <div className="workflow-step" key={n}><span>{n}</span><i /><h4>{title}</h4><p>{text}</p></div>)}</div></div>

        <div className="gallery-block section-shell" data-reveal><div className="gallery-heading"><div><span>ECOMLENS / PRODUCT EVIDENCE</span><h3>从概览到报告的 5 个关键界面</h3></div><p>Depth Carousel 已按横向后台界面调整；图片完整显示，不再截边。</p></div><DepthCarousel items={ecomShots} cardWidth={930} cardHeight={450} stageHeight={610} depth={145} spread={92} tilt={8} visibleCards={3} fit="contain" /></div>

        <div className="section-shell project-divider project-divider-spaced" data-reveal><span>PROJECT 02</span><strong>AI 智能体设计与前端体验</strong><p>角色系统、交互体验与持续迭代</p></div>

        <article className="agent-case section-shell" data-reveal>
          <div className="agent-copy"><div className="case-kicker"><span>02 / AI AGENT + FRONTEND UX</span><span>HTML · CSS · JS · PROMPT</span></div><h3>设计两个垂直场景智能体，并把平台交互体验一起做完整。</h3><p className="case-lead">我负责角色设定、任务边界、Prompt 结构和回复规范，也独立完成信息面板、侧边栏和交互组件的前端优化。根据真实对话反馈持续调整 Prompt 逻辑，提升长对话中的稳定性。</p><div className="agent-outcomes"><div><strong>2</strong><span>垂直场景智能体</span></div><div><strong>10万+</strong><span>真实互动</span></div><div><strong>1000+</strong><span>原平台 + 内容账号累计关注</span></div><div><strong>1万+</strong><span>获赞与收藏</span></div></div><div className="project-scope"><div><b>智能体设计</b><p>角色设定、任务边界、Prompt 结构、回复规范</p></div><div><b>前端体验</b><p>信息面板、侧边栏、交互组件和用户路径优化</p></div><div><b>持续迭代</b><p>观察对话反馈，调整 Prompt 和长对话稳定性</p></div></div><p className="simulation-note">下方是部分前端实现证据。仿手机只是其中一个组件；其中转账金额和消息内容均为界面模拟。</p></div>
          <div className="agent-stage"><StackGallery items={agentShots} /></div>
        </article>

        <div className="section-shell project-divider project-divider-spaced" data-reveal><span>PROJECT 03</span><strong>内容教程与增长实验</strong><p>公开反馈、账号增长与数据复盘</p></div>

        <div className="content-cases section-shell" data-reveal>
          <article className="content-card content-card-blue"><span className="card-label">产品衍生内容 / 03A</span><h3>把界面改造过程整理成用户能复用的教程。</h3><p>公开分享前端美化过程，用收藏和评论反馈检查教程是否清楚、是否真正帮用户完成操作。</p><div className="content-metrics"><div><strong>1.1万</strong><span>浏览</span></div><div><strong>1961</strong><span>点赞</span></div><div><strong>1083</strong><span>收藏</span></div></div><AccordionGallery items={agentXhsShots} tone="blue" /></article>
          <article className="content-card content-card-coral"><span className="card-label">独立增长实验 / 03B</span><h3>围绕连续选题和数据复盘，完成从 0 到 1800+ 粉丝。</h3><p>观察曝光、互动、主页访问和涨粉曲线，再调整下一轮主题与内容结构。</p><div className="content-metrics"><div><strong>1806</strong><span>总粉丝</span></div><div><strong>5.0万</strong><span>获赞与收藏</span></div><div><strong>93.7%</strong><span>活跃粉丝占比</span></div></div><AccordionGallery items={growthShots} tone="orange" /></article>
        </div>
      </section>

      <section id="research" className="research">
        <div className="section-shell research-intro" data-reveal><span className="section-index">02 / DATA RESEARCH</span><div><h2>哪些购买前行为，真的能提示用户有购买意向？</h2><p>我用淘宝行为日志做了一次可解释的购买预测研究。重点是找出有效信号，再把结果翻译成高、中、低意向用户的运营动作。</p></div></div>
        <div className="section-shell research-pipeline" data-reveal><div><span>01</span><b>行为日志</b><p>浏览、收藏、加购、购买</p></div><i>→</i><div><span>02</span><b>用户特征</b><p>加购数、品类多样性等</p></div><i>→</i><div><span>03</span><b>逻辑回归</b><p>预测并解释购买概率</p></div><i>→</i><div><span>04</span><b>分层动作</b><p>按意向匹配不同触达</p></div></div>
        <div className="section-shell research-visual" data-reveal><div className="research-copy"><span>MODEL PERFORMANCE</span><h3>模型能识别购买倾向，也保留了需要继续改进的边界。</h3><p>8477 名平衡样本中，测试集为 1696。Python 模型 AUC 为 0.7602，准确率 67.98%、精确率 74%、召回率 60%。未购买用户识别仍偏弱，因此结果适合辅助分层，不适合自动做最终判断。</p></div><figure><img src="/assets/research/research-performance.png" alt="购买意图模型表现与关键特征图" /><figcaption>模型表现与关键变量 · 按论文数据重绘</figcaption></figure></div>
        <div className="section-shell research-visual research-visual-reverse" data-reveal><div className="research-copy"><span>ACTIONABLE SEGMENTATION</span><h3>加购次数和品类多样性，转成三类可执行人群。</h3><p>加购每增加 1 次，购买优势比约增加 5.6%；浏览品类每增加 1 类，约增加 1.3%。据此把用户分为高、中、低意向，并匹配不同的提醒、优惠和内容触达。</p></div><figure><img src="/assets/research/research-segmentation.png" alt="高中低购买意向用户分层策略图" /><figcaption>用户意向分层与运营动作 · 按论文结论重绘</figcaption></figure></div>
      </section>

      <section id="experience" className="experience section-shell">
        <div className="section-heading" data-reveal><div><span className="section-index">03 / INTERNSHIPS · 实习</span><h2>两段实习，两个真实的<br />内容交付现场。</h2></div><p>所有画面保持原比例完整展示；点击可看完整大图。</p></div>
        <article className="experience-case" data-reveal><div className="experience-copy"><span>2026 / SCHOOL COMMUNICATION</span><h3>玉林新世纪高级中学</h3><p>参与校园活动内容策划、现场采集、短视频与公众号编辑。从活动现场到公开成稿，留下完整交付证据。</p><div className="experience-tags"><span>现场采集</span><span>短视频</span><span>图文编辑</span><span>活动协作</span></div></div><DriftWall items={schoolShots} /></article>
        <article className="experience-case experience-case-alt" data-reveal><div className="experience-copy"><span>2025 / MEDIA DELIVERY</span><h3>微视河南文化传媒中心</h3><p>参与公开内容采编、平台风格适配与多渠道分发。作者署名、阅读量和转载页面构成可核验的工作记录。</p><div className="experience-tags"><span>内容采编</span><span>平台适配</span><span>多渠道分发</span><span>公开传播</span></div></div><BounceCards items={weishiShots} /></article>
      </section>

      <section className="about section-shell" data-reveal>
        <figure className="about-photo"><div><img src="/assets/profile/profile-01.jpg" alt="Shay 的生活照" /></div><figcaption>OFF DUTY / STILL CURIOUS</figcaption></figure>
        <div className="about-copy"><span className="section-index">04 / ABOUT SHAY</span><h2>电子商务背景，<br />前端与 AI 应用实践。</h2><p>我习惯先理解业务、用户和交付目标，再把方案做成清楚的界面与可演示产品。正在寻找 FDE、AI 应用交付或偏产品的前端机会。</p><div className="skill-cloud"><span>React</span><span>TypeScript</span><span>Python</span><span>FastAPI</span><span>Prompt Design</span><span>UI Motion</span><span>Content Ops</span></div></div>
      </section>

      <footer id="contact"><div className="section-shell footer-main"><div className="footer-intro"><span>LET&apos;S BUILD SOMETHING USEFUL</span><h2>如果你在寻找<br />能理解需求、完成界面，<br /><em>也能把 AI 应用交付出来的人，</em><br />欢迎来聊。</h2></div><LineSidebar items={contactItems} /></div><div className="section-shell footer-bottom"><span>© 2026 SHAY / YANG SHUYA</span><span>AI APPLICATION DELIVERY · FRONTEND UI</span><a href="#top">BACK TO TOP ↑</a></div></footer>
    </main>
  );
}
