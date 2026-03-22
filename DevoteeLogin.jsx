import { useState, useEffect, useRef } from "react";

// ── Demo Devotees ─────────────────────────────────────────────────────────
const DEVOTEES = {
  "aham_brahmasmi": { name: "Seeker", role: "devotee", yoga: "Jñānayoga" },
  "tat_tvam_asi": { name: "Traveller", role: "devotee", yoga: "Bhaktiyoga" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Share+Tech+Mono&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#010104;overflow:hidden;-webkit-font-smoothing:antialiased}

/* Keyframes */
@keyframes etherealBreathe {
  0%, 100% { transform: scale(1); opacity: 0.15; filter: blur(12px); }
  50% { transform: scale(1.1); opacity: 0.35; filter: blur(8px); }
}
@keyframes ringSpin {
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes ringSpinRev {
  100% { transform: translate(-50%, -50%) rotate(-360deg); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
@keyframes fadeInGate {
  from { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes inputGlow {
  0%, 100% { border-color: rgba(212, 160, 23, 0.2); box-shadow: 0 0 10px rgba(212, 160, 23, 0); }
  50% { border-color: rgba(212, 160, 23, 0.6); box-shadow: 0 0 20px rgba(212, 160, 23, 0.15); }
}
@keyframes shakeGate {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.devotee-root {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(circle at center, #0a0a16 0%, #010104 100%);
  color: #F0E8D0;
  font-family: 'EB Garamond', serif;
}

/* Background Atmosphere */
.gate-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vh;
  height: 80vh;
  border-radius: 50%;
  background: radial-gradient(circle, #D4A017 0%, transparent 60%);
  animation: etherealBreathe 12s ease-in-out infinite;
  pointer-events: none;
  mix-blend-mode: screen;
}
.gate-ring-1 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 65vh;
  height: 65vh;
  border-radius: 50%;
  border: 1px solid rgba(212, 160, 23, 0.08);
  animation: ringSpin 60s linear infinite;
  pointer-events: none;
}
.gate-ring-2 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50vh;
  height: 50vh;
  border-radius: 50%;
  border: 1px dashed rgba(232, 101, 10, 0.12);
  animation: ringSpinRev 45s linear infinite;
  pointer-events: none;
}

/* Foreground Form */
.devotee-sanctum {
  position: relative;
  z-index: 10;
  text-align: center;
  animation: fadeInGate 1.5s cubic-bezier(0.23, 1, 0.32, 1) both;
  width: min(90vw, 420px);
}

.om-symbol {
  font-family: 'Tiro Devanagari Hindi', serif;
  font-size: clamp(4rem, 12vw, 6rem);
  color: #D4A017;
  text-shadow: 0 0 30px rgba(212, 160, 23, 0.4), 0 0 60px rgba(232, 101, 10, 0.2);
  margin-bottom: 2rem;
  animation: float 6s ease-in-out infinite;
  user-select: none;
}

.sanctum-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #F0E8D0;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.sanctum-subtitle {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.4em;
  color: #A07A0A;
  text-transform: uppercase;
  margin-bottom: 3rem;
  opacity: 0.8;
}

.sacred-input-wrap {
  position: relative;
  margin-bottom: 2rem;
}

.sacred-input {
  width: 100%;
  background: rgba(3, 3, 15, 0.6);
  border: 1px solid rgba(212, 160, 23, 0.2);
  color: #D4A017;
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  letter-spacing: 0.2em;
  text-align: center;
  padding: 1.2rem;
  outline: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.4s ease;
  border-radius: 2px;
}

.sacred-input:focus {
  animation: inputGlow 3s ease-in-out infinite;
  border-color: rgba(212, 160, 23, 0.6);
  background: rgba(10, 10, 22, 0.8);
}

.sacred-input::placeholder {
  color: #6A6458;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 10px;
}

.enter-btn {
  width: 100%;
  background: transparent;
  border: 1px solid #A07A0A;
  color: #F0E8D0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.enter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(212, 160, 23, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.enter-btn:hover {
  background: rgba(212, 160, 23, 0.1);
  border-color: #D4A017;
  color: #D4A017;
  box-shadow: 0 0 20px rgba(212, 160, 23, 0.15);
}

.enter-btn:hover::before {
  transform: translateX(100%);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: #CC5577;
  text-transform: uppercase;
  margin-top: 1rem;
  text-shadow: 0 0 10px rgba(204, 85, 119, 0.4);
}

.back-link {
  display: inline-block;
  margin-top: 2.5rem;
  background: transparent;
  border: none;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: #6A6458;
  cursor: pointer;
  text-transform: uppercase;
  transition: color 0.3s ease;
  text-decoration: none;
}

.back-link:hover {
  color: #A07A0A;
}

/* Ambient Particles */
.particle {
  position: absolute;
  border-radius: 50%;
  background: #D4A017;
  pointer-events: none;
  animation: floatUp 15s linear infinite;
}

@keyframes floatUp {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-20vh) scale(1); opacity: 0; }
}
`;

function Particles() {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const p = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 10 + 10}s`,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(p);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size} rgba(212, 160, 23, 0.8)`
          }}
        />
      ))}
    </div>
  );
}

const I18N = {
  en: {
    title: "The Inner Sanctum",
    subtitle: "Seeker's Threshold",
    placeholder: "Speak the Phrase",
    enterBtn: "Enter the Field",
    loadingBtn: "Awakening...",
    errorMsg: "The gate remains closed. Intent unrecognized.",
    whispers: "Whispers of the ancients",
    returnBtn: "← Return to Public Site",
    lang: "Language"
  },
  ta: {
    title: "உள் மண்டபம்",
    subtitle: "சாதகனின் வாசல்",
    placeholder: "மந்திரத்தை கூறுங்கள்",
    enterBtn: "மண்டபத்திற்குள் நுழையவும்",
    loadingBtn: "விழிப்படைகிறது...",
    errorMsg: "கதவு மூடியுள்ளது. உங்கள் எண்ணம் புரியவில்லை.",
    whispers: "முன்னோர்களின் ரகசியங்கள்",
    returnBtn: "← பொது தளத்திற்குத் திரும்பு",
    lang: "மொழி"
  },
  sa: {
    title: "अन्तर्गेहम्",
    subtitle: "साधकस्य द्वारम्",
    placeholder: "मन्त्रं वदतु",
    enterBtn: "क्षेत्रे प्रविशतु",
    loadingBtn: "जागरणं भवति...",
    errorMsg: "द्वारं पिहितम् अस्ति। आशयः अज्ञातोऽस्ति।",
    whispers: "पूर्वजानां मन्त्रणा",
    returnBtn: "← सार्वजनिकस्थले प्रत्यागच्छतु",
    lang: "भाषा"
  }
};

export default function DevoteeLogin({ onLogin, onGoPublic }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("jnana_devotee_lang") || "en");

  useEffect(() => {
    localStorage.setItem("jnana_devotee_lang", lang);
  }, [lang]);

  const t = I18N[lang] || I18N.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const cleanCode = code.trim().toLowerCase();
      const user = DEVOTEES[cleanCode];

      if (user) {
        onLogin({ ...user, username: cleanCode });
      } else {
        setError(t.errorMsg);
        setShake(true);
        setLoading(false);
        setTimeout(() => setShake(false), 600);
      }
    }, 1200); // Mystical pause
  };

  return (
    <div className="devotee-root">
      <style>{CSS}</style>
      
      {/* Background Ambience */}
      <div className="gate-aura" />
      <div className="gate-ring-1" />
      <div className="gate-ring-2" />
      <Particles />

      {/* Language Toggle */}
      <div style={{ position: "fixed", top: "2rem", right: "2.5rem", zIndex: 100, display: "flex", gap: "0.5rem" }}>
        {["en", "ta", "sa"].map(l => (
          <button 
            key={l}
            onClick={() => setLang(l)}
            style={{ 
              background: lang === l ? "rgba(212,160,23,0.2)" : "transparent",
              border: `1px solid ${lang === l ? "#D4A017" : "#A07A0A88"}`,
              color: lang === l ? "#D4A017" : "#A07A0A",
              padding: "0.4rem 0.8rem",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div 
        className="devotee-sanctum" 
        style={{ animation: shake ? "shakeGate 0.5s ease" : "fadeInGate 1.5s cubic-bezier(0.23, 1, 0.32, 1) both" }}
      >
        <div className="om-symbol">ॐ</div>
        
        <div className="sanctum-title">{t.title}</div>
        <div className="sanctum-subtitle">{t.subtitle}</div>

        <form onSubmit={handleSubmit}>
          <div className="sacred-input-wrap">
            <input
              type="password"
              className="sacred-input"
              placeholder={t.placeholder}
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
              autoComplete="off"
              spellCheck="false"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`enter-btn ${loading ? 'btn-disabled' : ''}`}
            disabled={loading}
          >
            {loading ? t.loadingBtn : t.enterBtn}
          </button>

          {error && <div className="error-text">❈ {error} ❈</div>}
        </form>

        <div style={{ marginTop: "2rem", opacity: 0.4 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "7px", letterSpacing: "0.2em", color: "#F0E8D0", textTransform: "uppercase" }}>{t.whispers}</div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8px", color: "#D4A017", marginTop: "0.5rem" }}>
            "aham_brahmasmi" or "tat_tvam_asi"
          </div>
        </div>

        <button onClick={onGoPublic} className="back-link">
          {t.returnBtn}
        </button>
      </div>
    </div>
  );
}
