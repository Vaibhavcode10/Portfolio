import usePointerDepth from '../Component/usePointerDepth';

const features = [
  ['01', 'Encrypted questions', 'Encrypted storage for exam questions.'],
  ['02', 'Scheduled access', 'Controlled access to scheduled exam papers.'],
  ['03', 'Audit records', 'Blockchain-based records for auditing.'],
];

export default function AntiPaperLeak() {
  const artRef = usePointerDepth(6);
  return (
    <article className="anti-paper-project" aria-labelledby="anti-paper-title">
      <div className="anti-paper-hero">
        <div className="anti-paper-intro">
          <p className="kicker">01 / FEATURED PROJECT · WEB APPLICATION</p>
          <h3 id="anti-paper-title">Anti<br /><em>Paper Leak.</em></h3>
          <p>A web app for creating and managing exam papers, with encrypted question storage, controlled access to scheduled papers, and blockchain-based audit records.</p>
          <div className="tags" aria-label="Technology stack">
            {['React', 'Node.js', 'Supabase', 'Solidity', 'Hardhat'].map(tech => <span key={tech}>{tech}</span>)}
          </div>
        </div>
        <div className="exam-art" ref={artRef}>
          <div className="exam-grid" aria-hidden="true" />
          <div className="exam-paper-stack" aria-hidden="true">
            <div className="exam-paper-back" />
            <div className="exam-paper">
              <div className="exam-paper-top"><span>APL / EXAM PAPER</span><span>◈</span></div>
              <div className="exam-paper-lines"><i /><i /><i /><i /><i /></div>
              <div className="exam-lock">
                <svg viewBox="0 0 48 48" fill="none"><path d="M15 21v-7a9 9 0 0 1 18 0v7" stroke="currentColor" strokeWidth="2"/><rect x="9" y="21" width="30" height="23" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M24 29v7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
              <span className="exam-paper-caption">QUESTIONS / ACCESS / AUDIT</span>
            </div>
            <div className="exam-audit-blocks"><span>◈</span><i /><span>◈</span><i /><span>◈</span></div>
          </div>
          <p className="exam-art-caption">PROJECT CONCEPT ILLUSTRATION</p>
        </div>
      </div>
      <div className="exam-features">
        {features.map(([number, title, description]) => <div key={number}>
          <span>{number} /</span><h4>{title}</h4><p>{description}</p>
        </div>)}
      </div>
    </article>
  );
}
