import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Reveal from '../Component/Reveal';
import usePointerDepth from '../Component/usePointerDepth';
import portrait from '../assets/Profile.png';
import AntiPaperLeak from './AntiPaperLeak';
import './studio.css';
import './electric.css';
import './education.css';

const Sculpture = lazy(() => import('./Sculpture'));
const Arrow = () => <span aria-hidden="true">↗</span>;

function Nav({ paused, setPaused }) {
  const [open, setOpen] = useState(false);
  return <header className="studio-nav" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);e.currentTarget.querySelector('.menu-toggle')?.focus();}}}><a className="wordmark" href="#home" aria-label="Vaibhav home">v<span>／</span></a>
    <nav id="studio-navigation" aria-label="Main navigation" className={open ? 'is-open' : ''}>
      {['Work', 'Expertise', 'About', 'Contact'].map((name, i) => <a key={name} href={`#${name.toLowerCase()}`} onClick={() => setOpen(false)}><small>0{i+1}</small>{name}</a>)}
    </nav><div className="nav-actions"><button className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play motion' : 'Pause motion'}</button><button className="menu-toggle" aria-expanded={open} aria-controls="studio-navigation" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button><a className="nav-contact" href="#contact">Let’s talk <Arrow /></a></div>
  </header>;
}

function Hero() {
  const portraitRef = usePointerDepth(7);
  return <section id="home" className="studio-hero">
    <div className="hero-topline"><span><i className="status-light" /> AVAILABLE FOR OPPORTUNITIES</span><span>FRONTEND DEVELOPER / CREATIVE THINKER</span></div>
    <div className="studio-hero-grid"><div className="studio-hero-copy"><p className="kicker">HELLO, I’M VAIBHAV</p><h1>Code with<br /><em>character.</em></h1><p className="hero-intro">I turn complex ideas into expressive,<br className="desktop-break" /> intuitive digital experiences.</p><a className="pill primary" href="#work">Explore my work <Arrow /></a><div className="hero-footnote"><span className="tiny-cross">✳</span><span>ENGINEERING THE DETAILS.<br />DESIGNING THE FEELING.</span></div></div>
    <div className="home-portrait" ref={portraitRef}>
      <div className="home-portrait-backdrop" aria-hidden="true" />
      <div className="home-portrait-frame">
       
        <img src={portrait} alt="Vaibhav, frontend developer" fetchPriority="high" />
        <div className="home-portrait-label"><span><i className="status-light" /> THE PERSON BEHIND THE PIXELS</span><strong>Hi, I’m Vaibhav. <Arrow /></strong></div>
      </div>
    </div></div>
    <div className="hero-bottom"><a href="#work">SCROLL TO DISCOVER <span>↓</span></a><span>THOUGHTFUL INTERFACES. A LITTLE UNEXPECTED.</span><span>PORTFOLIO — {new Date().getFullYear()}</span></div>
  </section>;
}

function SectionTitle({ number, label, children, note }) {
  return <div className="section-title"><div><p className="kicker"><span>{number} /</span> {label}</p><h2>{children}</h2></div>{note && <p>{note}</p>}</div>;
}

function ModelCard({ variant, paused, title, caption, number }) {
  const [expanded, setExpanded] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [ready, setReady] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <article className={`model-card model-${variant}`} ref={ref}>
    <div className="model-card-heading"><span>OBJECT / {number}</span><span>LIVE 3D</span></div>
    <div className="model-viewport" role="img" aria-label={caption}>
      <div className="model-horizon" aria-hidden="true" />
      {ready && <Suspense fallback={<div className="scene-loading">SHAPING THE UNEXPECTED</div>}><Sculpture variant={variant} paused={paused} exploded={expanded} rotation={rotation} /></Suspense>}
    </div>
    <div className="model-info"><div><h3>{title}</h3><p>{caption}</p></div><button className="model-action" onClick={() => setExpanded(!expanded)} aria-pressed={expanded}>{expanded ? 'Reform' : variant === 'bloom' ? 'Bloom' : 'Expand'} <span aria-hidden="true">↗</span></button></div>
    <label className="model-rotation"><span>ROTATE</span><input aria-label={`Rotate ${title}`} type="range" min="0" max="360" value={rotation} onChange={e => setRotation(Number(e.target.value))} /><output>{rotation}°</output></label>
  </article>;
}

