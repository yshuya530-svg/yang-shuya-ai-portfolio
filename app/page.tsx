"use client";

import { useEffect, useRef } from "react";

const workflow = [
  ["01", "接入", "上传原始评论文件"],
  ["02", "清洗", "去重、标记与抽样"],
  ["03", "分析", "AI 分类与证据定位"],
  ["04", "决策", "痛点排序与行动建议"],
  ["05", "交付", "Listing 与 Excel 报告"],
];

const capabilityGroups = [
  {
    number: "01",
    title: "业务理解",
    en: "Business framing",
    copy: "把模糊需求拆成可执行流程，先定义问题、使用者与验收标准。",
    tags: ["需求拆解", "用户路径", "指标设计"],
  },
  {
    number: "02",
    title: "AI 应用",
    en: "AI application",
    copy: "把模型能力放进真实工作流，处理 Prompt、边界、结构化输出与异常。",
    tags: ["LLM", "智能体", "工作流"],
  },
  {
    number: "03",
    title: "界面与数据",
    en: "Interface & data",
    copy: "用前端交互降低理解成本，用数据处理让结果可追踪、可解释。",
    tags: ["React", "TypeScript", "Python"],
  },
  {
    number: "04",
    title: "交付表达",
    en: "Delivery & storytelling",
    copy: "用演示、文档、测试与内容表达，让方案能被理解、采用和继续迭代。",
    tags: ["演示", "复盘", "内容表达"],
  },
];

