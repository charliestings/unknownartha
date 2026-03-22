import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import * as THREE from "three";

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Share+Tech+Mono&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{background:#000000;color:#F0E8D0;-webkit-font-smoothing:antialiased}

/* Keyframes */
@keyframes ambientGlow{0%,100%{opacity:.1}50%{opacity:.25}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes slideUpFade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes ringSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}

.dash-root{min-height:100dvh;overflow-x:hidden;font-family:'EB Garamond',serif;position:relative}

/* Ambient canvas behind everything */
.dash-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(circle at 50% 10%,#110804 0%,#000000 70%)}

/* Top bar */
.dash-header{position:fixed;top:0;left:0;right:0;padding:1.5rem 2.5rem;display:flex;justify-content:space-between;align-items:center;z-index:100;background:linear-gradient(to bottom,rgba(0,0,0,.9),transparent)}
.dash-brand{display:flex;align-items:center;gap:.6rem;text-decoration:none}
.dash-nav-btn{font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;padding:.6rem 1.2rem;background:transparent;border:1px solid #D4A01744;color:#D4A017;cursor:pointer;transition:all .3s;}
.dash-nav-btn:hover{background:rgba(212,160,23,.1);border-color:#D4A017}

/* Layout */
.dash-content{position:relative;z-index:10;padding:8rem 2rem 4rem;max-width:1200px;margin:0 auto}

.welcome-sec{text-align:center;margin-bottom:6rem;animation:slideUpFade 1.2s cubic-bezier(.23,1,.32,1) both}
.greeting{font-family:'Cinzel Decorative',serif;font-size:clamp(2rem,6vw,3.5rem);font-weight:700;color:#F0E8D0;letter-spacing:.08em;margin-bottom:.5rem;text-shadow:0 0 20px rgba(212,160,23,.2)}
.sub-greeting{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:#D4A017;opacity:.8}

/* Chambers Grid */
.chambers-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2.5rem;animation:slideUpFade 1.2s cubic-bezier(.23,1,.32,1) .2s both}

.chamber-card{border:1px solid rgba(212,160,23,.15);background:rgba(10,5,0,.6);backdrop-filter:blur(10px);padding:2.5rem;position:relative;overflow:hidden;transition:all .4s;cursor:pointer}
.chamber-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,160,23,.05),transparent 60%);opacity:0;transition:opacity .4s}
.chamber-card:hover{border-color:rgba(212,160,23,.4);transform:translateY(-8px);box-shadow:0 12px 30px rgba(0,0,0,.5),0 0 20px rgba(212,160,23,.1)}
.chamber-card:hover::before{opacity:1}

.chamber-icon{font-size:3rem;margin-bottom:1.5rem;display:inline-block;animation:floatY 4s ease-in-out infinite}
.chamber-title{font-family:'Cinzel Decorative',serif;font-size:1.3rem;color:#F0E8D0;margin-bottom:.8rem;letter-spacing:.05em}
.chamber-desc{font-size:1rem;color:#A0988A;line-height:1.7}

.devotee-stats{margin-top:5rem;border-top:1px solid #1A1610;padding-top:3rem;display:flex;justify-content:center;gap:4rem;flex-wrap:wrap;animation:slideUpFade 1.2s cubic-bezier(.23,1,.32,1) .4s both}
.stat-item{text-align:center}
.stat-lbl{font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:.25em;text-transform:uppercase;color:#6A6458}

/* Library View */
.lib-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:3rem;animation:slideUpFade 1s both}
.lib-title{font-family:'Cinzel Decorative',serif;font-size:2.2rem;color:#F0E8D0;margin-bottom:.5rem}
.lib-sub{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.3em;color:#A0988A;text-transform:uppercase}
.lib-back{background:transparent;border:1px solid rgba(212,160,23,.3);color:#D4A017;padding:.6rem 1.2rem;font-family:'Share Tech Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:.2em;cursor:pointer;transition:all .3s}
.lib-back:hover{background:rgba(212,160,23,.1);border-color:#D4A017}

.lib-grid{display:grid;grid-template-columns:1fr;gap:1.5rem}
.essay-card{display:flex;justify-content:space-between;align-items:center;padding:1.8rem 2.2rem;border:1px solid rgba(160,122,10,.2);background:rgba(6,3,0,.7);backdrop-filter:blur(10px);cursor:pointer;transition:all .3s ease;animation:slideUpFade .8s both}
.essay-card:hover{border-color:#D4A017;background:rgba(15,10,0,.8);transform:translateX(8px)}
.essay-title{font-family:'EB Garamond',serif;font-size:1.4rem;color:#F0E8D0;margin-bottom:.4rem}
.essay-meta{display:flex;gap:1.5rem;font-family:'Share Tech Mono',monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.15em;color:#A0988A}
.essay-meta span{color:#D4A017}

/* Coming Soon Overlay */
.overlay-msg{text-align:center;padding:5rem 2rem;animation:slideUpFade 1s both}
.overlay-msg h2{font-family:'Cinzel Decorative',serif;font-size:2rem;color:#D4A017;margin-bottom:1rem}
.overlay-msg p{font-size:1.1rem;color:#A0988A;max-width:500px;margin:0 auto 3rem}

/* Markdown Context */
/* Markdown Context */
.md-content { font-family: 'EB Garamond', serif; font-size: 1.35rem; color: #E8E2D2; line-height: 2; }
.md-content h1, .md-content h2, .md-content h3 { font-family: 'Cinzel Decorative', serif; color: #D4A017; margin-top: 3.5rem; margin-bottom: 1.5rem; line-height: 1.3; font-weight: 700; text-align: center; letter-spacing: 0.05em; text-shadow: 0 0 20px rgba(212,160,23,0.1); }
.md-content p { margin-bottom: 2.5rem; text-align: justify; text-justify: inter-word; }
.md-content p:first-of-type::first-letter { font-family: 'Cinzel Decorative', serif; font-size: 4.8rem; color: #E8650A; float: left; margin-right: 1.2rem; line-height: 1; text-shadow: 0 0 20px rgba(232,101,10,0.5); }
.md-content strong { color: #F0E8D0; font-weight: 600; text-shadow: 0 0 8px rgba(240,232,208,0.2); }
.md-content em { color: #A0988A; font-style: italic; letter-spacing: 0.05em; }
.md-content blockquote { border-left: 3px solid rgba(212,160,23,0.5); margin: 3rem 0; color: #A0988A; font-style: italic; background: linear-gradient(90deg, rgba(212,160,23,0.08), transparent); padding: 1.5rem 2.5rem; }
.md-content blockquote p { text-align: left; }
.md-content blockquote p:first-of-type::first-letter { font-family: 'EB Garamond', serif; font-size: 1.35rem; color: #A0988A; float: none; margin: 0; text-shadow: none; }
.md-content ul, .md-content ol { padding-left: 2rem; margin-bottom: 2.5rem; line-height: 1.8; color: #C8BEA0; }
.md-content li { margin-bottom: 0.5rem; }
.md-content a { color: #E8650A; text-decoration: none; border-bottom: 1px dotted rgba(232,101,10,0.5); transition: all 0.3s; }
.md-content a:hover { color: #D4A017; border-bottom-color: #D4A017; text-shadow: 0 0 10px rgba(212,160,23,0.4); }
.md-content img { max-width: 100%; height: auto; border: 1px solid rgba(212,160,23,0.3); border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,160,23,0.1); margin: 2.5rem auto; display: block; }

/* Satsang View */
.satsang-container { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; animation: slideUpFade 1s both; min-height: 65vh; }
@media(max-width: 900px) { .satsang-container { grid-template-columns: 1fr; } }
.satsang-main { display: flex; flex-direction: column; gap: 1.5rem; }
.satsang-video-wrapper { position: relative; background: rgba(5,2,0,0.8); border: 1px solid rgba(212,160,23,0.2); border-radius: 4px; overflow: hidden; aspect-ratio: 16/9; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 40px rgba(0,0,0,0.8), inset 0 0 40px rgba(212,160,23,0.05); }
.satsang-live-badge { position: absolute; top: 1.5rem; left: 1.5rem; background: rgba(232,101,10,0.1); border: 1px solid rgba(232,101,10,0.5); color: #E8650A; padding: 0.3rem 0.8rem; font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; z-index: 10; }
.satsang-live-dot { width: 6px; height: 6px; background: #E8650A; border-radius: 50%; animation: ambientGlow 1.5s infinite; }
.satsang-topic { background: rgba(10,5,0,0.6); border: 1px solid rgba(212,160,23,0.15); padding: 1.5rem 2rem; backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; }
.satsang-topic-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #D4A017; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.5rem; }
.satsang-topic-title { font-family: 'Cinzel Decorative', serif; font-size: 1.8rem; color: #F0E8D0; }
.satsang-topic-desc { color: #A0988A; margin-top: 0.5rem; font-size: 1.1rem; }
.satsang-chat { background: rgba(10,5,0,0.6); border: 1px solid rgba(212,160,23,0.15); backdrop-filter: blur(10px); display: flex; flex-direction: column; height: 100%; min-height: 400px; }
.satsang-chat-header { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(212,160,23,0.15); font-family: 'Cinzel Decorative', serif; color: #D4A017; font-size: 1.2rem; display: flex; justify-content: space-between; align-items: center; }
.satsang-chat-body { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem; max-height: 55vh; }
.satsang-chat-msg { font-size: 0.95rem; line-height: 1.5; animation: slideUpFade 0.3s both; }
.satsang-chat-author { color: #D4A017; font-family: 'Share Tech Mono', monospace; font-size: 10px; text-transform: uppercase; margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.5rem; }
.satsang-chat-text { color: #C8BEA0; font-family: 'EB Garamond', serif; font-size: 1.1rem; }
.satsang-chat-input-area { padding: 1rem; border-top: 1px solid rgba(212,160,23,0.15); display: flex; gap: 0.5rem; }
.satsang-input { flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(212,160,23,0.3); color: #F0E8D0; padding: 0.8rem 1rem; font-family: 'EB Garamond', serif; font-size: 1.1rem; outline: none; transition: border-color 0.3s; }
.satsang-input:focus { border-color: #D4A017; }
.satsang-send-btn { background: rgba(212,160,23,0.1); border: 1px solid rgba(212,160,23,0.3); color: #D4A017; padding: 0 1.2rem; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 10px; text-transform: uppercase; transition: all 0.3s; }
.satsang-send-btn:hover { background: rgba(212,160,23,0.2); border-color: #D4A017; }
.satsang-chat-body::-webkit-scrollbar { width: 4px; }
.satsang-chat-body::-webkit-scrollbar-track { background: transparent; }
.satsang-chat-body::-webkit-scrollbar-thumb { background: rgba(212,160,23,0.2); border-radius: 2px; }
.satsang-watermark { position: absolute; font-family: 'Tiro Devanagari Hindi', serif; font-size: 12rem; color: rgba(212,160,23,0.03); pointer-events: none; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; animation: ambientGlow 6s infinite; }

/* Dhyana View */
.dhyana-root { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; animation: slideUpFade 1.5s ease-in-out both; position: relative; z-index: 10; padding: 2rem; text-align: center; }
.dhyana-symbol { font-family: 'Tiro Devanagari Hindi', serif; font-size: clamp(6rem, 15vw, 10rem); color: #E8650A; opacity: 0.8; margin-bottom: 2rem; animation: ambientGlow 4s infinite alternate; text-shadow: 0 0 40px rgba(232,101,10,0.4); }
.dhyana-timer { font-family: 'Share Tech Mono', monospace; font-size: clamp(3rem, 8vw, 5rem);  letter-spacing: 0.1em; margin-bottom: 3rem; text-shadow: 0 0 20px rgba(212,160,23,0.2); transition: color 1s; }
.dhyana-controls { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
.dhyana-btn { background: transparent; border: 1px solid rgba(212,160,23,0.3); color: #D4A017; font-family: 'Share Tech Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; padding: 0.8rem 2rem; cursor: pointer; transition: all 0.4s; border-radius: 2px; }
.dhyana-btn:hover:not(:disabled) { background: rgba(212,160,23,0.1); border-color: #D4A017; box-shadow: 0 0 15px rgba(212,160,23,0.2); }
.dhyana-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.dhyana-btn.active { background: rgba(232,101,10,0.1); border-color: #E8650A; color: #E8650A; box-shadow: 0 0 20px rgba(232,101,10,0.3); }
.dhyana-mantra { font-family: 'EB Garamond', serif; font-size: 1.6rem; color: #A0988A; font-style: italic; margin-top: 4rem; max-width: 600px; line-height: 1.6; opacity: 0; animation: slideUpFade 2s 1s forwards; text-shadow: 0 0 10px rgba(160,152,138,0.2); }
.dhyana-preset-wrap { display: flex; gap: 1rem; margin-bottom: 2.5rem; justify-content: center; flex-wrap: wrap; }
.dhyana-preset { font-family: 'Share Tech Mono', monospace; font-size: 9px; padding: 0.5rem 1rem; background: rgba(10,5,0,0.6); border: 1px solid rgba(212,160,23,0.2); color: #A0988A; cursor: pointer; transition: all 0.3s; letter-spacing: 0.15em; }
.dhyana-preset:hover, .dhyana-preset.sel { border-color: #D4A017; color: #D4A017; background: rgba(212,160,23,0.1); }
`;

// ── Three.js Ambient Scene ───────────────────────────────────────────────
function AmbientBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    
    const W = el.clientWidth, H = el.clientHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.04);
    
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    // Particles representing a gentle golden rain or dust
    const pCnt = 600;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCnt * 3);
    for (let i = 0; i < pCnt; i++) {
      pPos[i*3] = (Math.random() - 0.5) * 40;
      pPos[i*3+1] = (Math.random() - 0.5) * 40;
      pPos[i*3+2] = (Math.random() - 0.5) * 20;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    
    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xD4A017,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // A central ambient rotating torus knot faintly in the background
    const knotGeo = new THREE.TorusKnotGeometry(4, 0.2, 100, 16, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0xE8650A,
      wireframe: true,
      transparent: true,
      opacity: 0.03
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      
      particles.rotation.y = t * 0.02;
      particles.position.y = Math.sin(t * 0.2) * 2;
      
      knot.rotation.x = t * 0.1;
      knot.rotation.y = t * 0.15;
      
      renderer.render(scene, camera);
    };
    animate();

    const onR = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onR);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onR);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="dash-canvas" />;
}

const I18N = {
  en: {
    marketplace: "Public Site",
    logout: "Logout",
    welcome: "Welcome to the Inner Sanctum",
    seeker: "Seeker",
    pathOf: "Path of",
    insight: "Insight",
    daysOnPath: "Days on the Path",
    satsangsAttended: "Satsangs Attended",
    versesContemplated: "Verses Contemplated",
    vyasaTitle: "Vyasa's Archives",
    vyasaDesc: "Access the translated texts, study maps, and community commentaries on the Upanishads.",
    satsangTitle: "Satsang Portal",
    satsangDesc: "Join the weekly virtual gathering. The next reading is Katha Upanishad 1.3.4.",
    dhyanaTitle: "Dhyana State",
    dhyanaDesc: "Enter the pure ambient focus mode. A distraction-free environment for contemplation.",
    sanghaTitle: "The Sangha",
    sanghaDesc: "Connect with other seekers, developers, and philosophers on the path.",
    curatedEssays: "Curated Essays & Study Maps",
    returnSanctum: "← Return to Sanctum",
    archivesSilent: "The archives are currently silent. Return later.",
    by: "By",
    date: "Date",
    path: "Path",
    backArchives: "← Back to Archives",
    scrollBlank: "The author left this scroll blank.",
    chamberSealed: "Chamber Sealed",
    chamberMsg: "This chamber is currently enveloped in deep meditation. It will reveal its contents when the time is right. (Feature in development)",
    trReaderLangFallback: "Translation not available. Showing original text.",
    satsangLive: "Live",
    satsangTopicLabel: "Today's Discourse",
    satsangChatTitle: "Sangha Dialogue",
    satsangInputPlaceholder: "Contemplate or question...",
    satsangSend: "Send",
    satsangAmbient: "Waiting for transmission...",
    joinAudio: "Join Audio",
    dhyanaStart: "Begin",
    dhyanaPause: "Pause",
    dhyanaEnd: "Conclude",
    dhyanaMantra1: "When the five senses are stilled, when the mind is stilled... that is the supreme state.",
    dhyanaMantra2: "The Self is hidden in the hearts of all.",
    dhyanaMantra3: "Arise, awake, and stop not till the goal is reached."
  },
  ta: {
    marketplace: "பொது தளம்",
    logout: "வெளியேறு",
    welcome: "உள் மண்டபத்திற்கு வரவேற்கிறோம்",
    seeker: "சாதகன்",
    pathOf: "பாதை",
    insight: "உள்ளுணர்வு",
    daysOnPath: "பயண நாட்கள்",
    satsangsAttended: "கலந்துகொண்ட சத்சங்கங்கள்",
    versesContemplated: "சிந்தித்த ஸ்லோகங்கள்",
    vyasaTitle: "வியாசரின் சுவடிகள்",
    vyasaDesc: "உபநிடதங்களின் மொழிபெயர்ப்புகள், வரைபடங்கள் மற்றும் சமூக உரைகளை அணுகவும்.",
    satsangTitle: "சத்சங்க வாசல்",
    satsangDesc: "வாராந்திர மெய்நிகர் கூட்டத்தில் சேரவும். அடுத்த வாசிப்பு கடோபநிடதம் 1.3.4.",
    dhyanaTitle: "தியான நிலை",
    dhyanaDesc: "தூய்மையான தியான ஒலியில் நுழையுங்கள். சிந்தனைக்கான இடையூறற்ற சூழல்.",
    sanghaTitle: "சங்கம்",
    sanghaDesc: "மற்ற சாதகர்கள், உருவாக்குனர்கள் மற்றும் தத்துவஞானிகளுடன் இணையுங்கள்.",
    curatedEssays: "தேர்ந்தெடுக்கப்பட்ட கட்டுரைகள் & வரைபடங்கள்",
    returnSanctum: "← மண்டபத்திற்குத் திரும்பு",
    archivesSilent: "சுவடிகள் தற்போது அமைதியாக உள்ளன. பிறகு வரவும்.",
    by: "எழுதியவர்",
    date: "தேதி",
    path: "பாதை",
    backArchives: "← சுவடிகளுக்குத் திரும்பு",
    scrollBlank: "ஆசிரியர் இந்தச் சுருளை காலியாக விட்டுவிட்டார்.",
    chamberSealed: "அறை மூடப்பட்டுள்ளது",
    chamberMsg: "இந்த அறை தற்போது ஆழ்ந்த தியானத்தில் உள்ளது. நேரம் வரும்போது இது தன் உள்ளடக்கங்களை வெளிப்படுத்தும். (உருவாக்கத்தில் உள்ளது)",
    trReaderLangFallback: "மொழிபெயர்ப்பு இல்லை. மூல உரை காட்டப்படுகிறது.",
    satsangLive: "நேரலை",
    satsangTopicLabel: "இன்றைய சொற்பொழிவு",
    satsangChatTitle: "சங்க உரையாடல்",
    satsangInputPlaceholder: "சிந்திக்கவும் அல்லது கேட்கவும்...",
    satsangSend: "அனுப்பு",
    satsangAmbient: "ஒளிபரப்பிற்காக காத்திருக்கிறது...",
    joinAudio: "ஆடியோவில் இணை",
    dhyanaStart: "தொடங்கு",
    dhyanaPause: "இடைநிறுத்து",
    dhyanaEnd: "முடி",
    dhyanaMantra1: "ஐந்து புலன்களும், மனமும் அடங்கும் போது... அதுவே உன்னத நிலை.",
    dhyanaMantra2: "ஆன்மா அனைவரின் இதயங்களிலும் மறைந்துள்ளது.",
    dhyanaMantra3: "எழுமின், விழிமின், குறிக்கோளை அடையும் வரை நில்லாது செல்மின்."
  },
  sa: {
    marketplace: "सार्वजनिकस्थले",
    logout: "निर्गच्छतु",
    welcome: "अन्तर्गेहे स्वागतम्",
    seeker: "साधकः",
    pathOf: "मार्गः",
    insight: "अन्तर्दृष्टिः",
    daysOnPath: "मार्गस्य दिनानि",
    satsangsAttended: "सत्सङ्गाः",
    versesContemplated: "चिन्तिताः श्लोकाः",
    vyasaTitle: "व्यासस्य पुस्तकालयः",
    vyasaDesc: "उपनिषदाम् अनुवादान्, अध्ययनमानचित्रानि, सामाजिकटीकाः च पश्यतु।",
    satsangTitle: "सत्सङ्गस्य द्वारम्",
    satsangDesc: "साप्ताहिके आभासी-समागमे मिलन्तु। अग्रिमं पठनं कठोपनिषद् १.3.4 अस्ति।",
    dhyanaTitle: "ध्यानस्य अवस्था",
    dhyanaDesc: "पावनध्यानावस्थां प्रविशत। विचारार्थं एकाग्रं वातावरणम्।",
    sanghaTitle: "सङ्घः",
    sanghaDesc: "मार्गे अन्यसाधकैः, विकासकैः, दार्शनिकैः च सह युज्यस्व।",
    curatedEssays: "सङ्गृहीताः निबन्धाः अध्ययनमानचित्रानि च",
    returnSanctum: "← अन्तर्गेहं प्रति प्रत्यागच्छतु",
    archivesSilent: "अधुना पुस्तकालयः मौनः अस्ति। पश्चात् आगच्छतु।",
    by: "लिखितवान्",
    date: "दिनचर्या",
    path: "मार्गः",
    backArchives: "← पुस्तकालयं प्रति प्रत्यागच्छतु",
    scrollBlank: "लेखकेन एतत् पत्रं रिक्तं त्यक्तम्।",
    chamberSealed: "कक्षमपिहितम्",
    chamberMsg: "इदं कक्षं सम्प्रति गभीरध्याने अस्ति। यदा समयः आगमिष्यति तदा इदं स्वविषयान् प्रकाशयिष्यति। (निर्माणाधीनम्)",
    trReaderLangFallback: "अनुवादः नास्ति। मूलपाठः प्रदर्श्यते।",
    satsangLive: "प्रत्यक्षम्",
    satsangTopicLabel: "अद्यतनप्रवचनम्",
    satsangChatTitle: "सङ्घसंवादः",
    satsangInputPlaceholder: "चिन्तयतु वा पृच्छतु...",
    satsangSend: "प्रेषय",
    satsangAmbient: "प्रसारणस्य प्रतीक्षा अस्ति...",
    joinAudio: "ध्वनिना सह युज्यताम्",
    dhyanaStart: "आरम्भः",
    dhyanaPause: "विरामः",
    dhyanaEnd: "समाप्तिः",
    dhyanaMantra1: "यदा पञ्चावतिष्ठन्ते ज्ञानानि मनसा सह... तामाहुः परमां गतिम्।",
    dhyanaMantra2: "आत्मा अस्य जन्तोर्निहितो गुहायाम्।",
    dhyanaMantra3: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।"
  }
};

// ── Dashboard Component ───────────────────────────────────────────────────
export default function DevoteeDashboard({ user, onLogout, onGoPublic }) {
  const [activeChamber, setActiveChamber] = useState(null);
  const [readingEssay, setReadingEssay] = useState(null);
  const [publishedContent, setPublishedContent] = useState([]);
  const [lang, setLang] = useState(() => localStorage.getItem("jnana_devotee_lang") || "en");

  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState([
    { id: 1, author: "Aarav", text: "Looking forward to today's reading." },
    { id: 2, author: "Meera", text: "The previous session on the Isha Upanishad was profound." }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeChamber === "satsang" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMsgs, activeChamber]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if(!chatInput.trim()) return;
    setChatMsgs([...chatMsgs, { id: Date.now(), author: user?.name || "Seeker", text: chatInput }]);
    setChatInput("");
  };

  // Dhyana State
  const [dhyanaTime, setDhyanaTime] = useState(600);
  const [initialDhyanaTime, setInitialDhyanaTime] = useState(600);
  const [isDhyanaActive, setIsDhyanaActive] = useState(false);
  const [activeMantraIndex, setActiveMantraIndex] = useState(1);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [meditationHistory, setMeditationHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jnana_meditation_sessions") || "[]");
    } catch { return []; }
  });

  const updateGlobalLiveState = (isActive) => {
    try {
      const currentLive = JSON.parse(localStorage.getItem("jnana_live_meditators") || "[]");
      const userId = user?.id || "001";
      if (isActive) {
        if (!currentLive.find(m => m.id === userId)) {
          localStorage.setItem("jnana_live_meditators", JSON.stringify([...currentLive, { id: userId, name: user?.name || "Seeker", startedAt: Date.now() }]));
        }
      } else {
        localStorage.setItem("jnana_live_meditators", JSON.stringify(currentLive.filter(m => m.id !== userId)));
      }
    } catch (e) { console.error(e); }
  };

  const saveMeditationSession = (completed = true, actualDuration = initialDhyanaTime) => {
    const session = { id: Date.now(), duration: actualDuration, date: new Date().toISOString(), completed };
    setMeditationHistory(prev => {
      const newHistory = [...prev, session];
      localStorage.setItem("jnana_meditation_sessions", JSON.stringify(newHistory));
      return newHistory;
    });
  };
  
  // Use Generative OM Frequency Drone (136.1 Hz)
  const audioCtxRef = useRef(null);
  const fadeRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtxRef.current = new Ctx();
      
      const fader = audioCtxRef.current.createGain();
      fader.gain.value = 0;
      fader.connect(audioCtxRef.current.destination);
      fadeRef.current = fader;

      // Base Om frequency 136.1 Hz, and harmonic overtones
      [136.1, 272.2, 408.3].forEach((f, i) => {
        const osc = audioCtxRef.current.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;
        
        const oscGain = audioCtxRef.current.createGain();
        oscGain.gain.value = i === 0 ? 0.6 : 0.1;

        // Slow detune modulation for organic pulsing
        const lfo = audioCtxRef.current.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + Math.random() * 0.1;
        const lfoGain = audioCtxRef.current.createGain();
        lfoGain.gain.value = 5 + (i * 2);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        osc.connect(oscGain);
        oscGain.connect(fader);

        osc.start();
        lfo.start();
      });
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    if (isDhyanaActive && isAudioEnabled) {
      if (fadeRef.current && audioCtxRef.current) {
        const t = audioCtxRef.current.currentTime;
        fadeRef.current.gain.cancelScheduledValues(t);
        fadeRef.current.gain.setValueAtTime(fadeRef.current.gain.value, t);
        fadeRef.current.gain.linearRampToValueAtTime(0.8, t + 4);
      }
    } else {
      if (fadeRef.current && audioCtxRef.current) {
        const t = audioCtxRef.current.currentTime;
        fadeRef.current.gain.cancelScheduledValues(t);
        fadeRef.current.gain.setValueAtTime(fadeRef.current.gain.value, t);
        fadeRef.current.gain.linearRampToValueAtTime(0, t + 3);
      }
    }
  }, [isDhyanaActive, isAudioEnabled]);

  useEffect(() => {
    let interval = null;
    if (isDhyanaActive && dhyanaTime > 0) {
      interval = setInterval(() => {
        setDhyanaTime(t => t - 1);
      }, 1000);
    } else if (isDhyanaActive && dhyanaTime === 0) {
      saveMeditationSession(true, initialDhyanaTime);
      updateGlobalLiveState(false);
      setIsDhyanaActive(false);
    }
    return () => clearInterval(interval);
  }, [isDhyanaActive, dhyanaTime]);

  useEffect(() => {
    updateGlobalLiveState(isDhyanaActive);
    // Cleanup if unmounted while active
    return () => updateGlobalLiveState(false);
  }, [isDhyanaActive]);

  useEffect(() => {
    if (activeChamber === "meditation") {
      setActiveMantraIndex(Math.floor(Math.random() * 3) + 1);
    } else {
      setIsDhyanaActive(false);
      setDhyanaTime(initialDhyanaTime);
    }
  }, [activeChamber, initialDhyanaTime]);

  const formatDhyanaTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    localStorage.setItem("jnana_devotee_lang", lang);
  }, [lang]);

  const t = I18N[lang] || I18N.en;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jnana_admin_content");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPublishedContent(parsed.filter(c => c.status === "published" || c.status === "review"));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const chambers = [
    { id: "library", title: t.vyasaTitle, icon: "📜", desc: t.vyasaDesc },
    { id: "satsang", title: t.satsangTitle, icon: "🛕", desc: t.satsangDesc },
    { id: "meditation", title: t.dhyanaTitle, icon: "🪷", desc: t.dhyanaDesc },
    { id: "community", title: t.sanghaTitle, icon: "🔥", desc: t.sanghaDesc }
  ];

  return (
    <div className="dash-root">
      <style>{CSS}</style>
      <AmbientBackground />

      <header className="dash-header">
        <a href="#" onClick={(e) => { e.preventDefault(); onGoPublic(); }} className="dash-brand">
          <span style={{ fontFamily: "'Tiro Devanagari Hindi',serif", fontSize: "1.2rem", color: "#E8650A" }}>ॐ</span>
          <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "0.85rem", color: "#D4A017", letterSpacing: "0.15em" }}>JÑĀNA</span>
        </a>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.3rem", marginRight: "1rem" }}>
            {["en", "ta", "sa"].map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                style={{ 
                  background: lang === l ? "rgba(212,160,23,0.2)" : "transparent",
                  border: `1px solid ${lang === l ? "#D4A017" : "transparent"}`,
                  color: lang === l ? "#D4A017" : "#A07A0A",
                  padding: "0.2rem 0.5rem",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => {
            if (activeChamber === "meditation" && dhyanaTime < initialDhyanaTime && dhyanaTime > 0) {
              saveMeditationSession(false, initialDhyanaTime - dhyanaTime);
            }
            onGoPublic();
          }} className="dash-nav-btn" style={{ borderColor: "#2A2820", color: "#A0988A" }}>{t.marketplace}</button>
          <button onClick={() => {
            if (activeChamber === "meditation" && dhyanaTime < initialDhyanaTime && dhyanaTime > 0) {
              saveMeditationSession(false, initialDhyanaTime - dhyanaTime);
            }
            onLogout();
          }} className="dash-nav-btn" style={{ borderColor: "rgba(204,85,119,0.3)", color: "#CC5577" }}>{t.logout}</button>
        </div>
      </header>

      <main className="dash-content">
        {!activeChamber ? (
          <>
            <div className="welcome-sec">
              <div style={{ fontFamily: "'Tiro Devanagari Hindi',serif", fontSize: "3rem", color: "#E8650A", marginBottom: "1rem", animation: "ambientGlow 4s infinite" }}>अ</div>
              <h1 className="greeting">{t.welcome}</h1>
              <div className="sub-greeting">{t.seeker} {user?.name} · {t.pathOf} {t[user?.yoga?.toLowerCase()] || user?.yoga || t.insight}</div>
            </div>

            <div className="chambers-grid">
              {chambers.map((c, i) => (
                <div key={c.id} className="chamber-card" onClick={() => setActiveChamber(c.id)} style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                  <div className="chamber-icon" style={{ animationDelay: `${i * 0.5}s` }}>{c.icon}</div>
                  <h3 className="chamber-title">{c.title}</h3>
                  <p className="chamber-desc">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="devotee-stats">
              <div className="stat-item">
                <div className="stat-val">१४</div>
                <div className="stat-lbl">{t.daysOnPath}</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">{meditationHistory.filter(s => s.completed !== false).length.toLocaleString('hi-IN')}</div>
                <div className="stat-lbl">Dhyana Sessions</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">{Math.floor(meditationHistory.filter(s => s.completed !== false).reduce((acc, s) => acc + s.duration, 0) / 60).toLocaleString('hi-IN')}</div>
                <div className="stat-lbl">Silence (Mins)</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">{(publishedContent.length + 4).toLocaleString('hi-IN')}</div>
                <div className="stat-lbl">{t.versesContemplated}</div>
              </div>
            </div>
          </>
        ) : activeChamber === "library" ? (
          <div className="library-view" style={{ animation: "slideUpFade 1s both" }}>
            {readingEssay ? (
              <div className="reader-view">
                <button className="lib-back" onClick={() => setReadingEssay(null)} style={{ marginBottom: "2.5rem" }}>{t.backArchives}</button>
                <div style={{ padding: "0 2rem", maxWidth: "800px", margin: "0 auto" }}>
                  <h2 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#F0E8D0", marginBottom: "1.5rem", textAlign: "center", textShadow: "0 0 30px rgba(240,232,208,0.2)" }}>
                    {lang === 'ta' && readingEssay.title_ta ? readingEssay.title_ta : (lang === 'sa' && readingEssay.title_sa ? readingEssay.title_sa : readingEssay.title)}
                  </h2>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "11px", color: "#D4A017", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: "4rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(212,160,23,0.15)", textAlign: "center", display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <span>{t.by} {readingEssay.author}</span>
                    <span>·</span>
                    <span>{readingEssay.date}</span>
                    <span>·</span>
                    <span>{t.path} {readingEssay.tag}</span>
                  </div>
                  {(lang !== 'en' && !readingEssay[`body_${lang}`] && readingEssay.body) && <div style={{ marginBottom: "2rem", color: "#E8650A", fontSize: "0.9rem", fontStyle: "italic" }}>{t.trReaderLangFallback}</div>}
                  <div className="md-content">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {lang === 'ta' && readingEssay.body_ta ? readingEssay.body_ta : (lang === 'sa' && readingEssay.body_sa ? readingEssay.body_sa : (readingEssay.body || `_${t.scrollBlank}_`))}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="lib-header">
                  <div>
                    <h2 className="lib-title">{t.vyasaTitle}</h2>
                    <div className="lib-sub">{t.curatedEssays}</div>
                  </div>
                  <button className="lib-back" onClick={() => setActiveChamber(null)}>{t.returnSanctum}</button>
                </div>
                
                {publishedContent.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem", color: "#6A6458", fontStyle: "italic" }}>{t.archivesSilent}</div>
                ) : (
                  <div className="lib-grid">
                    {publishedContent.map((essay, i) => (
                      <div key={essay.id} className="essay-card" style={{ animationDelay: `${i * 0.1}s` }} onClick={() => setReadingEssay(essay)}>
                        <div>
                          <h3 className="essay-title">
                            {lang === 'ta' && essay.title_ta ? essay.title_ta : (lang === 'sa' && essay.title_sa ? essay.title_sa : essay.title)}
                          </h3>
                          <div className="essay-meta">
                            <div>{t.by} <span>{essay.author}</span></div>
                            <div>{t.date} <span>{essay.date}</span></div>
                            <div>{t.path} <span>{essay.tag}</span></div>
                          </div>
                        </div>
                        <div style={{ color: "#D4A017", fontSize: "1.4rem" }}>→</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : activeChamber === "satsang" ? (
          <div className="satsang-container">
            <div className="satsang-main">
              <div className="lib-header" style={{ marginBottom: "0.5rem" }}>
                <div>
                  <h2 className="lib-title">{t.satsangTitle}</h2>
                  <div className="lib-sub">{t.sanghaTitle}</div>
                </div>
                <button className="lib-back" onClick={() => setActiveChamber(null)}>{t.returnSanctum}</button>
              </div>

              <div className="satsang-video-wrapper">
                <div className="satsang-watermark">ॐ</div>
                <div className="satsang-live-badge"><div className="satsang-live-dot"></div> {t.satsangLive}</div>
                <div style={{ zIndex: 1, textAlign: "center", color: "#A0988A", fontStyle: "italic", animation: "ambientGlow 4s infinite" }}>
                  {t.satsangAmbient}
                </div>
              </div>

              <div className="satsang-topic">
                <div>
                  <div className="satsang-topic-label">{t.satsangTopicLabel}</div>
                  <div className="satsang-topic-title">Katha Upanishad 1.3.4</div>
                  <div className="satsang-topic-desc">"Know the Self as the lord of the chariot..."</div>
                </div>
                <button className="lib-back">{t.joinAudio}</button>
              </div>
            </div>

            <div className="satsang-chat">
              <div className="satsang-chat-header">
                {t.satsangChatTitle}
                <span style={{ fontSize: "0.8rem", color: "#A0988A" }}>{(publishedContent.length * 14 + 102).toLocaleString()} online</span>
              </div>
              <div className="satsang-chat-body">
                {chatMsgs.map(m => (
                  <div key={m.id} className="satsang-chat-msg">
                    <div className="satsang-chat-author"><span style={{ color: "#A07A0A" }}>❖</span> {m.author}</div>
                    <div className="satsang-chat-text">{m.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form className="satsang-chat-input-area" onSubmit={handleSendChat}>
                <input 
                  type="text" 
                  className="satsang-input" 
                  placeholder={t.satsangInputPlaceholder} 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                />
                <button type="submit" className="satsang-send-btn">{t.satsangSend}</button>
              </form>
            </div>
          </div>
        ) : activeChamber === "meditation" ? (
          <div className="dhyana-root">
            <button className="lib-back" onClick={() => {
              if (dhyanaTime < initialDhyanaTime && dhyanaTime > 0) {
                saveMeditationSession(false, initialDhyanaTime - dhyanaTime);
              }
              setActiveChamber(null);
            }} style={{ position: "absolute", top: 0, left: 0 }}>
              {t.returnSanctum}
            </button>
            <button 
              className="lib-back" 
              onClick={() => {
                const nextAudio = !isAudioEnabled;
                setIsAudioEnabled(nextAudio);
                if (nextAudio && isDhyanaActive) initAudio();
              }} 
              style={{ position: "absolute", top: 0, right: 0, borderColor: isAudioEnabled ? "#D4A017" : "rgba(212,160,23,0.3)", opacity: isAudioEnabled ? 1 : 0.6 }}
              title="Toggle Nāda (Divine Sound)"
            >
              {isAudioEnabled ? "🔊 NĀDA ON" : "🔇 NĀDA OFF"}
            </button>
            <div className="dhyana-symbol">ॐ</div>
            
            {!isDhyanaActive && dhyanaTime === initialDhyanaTime && (
              <div className="dhyana-preset-wrap">
                {[60, 300, 600, 1200, 3600].map(val => (
                  <button 
                    key={val} 
                    className={`dhyana-preset ${initialDhyanaTime === val ? 'sel' : ''}`}
                    onClick={() => { setInitialDhyanaTime(val); setDhyanaTime(val); }}
                  >
                    {val / 60} MIN
                  </button>
                ))}
              </div>
            )}

            <div className="dhyana-timer" style={{ color: isDhyanaActive ? "#E8650A" : "#F0E8D0" }}>
              {formatDhyanaTime(dhyanaTime)}
            </div>

            <div className="dhyana-controls">
              <button 
                className={`dhyana-btn ${isDhyanaActive ? 'active' : ''}`} 
                onClick={() => {
                  if (!isDhyanaActive && isAudioEnabled) initAudio();
                  setIsDhyanaActive(!isDhyanaActive);
                }}
                disabled={dhyanaTime === 0}
              >
                {isDhyanaActive ? t.dhyanaPause : t.dhyanaStart}
              </button>
              <button 
                className="dhyana-btn" 
                onClick={() => { 
                  if (dhyanaTime < initialDhyanaTime) {
                    saveMeditationSession(false, initialDhyanaTime - dhyanaTime);
                  }
                  setIsDhyanaActive(false); 
                  setDhyanaTime(initialDhyanaTime); 
                }}
                disabled={dhyanaTime === initialDhyanaTime && !isDhyanaActive}
              >
                {t.dhyanaEnd}
              </button>
            </div>

            <div className="dhyana-mantra">
              "{t[`dhyanaMantra${activeMantraIndex}`] || t.dhyanaMantra1}"
            </div>
            {!isDhyanaActive && (
              <div style={{ marginTop: "3rem", fontFamily: "'Share Tech Mono', monospace", color: "#6A6458", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", animation: "slideUpFade 1s both" }}>
                Total Sessions Completed: {meditationHistory.filter(s => s.completed !== false).length} <br/>
                Total Silence: {Math.floor(meditationHistory.filter(s => s.completed !== false).reduce((acc, s) => acc + s.duration, 0) / 60)} Mins
              </div>
            )}
          </div>
        ) : (
          <div className="overlay-msg">
            <h2>{t.chamberSealed}</h2>
            <p>{t.chamberMsg}</p>
            <button className="lib-back" onClick={() => setActiveChamber(null)}>{t.returnSanctum}</button>
          </div>
        )}
      </main>
    </div>
  );
}