function Playground({ paused }) {
  return <section id="playground" className="studio-section playground-section">
    <Reveal><SectionTitle number="↳" label="THE PLAYGROUND" note="A small experiment in form, light, and interaction. Move your cursor. Change the shape. Make it your own.">A little less<br /><em>ordinary.</em></SectionTitle></Reveal>
    <div className="model-gallery">
      <ModelCard variant="tower" number="01" paused={paused} title="Twisting tower" caption="Layers of color. A form in motion." />
      <ModelCard variant="reactor" number="02" paused={paused} title="Orbital engine" caption="Three kinetic rings. One electric core." />
      <ModelCard variant="bloom" number="03" paused={paused} title="Prism bloom" caption="A crystalline form, ready to unfold." />
    </div>
  </section>;
}

function DesktopPreview() {
  const [tab, setTab] = useState('Overview');
  return <div className="desktop-preview"><div className="desktop-toolbar"><span>◈ OS_UI</span><span>Workspace / Personal</span><span>● ● ●</span></div><div className="desktop-body"><aside>{['Overview','Files','Terminal'].map(t => <button className={tab===t?'selected':''} key={t} onClick={()=>setTab(t)}>{t==='Overview'?'◫':t==='Files'?'▱':'›_'} {t}</button>)}</aside><div className="desktop-content">{tab==='Overview'?<><span className="micro-label">YOUR SPACE TO BUILD</span><h3>A little order.<br />A lot of possibility.</h3><div className="widget-grid"><div><span>Workspace</span><strong>Make it yours.</strong><div className="wave-bars">{Array.from({length:18},(_,i)=><i key={i} style={{'--i':i}} />)}</div></div><div className="violet-widget"><span>Quick launch</span><strong>↗</strong><small>Ideas → interfaces</small></div></div></>:tab==='Files'?<><span className="micro-label">WORKSPACE / FILES</span><h3>Everything in place.</h3>{['Projects','Design explorations','Notes & ideas'].map((f,i)=><div className="file-row" key={f}><span>▱ {f}</span><small>0{i+1}</small></div>)}</>:<div className="terminal"><p>vaibhav@workspace ~</p><p>$ hello world</p><p className="mint">Welcome to OS_UI.</p><p>A familiar workspace for developer workflows.</p><span className="terminal-caret">▌</span></div>}</div></div><div className="desktop-dock" aria-hidden="true"><span>◈</span><span>▱</span><span>⌘</span><span>›_</span></div></div>;
}

