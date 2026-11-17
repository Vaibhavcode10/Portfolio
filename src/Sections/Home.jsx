import profileImage from '../assets/Profile.png';
import usePointerDepth from '../Component/usePointerDepth';

const Home = () => {
  const heroRef = usePointerDepth(0);
  const portraitRef = usePointerDepth(14);
  return (
    <section ref={heroRef} id="home" className="hero-section">
      <div className="hero-code" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} style={{ '--column': index }}>
            {'REACT / CREATE / DESIGN / BUILD / '.repeat(4)}
          </span>
        ))}
      </div>
      <div className="hero-copy">
        <p className="hero-eyebrow"><span /> Frontend developer · UI thinker</p>
        <h1>Hi, I'm <span>Vaibhav</span>.<br />I build polished digital experiences.</h1>
        <p className="hero-description">
          I'm a developer focused on modern, elegant and user-friendly web interfaces.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="hero-primary">Contact Me <span aria-hidden="true">↗</span></a>
          <a href="#projects" className="hero-secondary">View Projects <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-caption" aria-hidden="true"><span>01 / Introduction</span><span>Design meets development</span></div>
      </div>
      <div ref={portraitRef} className="hero-visual">
        <div className="portrait-scene">
          <div className="portrait-light" aria-hidden="true" />
          <img className="hero-portrait" src={profileImage} alt="Vaibhav" fetchPriority="high" />
          <div className="portrait-tag"><span /> Available for work</div>
        </div>
        <p className="portrait-caption" aria-hidden="true">Creative thinking. Precise execution.</p>
      </div>
    </section>
  );
};

export default Home;