const assetItems = [
  ["EcomLens", "60–90 秒横屏录屏、3–5 张核心页面、GitHub 链接、一次真实运行结果"],
  ["AI 对话项目", "平台主页、改版前后截图、2–3 段脱敏对话、后台互动数据"],
  ["内容账号", "主页、时间范围清晰的后台数据、2–3 篇代表作、选题或复盘文档"],
  ["个人信息", "一张自然职业照、公开邮箱、GitHub/社媒链接、是否公开手机与微信"],
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
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
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="回到顶部">
          <span>YSY</span>
          <small>Portfolio / 2026</small>
        </a>
        <nav aria-label="主导航">
          <a href="#work">项目</a>
          <a href="#capabilities">能力</a>
          <a href="#about">经历</a>
          <a className="nav-cta" href="mailto:15669517568@163.com">
            联系我 <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> FDE · AI 应用交付 · 前端体验</p>
          <h1>
            把业务问题
            <span className="display-outline">做成可用的</span>
            <span className="display-accent">AI 产品。</span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-intro">
              你好，我是杨舒雅。电子商务背景，专注于业务流程、AI 能力与前端体验的交叉地带。
              我喜欢把复杂问题整理成<span>可演示、可验证、可交付</span>的工具。
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">查看代表项目 <span>↓</span></a>
              <a className="button button-ghost" href="/yang-shuya-resume.pdf" target="_blank">查看简历</a>
            </div>
          </div>
        </div>
        <aside className="hero-console" aria-label="个人能力概览">
          <div className="console-head">
            <span className="status-dot" /> AVAILABLE FOR OPPORTUNITIES
            <b>CN / 2026</b>
          </div>
          <div className="console-orbit">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-core">YSY</div>
            <span className="orbit-label label-one">BUSINESS</span>
            <span className="orbit-label label-two">AI</span>
            <span className="orbit-label label-three">UI</span>
          </div>
          <div className="console-stats">
            <div><strong>62.7K</strong><span>评论数据处理</span></div>
            <div><strong>100K+</strong><span>真实用户互动</span></div>
            <div><strong>03</strong><span>核心项目方向</span></div>
          </div>
        </aside>
        <a className="scroll-cue" href="#manifesto">
          <span>SCROLL TO EXPLORE</span><i aria-hidden="true" />
        </a>
      </section>

      <div className="marquee" aria-label="能力关键词">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, index) => (
            <div className="marquee-set" key={index} aria-hidden={index === 1}>
              <span>BUSINESS SENSE</span><i>✦</i><span>AI APPLICATION</span><i>✦</i>
              <span>FRONTEND EXPERIENCE</span><i>✦</i><span>DELIVERY MINDSET</span><i>✦</i>
            </div>
          ))}
        </div>
      </div>

      <section className="manifesto section-shell" id="manifesto" data-reveal>
        <div className="section-index">00 / POSITIONING</div>
        <div className="manifesto-copy">
          <p>我不把 AI 当作一个孤立功能。</p>
          <h2>我更关心它如何进入业务流程，如何被人使用，以及结果能否被验证。</h2>
          <div className="manifesto-note">
            <span>MY WORKING FORMULA</span>
            <strong>业务理解 × AI 应用 × 前端体验 × 内容表达</strong>
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading section-shell" data-reveal>
          <div>
            <span className="section-index">01 / SELECTED WORK</span>
            <h2>不是功能清单，<br />而是问题如何被解决。</h2>
          </div>
          <p>每个案例都尽量回答四件事：为什么做、怎么拆、如何实现、怎样验证。</p>
        </div>

        <article className="featured-case section-shell" data-reveal>
          <div className="case-visual-wrap">
            <div className="case-visual-label"><span>FEATURED CASE</span><b>01</b></div>
            <div className="ecom-window">
              <div className="window-bar">
                <div><i /><i /><i /></div><span>ecomlens / insight-workbench</span><b>LIVE DEMO</b>
              </div>
              <div className="ecom-body">
                <aside className="mini-sidebar">
                  <strong>ECOM<span>LENS</span></strong>
                  <div className="mini-nav active"><i />数据概览</div>
                  <div className="mini-nav"><i />评论分析</div>
                  <div className="mini-nav"><i />行动建议</div>
                  <div className="mini-nav"><i />Listing 优化</div>
                  <div className="mini-side-foot">AI ENGINE<br/><b>READY</b></div>
                </aside>
                <div className="mini-dashboard">
                  <div className="mini-dashboard-head">
                    <div><small>经营洞察工作台</small><h3>评论分析总览</h3></div>
                    <button type="button">导出报告 ↗</button>
                  </div>
                  <div className="metric-row">
                    <div><small>有效评论</small><strong>62,711</strong><em>99.9%</em></div>
                    <div><small>分析样本</small><strong>200</strong><em>STRATIFIED</em></div>
                    <div><small>核心痛点</small><strong>08</strong><em>ACTIONABLE</em></div>
                  </div>
                  <div className="dashboard-grid">
                    <div className="chart-card">
                      <div className="card-title"><span>痛点优先级</span><small>FREQUENCY × NEGATIVE</small></div>
                      <div className="chart-bars">
                        {[78, 58, 91, 44, 68, 53, 82, 64].map((height, index) => (
                          <i key={index} style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />
                        ))}
                      </div>
                      <div className="chart-axis"><span>包装</span><span>尺寸</span><span>质量</span><span>物流</span></div>
                    </div>
                    <div className="insight-card">
                      <div className="card-title"><span>建议队列</span><small>TOP 03</small></div>
                      <ol>
                        <li><b>01</b><div>优化尺寸说明<small>减少预期偏差</small></div><em>HIGH</em></li>
                        <li><b>02</b><div>补充材质证据<small>强化购买信心</small></div><em>MID</em></li>
                        <li><b>03</b><div>改写核心卖点<small>回应高频问题</small></div><em>MID</em></li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="draft-overlay"><span>待接入</span> 真实产品录屏</div>
            </div>
          </div>

          <div className="case-story">
            <div className="case-kicker"><span>ECOMLENS AI</span><span>2026 — NOW</span></div>
            <h3>把 6 万条评论，变成可解释的经营行动。</h3>
            <p className="case-lead">一个面向电商团队的评论洞察与 Listing 优化工作台。从原始数据进入，到清洗、分类、证据选择、建议生成和报告导出，完成端到端闭环。</p>
            <dl className="case-facts">
              <div><dt>角色</dt><dd>AI 应用开发 / 产品交付</dd></div>
              <div><dt>技术</dt><dd>React · TypeScript · FastAPI · Python</dd></div>
              <div><dt>验证</dt><dd>62,774 条公开评论 → 62,711 条有效数据</dd></div>
            </dl>
            <div className="problem-block">
              <span>THE PROBLEM</span>
              <p>评论很多，但真正能指导商品页、客服和运营动作的证据分散、整理成本高。</p>
            </div>
            <a className="text-link" href="https://github.com/yshuya530-svg/EcomLens-AI" target="_blank" rel="noreferrer">查看 GitHub <span>↗</span></a>
          </div>
        </article>

        <div className="workflow section-shell" data-reveal>
          <div className="workflow-head"><span>FROM RAW DATA TO ACTION</span><p>端到端工作流</p></div>
          <div className="workflow-track">
            {workflow.map(([number, title, text]) => (
              <div className="workflow-step" key={number}>
                <span>{number}</span><i /><h4>{title}</h4><p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="project-grid section-shell">
          <article className="project-card agent-card" data-reveal>
            <div className="project-card-head"><span>02 / AI AGENT EXPERIENCE</span><b>2026</b></div>
            <div className="agent-preview">
              <div className="agent-side"><i /><i /><i /><i /></div>
              <div className="agent-chat">
                <div className="chat-label">角色边界 · 回复规范 · 长对话稳定性</div>
                <div className="bubble bubble-user">如何把模糊需求拆成一份可执行方案？</div>
                <div className="bubble bubble-ai"><span>01</span><p>先确认目标、使用者与限制条件，再给出最小可验证路径。</p></div>
                <div className="typing"><i/><i/><i/></div>
              </div>
            </div>
            <div className="project-card-copy">
              <h3>AI 对话智能体设计<br/>与前端体验升级</h3>
              <p>落地 2 个垂直场景智能体，完成角色设定、任务边界、Prompt 结构与回复规范，并用真实用户反馈持续迭代。</p>
              <div className="inline-metrics"><div><strong>100K+</strong><span>用户互动</span></div><div><strong>1,000+</strong><span>全平台粉丝</span></div></div>
            </div>
          </article>

          <article className="project-card creator-card" data-reveal>
            <div className="project-card-head"><span>03 / CONTENT & GROWTH</span><b>2026</b></div>
            <div className="creator-visual">
              <div className="poster poster-one"><span>01</span><b>选题不是灵感，<br/>是可复盘的系统。</b><small>CONTENT SYSTEM</small></div>
              <div className="poster poster-two"><span>50%</span><b>爆款率</b><small>赞 ＞ 1000</small></div>
              <div className="poster poster-three"><span>500K+</span><b>单篇最高阅读</b><small>ORGANIC REACH</small></div>
            </div>
            <div className="project-card-copy">
              <h3>从 0 到 1 的内容增长实验</h3>
              <p>建立选题库与周度数据复盘机制，用内容表达验证用户需求；10+ 篇图文获得 1,800+ 粉丝与 5 万+ 总赞。</p>
              <a className="text-link" href="https://xhslink.cn/m/9hssfZ5jmAY" target="_blank" rel="noreferrer">查看账号主页 <span>↗</span></a>
            </div>
          </article>
        </div>

        <article className="research-strip section-shell" data-reveal>
          <div className="research-number">04</div>
          <div><span>DATA RESEARCH / GRADUATION THESIS</span><h3>电商用户购买意图识别与转化预测</h3></div>
          <p>基于百万级用户行为日志完成数据清洗、特征工程、预测与高/中/低用户分层。</p>
          <div className="research-tags"><span>PYTHON</span><span>LOGISTIC REGRESSION</span><span>USER SEGMENTATION</span></div>
        </article>
      </section>

      <section className="capabilities" id="capabilities">
        <div className="section-shell">
          <div className="section-heading light" data-reveal>
            <div><span className="section-index">02 / CAPABILITIES</span><h2>我如何把一件事<br/>从想法推进到交付。</h2></div>
            <p>不是“什么都会”，而是能把不同能力串成一条完整路径。</p>
          </div>
          <div className="capability-list">
            {capabilityGroups.map((item) => (
              <article className="capability-row" key={item.number} data-reveal>
                <span className="capability-number">{item.number}</span>
                <div><small>{item.en}</small><h3>{item.title}</h3></div>
                <p>{item.copy}</p>
                <div className="capability-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="about-intro" data-reveal>
          <span className="section-index">03 / EXPERIENCE & MINDSET</span>
          <h2>跨过业务、内容与技术，<br/>是我的路径，也是我的优势。</h2>
        </div>
        <div className="about-grid">
          <div className="profile-card" data-reveal>
            <div className="profile-monogram"><span>杨</span><small>SHUYA<br/>YANG</small></div>
            <p>电子商务专业 2026 届本科生。我的技术学习从具体业务问题出发：先做出能用的版本，再用数据和反馈把它做得更可靠、更清楚。</p>
            <div className="profile-meta"><span>杭州 / 深圳 / 广州</span><span>可随时到岗</span></div>
          </div>
          <div className="timeline" data-reveal>
            <div className="timeline-item"><time>2026.08 — NOW</time><div><h3>EcomLens AI</h3><p>AI 应用开发 / 产品交付</p></div></div>
            <div className="timeline-item"><time>2026.01 — 03</time><div><h3>玉林新世纪高级中学</h3><p>校办品宣部实习生 · AI 内容流程优化</p></div></div>
            <div className="timeline-item"><time>2025.01 — 03</time><div><h3>微视河南融媒中心</h3><p>新媒体实习生 · 多平台内容分发与现场交付</p></div></div>
            <div className="timeline-item"><time>2022.09 — 2026.06</time><div><h3>天津商业大学</h3><p>电子商务本科 · 国际班</p></div></div>
          </div>
        </div>
      </section>

      <section className="asset-brief" id="assets">
        <div className="section-shell">
          <div className="asset-heading" data-reveal>
            <div><span className="section-index">DRAFT / MATERIAL CHECKLIST</span><h2>下一步，只差这些<br/>真实素材。</h2></div>
            <p>这一段仅用于首版共创，正式发布前会移除。优先提供原图或原视频，不要截图转发后的压缩版本；后台图请先遮住账号、订单、Cookie 等敏感信息。</p>
          </div>
          <div className="asset-list">
            {assetItems.map(([title, text], index) => (
              <div className="asset-row" key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><i>待提供</i></div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-main section-shell">
          <p className="eyebrow"><span /> LET&apos;S BUILD SOMETHING USEFUL</p>
          <h2>如果你正在寻找一个<br/><span>懂业务、能落地</span>的 AI 应用新人。</h2>
          <a className="footer-email" href="mailto:15669517568@163.com">15669517568@163.com <span>↗</span></a>
        </div>
        <div className="footer-bottom section-shell"><span>杨舒雅 © 2026</span><span>DESIGNED WITH INTENT · BUILT FOR DELIVERY</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