function Work() {
  const ref = usePointerDepth(5);
  const [details, setDetails] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="work" className="studio-section">
      <Reveal>
        <SectionTitle number="01" label="SELECTED WORK" note="An idea becomes meaningful when you can interact with it.">
          Built to be <em>used.</em><br />Designed to be felt.
        </SectionTitle>
      </Reveal>
      <Reveal>
        <div className="project-marker"><span># PROJECT 01</span><strong>ANTI PAPER LEAK</strong></div>
        <AntiPaperLeak />
      </Reveal>
      <Reveal>
        <div className="project-marker"><span># PROJECT 02</span><strong>OS_UI</strong></div>
        <article className="featured-work">
          <div className="project-art" ref={ref}>
            <div className="project-grid" />
            <span className="project-art-label">THE DESKTOP, REIMAGINED.</span>
            <DesktopPreview />
            <span className="preview-disclaimer">INTERACTIVE CONCEPT PREVIEW · NOT THE LIVE PRODUCT</span>
          </div>
          <div className="project-meta">
            <div>
              <p className="kicker">02 / WEB APPLICATION · IN DEVELOPMENT</p>
              <h3>OS_UI <span>↗</span></h3>
              <p>A familiar desktop experience for command-line environments.</p>
            </div>
            <button className="circle-button" aria-expanded={details} aria-controls="project-details" onClick={() => setDetails(!details)} aria-label="Read about OS_UI">{details ? '−' : '＋'}</button>
          </div>
          {details && (
            <div id="project-details" className="project-details">
              <div><h4>The idea</h4><p>Make CLI machines easier to navigate through a browser-based desktop shell.</p></div>
              <div><h4>The focus</h4><p>Clear navigation, responsive interfaces, and a workspace shaped around developer workflows.</p></div>
              <div><h4>The toolkit</h4><p>React · JavaScript · Web technologies</p></div>
            </div>
          )}
        </article>
        <div className="more-projects">
          <button
            className="pill primary"
            type="button"
            aria-expanded={showMore}
            aria-controls="more-projects"
            onClick={() => setShowMore(open => !open)}
          >
            {showMore ? 'Show less' : 'More'}
          </button>
          <div id="more-projects" hidden={!showMore}>
            <p>More project details coming soon.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const expertise = [
  { name:'Interface engineering', text:'From a blank canvas to a responsive interface. Components that stay clear as the product grows.', tags:['React','JavaScript','HTML / CSS'], type:'stack' },
  { name:'Design that responds', text:'Purposeful motion, thoughtful hierarchy, and interactions that feel natural in your hands.', tags:['UI design','Figma','Accessibility'], type:'prism' },
  { name:'Built for the real world', text:'A practical foundation, from local development to the details of shipping on the web.', tags:['Vite','Git','Node.js'], type:'cube' },
];
function SkillCard({ skill, index }) {
  const ref = usePointerDepth(9);
  return <article className="expertise-card" ref={ref}><div className={`skill-object ${skill.type}`} aria-hidden="true">{Array.from({length:5},(_,i)=><i key={i} style={{'--i':i}} />)}</div><span className="card-index">0{index+1} /</span><h3>{skill.name}</h3><p>{skill.text}</p><div className="tags">{skill.tags.map(t=><span key={t}>{t}</span>)}</div></article>;
}
function Expertise() {
  return <section id="expertise" className="studio-section"><Reveal><SectionTitle number="02" label="WHAT I BRING" note="Equal parts technical curiosity and attention to the way things feel.">Good design.<br /><em>Solid foundations.</em></SectionTitle></Reveal><div className="expertise-grid">{expertise.map((skill,index)=><Reveal key={skill.name} delay={index*.1}><SkillCard skill={skill} index={index}/></Reveal>)}</div><div className="tool-strip"><span>MY EVERYDAY TOOLKIT</span><div>React <i>✳</i> JavaScript <i>✳</i> Figma <i>✳</i> Vite <i>✳</i> Git</div></div></section>;
}

function About() {
  return <section id="about" className="studio-section about-section"><Reveal><div className="about-layout about-text-only"><div className="about-copy"><p className="kicker">03 / A LITTLE ABOUT ME</p><h2>Curiosity is<br />my <em>default.</em></h2><p className="about-lead">I like understanding how things work.<br />Then making them work beautifully.</p><p>I’m a frontend developer studying Computer Engineering at SPPU. My focus is on React, thoughtful UI systems, and the small details that turn a functional website into a memorable experience.</p><p>Right now, I’m building OS_UI and looking for a team where I can contribute, learn, and keep pushing my craft.</p><a className="text-link" href="#contact">Let’s make something together <Arrow /></a></div></div></Reveal><div className="journey">{[['2022','The first line of code','Programming fundamentals, HTML, CSS, and JavaScript.'],['2023–25','Going deeper','React, the MERN stack, and exploring interface design.'],['NOW','From idea to experience','Building OS_UI, learning deployment, and refining the craft.']].map(([year,title,text],i)=><Reveal key={year} delay={i*.1}><article><span className="journey-dot"/><p className="kicker">{year}</p><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></section>;
}

function Learning() {
  const qualifications = [
    { number: '01', title: 'B.E. in Computer Engineering', place: 'SPPU', status: 'In progress', detail: 'Currently completing my engineering degree while building practical web applications and strengthening my foundation in software development.' },
    { number: '02', title: 'Diploma in Computer Engineering', place: 'Completed', status: 'Completed', detail: 'A completed diploma in computer engineering that established my fundamentals in programming, systems, and web technologies.' },
  ];
  return <section id="education" className="studio-section education-section" aria-labelledby="education-title"><Reveal><div className="education-heading"><div><p className="kicker">04 / ACADEMIC BACKGROUND</p><h2 id="education-title">Education<span>.</span></h2></div><p>My foundation in computer engineering,<br />supported by hands-on work on the web.</p></div></Reveal><div className="qualification-grid">{qualifications.map((item, index) => <Reveal key={item.number} delay={index * .1}><article className={`qualification-card ${index === 0 ? 'current-qualification' : ''}`}><div className="qualification-top"><span>{item.number} / QUALIFICATION</span><span className="qualification-status">{item.status}</span></div><h3>{item.title}</h3><p className="qualification-place">{item.place}</p><p className="qualification-detail">{item.detail}</p><div className="qualification-rule" /><p className="qualification-note">COMPUTER ENGINEERING</p></article></Reveal>)}</div><Reveal><div className="education-practice"><span>CONTINUING OUTSIDE CLASS</span><p>I continue to learn through web interfaces, interaction design, developer tooling, and the projects I build.</p></div></Reveal></section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  async function copyBrief() {
    try { await navigator.clipboard.writeText(message); setCopied(true); }
    catch { setCopied(false); }
  }
  return <section id="contact" className="studio-section contact-section"><div className="contact-glow" aria-hidden="true"/><Reveal><p className="kicker"><i className="status-light" /> OPEN TO THE RIGHT OPPORTUNITY</p><h2>Have something<br />in <em>mind?</em><span className="contact-star" aria-hidden="true">✳</span></h2><div className="contact-bottom"><div><p>A role, a collaboration, or an idea<br />that deserves to exist.</p><a className="contact-email" href="mailto:vaibhavhoke.dev@gmail.com">vaibhavhoke.dev@gmail.com <Arrow /></a></div><div className="contact-note"><label htmlFor="brief">Tell me what you’re thinking</label><textarea id="brief" value={message} onChange={e=>{setMessage(e.target.value);setCopied(false);}} placeholder="I’m thinking about building…" rows={3}/><div className="contact-buttons"><a className="pill primary" href={`mailto:vaibhavhoke.dev@gmail.com?subject=${encodeURIComponent('Let’s build something together')}&body=${encodeURIComponent(message)}`}>Let’s talk <Arrow /></a><button className="copy-note" onClick={copyBrief} disabled={!message.trim()}>{copied?'Copied ✓':'Copy note'}</button></div><small>Opens your email app with your note ready to send.</small><span role="status" className="sr-only">{copied?'Your note was copied.':''}</span></div></div></Reveal></section>;
}

function ManifestoBand() {
  return (
    <div className="manifesto-band">
      <p className="sr-only">Think deeply. Build thoughtfully. Make it matter.</p>
      <div className="manifesto-track" aria-hidden="true">
        {[0, 1].map(group => (
          <div className="manifesto-group" key={group}>
            {[0, 1, 2].map(copy => (
              <span key={copy}>THINK DEEPLY <b>✳</b> BUILD THOUGHTFULLY <b>✳</b> MAKE IT MATTER <b>✳</b></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [paused, setPaused] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    let frame;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight; root.current?.style.setProperty('--progress',max>0?scrollY/max:0);}); };
    addEventListener('scroll',update,{passive:true}); update();
    return ()=>{removeEventListener('scroll',update);cancelAnimationFrame(frame);};
  }, []);
  return <div className={`studio ${paused?'motion-paused':''}`} ref={root}><a href="#main" className="skip-link">Skip to content</a><div className="reading-progress"/><Nav paused={paused} setPaused={setPaused}/><main id="main"><Hero/><ManifestoBand/><Work/><Playground paused={paused}/><Expertise/><About/><Learning/><Contact/></main><footer className="studio-footer"><a href="#home" className="footer-name">VAIBHAV<span>↗</span></a><div><span>© {new Date().getFullYear()} Vaibhav</span><span>DESIGNED WITH INTENT. BUILT WITH REACT.</span><a href="#home">BACK TO TOP ↑</a></div></footer></div>;
}
