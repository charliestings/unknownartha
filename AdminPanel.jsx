import { useState, useEffect, useRef } from "react"

// ── Demo credentials ──────────────────────────────────────────────────────
const USERS = {
  admin:    { password: "jnana2025",  role: "admin",       name: "Ādityā",    avatar: "अ" },
  seva:     { password: "dharma2025", role: "contributor", name: "Sevākā",    avatar: "स" },
}

// ── Mock data ─────────────────────────────────────────────────────────────
const STATS = [
  { label: "Community Members", value: 1284, icon: "🪷", color: "#E8650A", sub: "+38 this month" },
  { label: "Open Essays",       value: 47,   icon: "📜", color: "#D4A017", sub: "Vyasa Archives" },
  { label: "Weekly Satsang",    value: 312,  icon: "🛕", color: "#00BFA0", sub: "Last gathering" },
  { label: "Open Source PRs",   value: 23,   icon: "⚡", color: "#CC5577", sub: "Project Brahmastra" },
]

const CONTENT = [
  { id: "01", title: "Karmayoga in the Age of Algorithms", author: "Ādityā", status: "published", date: "2026-03-18", views: 842, tag: "Karmayoga" },
  { id: "02", title: "Tat Tvam Asi — A Developer's Reading", author: "Priyā",  status: "draft",     date: "2026-03-14", views: 0,   tag: "Advaita" },
  { id: "03", title: "The Chariot Metaphor and UX Design",  author: "Arjun",  status: "review",    date: "2026-03-11", views: 267, tag: "Upanishads" },
  { id: "04", title: "Nishkama Karma for Open-Source Devs", author: "Sevākā", status: "published", date: "2026-03-07", views: 1130, tag: "Karmayoga" },
  { id: "05", title: "Brahma Sutra Study Notes — Week 1",   author: "Meena",  status: "draft",     date: "2026-03-02", views: 0,   tag: "Brahmasutras" },
]

const MEMBERS = [
  { id: "001", name: "Ādityā Rāo",    role: "admin",       yoga: "Jñāna",  joined: "2025-09-01", active: true },
  { id: "002", name: "Priyā Sharma",  role: "contributor", yoga: "Bhakti", joined: "2025-10-14", active: true },
  { id: "003", name: "Arjun Pillai",  role: "contributor", yoga: "Karma",  joined: "2025-11-22", active: true },
  { id: "004", name: "Sevākā Nair",   role: "contributor", yoga: "Karma",  joined: "2026-01-05", active: true },
  { id: "005", name: "Meena Krishnan",role: "member",      yoga: "Bhakti", joined: "2026-02-18", active: false },
  { id: "006", name: "Dev Balaji",    role: "member",      yoga: "Jñāna",  joined: "2026-03-01", active: true },
]

const PROJECTS = [
  { name: "Project Brahmastra",       phase: "v0.3 — NLP Training",      status: "active",  pct: 62, col: "#E8650A" },
  { name: "Sanskrit Corpus Indexer",  phase: "Data pipeline setup",       status: "active",  pct: 38, col: "#D4A017" },
  { name: "Vyasa Archive CMS",        phase: "Design review",             status: "review",  pct: 85, col: "#00BFA0" },
  { name: "Satsang Recording Archive",phase: "Backlog — needs volunteer", status: "paused",  pct: 10, col: "#CC5577" },
]

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Share+Tech+Mono&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#03030F;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#A07A0A60;border-radius:2px}
::-webkit-scrollbar-track{background:transparent}

/* Login */
@keyframes loginFadeIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes shimmerGold{0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes scanLine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
@keyframes slideDownFade { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes progressFill{from{width:0}to{width:var(--pct)}}
@keyframes haloSpin{to{transform:rotate(360deg)}}
@keyframes haloSpinRev{to{transform:rotate(-360deg)}}

.gold-shimmer{background:linear-gradient(90deg,#A07A0A,#F0E8D0,#E8650A,#D4A017,#F0E8D0,#A07A0A);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerGold 5s linear infinite}

/* Admin layout */
.adm-root{display:flex;height:100dvh;overflow:hidden;background:#03030F;color:#C8BEA0;font-family:'EB Garamond',serif}

/* Sidebar */
.adm-sidebar{width:248px;flex-shrink:0;background:#06061A;border-right:1px solid #2A2820;display:flex;flex-direction:column;overflow-y:auto;position:relative;transition:width .3s cubic-bezier(.23,1,.32,1)}
.adm-sidebar.collapsed{width:62px}
.adm-sidebar.collapsed .adm-nav-label,.adm-sidebar.collapsed .adm-brand-text,.adm-sidebar.collapsed .adm-user-info{display:none}
.adm-sidebar.collapsed .adm-nav-item{justify-content:center;padding:.75rem 0}

.adm-brand{padding:1.4rem 1.2rem 1rem;border-bottom:1px solid #2A2820;display:flex;align-items:center;gap:.7rem;flex-shrink:0}
.adm-brand-text{}
.adm-nav{flex:1;padding:.7rem 0}
.adm-nav-item{display:flex;align-items:center;gap:.75rem;padding:.68rem 1.2rem;cursor:pointer;transition:all .2s;position:relative;text-decoration:none;color:inherit;border:none;background:none;width:100%;text-align:left}
.adm-nav-item:hover{background:rgba(232,101,10,.06);color:#F0E8D0}
.adm-nav-item.active{background:rgba(232,101,10,.1);color:#E8650A}
.adm-nav-item.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,transparent,#E8650A,transparent)}
.adm-nav-item.locked{opacity:.38;cursor:not-allowed}
.adm-nav-icon{font-size:1rem;flex-shrink:0;width:20px;text-align:center}
.adm-nav-label{font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;white-space:nowrap}
.adm-nav-badge{font-family:'Share Tech Mono',monospace;font-size:7px;padding:.15rem .4rem;border-radius:2px;margin-left:auto;flex-shrink:0}

.adm-user{padding:1rem 1.2rem;border-top:1px solid #2A2820;display:flex;align-items:center;gap:.75rem;flex-shrink:0}
.adm-user-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#E8650A,#D4A017);display:flex;align-items:center;justify-content:center;font-family:'Tiro Devanagari Hindi',serif;font-size:.95rem;color:#03030F;flex-shrink:0}
.adm-user-info{}

/* Main */
.adm-main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.adm-topbar{padding:.85rem 1.8rem;border-bottom:1px solid #2A2820;display:flex;align-items:center;gap:1rem;flex-shrink:0;background:#03030F}
.adm-content{flex:1;overflow-y:auto;padding:1.8rem}

/* Cards */
.adm-stat-card{border:1px solid #2A2820;padding:1.4rem;background:#06061A;position:relative;overflow:hidden;transition:border-color .3s}
.adm-stat-card:hover{border-color:#A07A0A55}
.adm-stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--col)}

/* Table */
.adm-table{width:100%;border-collapse:collapse}
.adm-table th{font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:#6A6458;padding:.7rem 1rem;text-align:left;border-bottom:1px solid #2A2820;white-space:nowrap}
.adm-table td{padding:.75rem 1rem;border-bottom:1px solid #16161F;vertical-align:middle;font-size:.92rem}
.adm-table tbody tr{transition:background .18s}
.adm-table tbody tr:hover{background:rgba(255,255,255,.025)}

/* Badges */
.badge{font-family:'Share Tech Mono',monospace;font-size:7.5px;letter-spacing:.14em;text-transform:uppercase;padding:.22rem .65rem;border-radius:2px;display:inline-block}
.badge-published{border:1px solid #00BFA044;color:#00BFA0;background:rgba(0,191,160,.07)}
.badge-draft{border:1px solid #6A645844;color:#6A6458;background:rgba(106,100,88,.07)}
.badge-review{border:1px solid #D4A01744;color:#D4A017;background:rgba(212,160,23,.07)}
.badge-active{border:1px solid #E8650A44;color:#E8650A;background:rgba(232,101,10,.07)}
.badge-paused{border:1px solid #CC557744;color:#CC5577;background:rgba(204,85,119,.07)}
.badge-admin{border:1px solid #D4A01744;color:#D4A017;background:rgba(212,160,23,.07)}
.badge-contributor{border:1px solid #00BFA044;color:#00BFA0;background:rgba(0,191,160,.07)}
.badge-member{border:1px solid #6A645844;color:#6A6458;background:rgba(106,100,88,.07)}

/* Progress bar */
.adm-progress{height:4px;background:#2A2820;border-radius:2px;overflow:hidden;margin-top:.5rem}
.adm-progress-fill{height:100%;border-radius:2px;width:var(--pct);animation:progressFill 1.2s cubic-bezier(.23,1,.32,1) both}

/* Action buttons */
.adm-btn{font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;padding:.4rem .9rem;border:1px solid #2A2820;background:transparent;color:#6A6458;cursor:pointer;transition:all .2s}
.adm-btn:hover{border-color:#A07A0A;color:#D4A017}
.adm-btn-danger:hover{border-color:#CC5577;color:#CC5577}
.adm-btn-primary{border-color:#E8650A44;color:#E8650A}
.adm-btn-primary:hover{background:rgba(232,101,10,.1);border-color:#E8650A}

/* Login */
.login-wrap{min-height:100dvh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:#03030F}
.login-card{width:min(400px,calc(100vw - 2rem));border:1px solid #2A2820;background:#06061A;padding:2.8rem 2.4rem;position:relative;overflow:hidden;animation:loginFadeIn .65s cubic-bezier(.23,1,.32,1) both}
.login-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#E8650A,#D4A017,transparent)}
.login-input{width:100%;background:#03030F;border:1px solid #2A2820;color:#C8BEA0;font-family:'EB Garamond',serif;font-size:1rem;padding:.85rem 1rem;transition:border-color .2s;outline:none}
.login-input:focus{border-color:#A07A0A}
.login-input::placeholder{color:#3A3830}
.login-submit{width:100%;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;padding:1rem;background:#E8650A;color:#03030F;border:none;cursor:pointer;transition:all .24s;position:relative;overflow:hidden}
.login-submit:hover{background:#F0E8D0}
.login-submit::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:rgba(255,255,255,.15);transform:skewX(-20deg);animation:scanLine 2.4s ease infinite}

/* Locked overlay */
.locked-overlay{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;text-align:center;gap:1rem}

/* Mobile sidebar */
@media(max-width:767px){
  .adm-sidebar{position:fixed;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .3s cubic-bezier(.23,1,.32,1)}
  .adm-sidebar.mob-open{transform:none;width:248px}
  .adm-sidebar.mob-open .adm-nav-label,.adm-sidebar.mob-open .adm-brand-text,.adm-sidebar.mob-open .adm-user-info{display:block}
  .adm-sidebar.mob-open .adm-nav-item{justify-content:flex-start;padding:.68rem 1.2rem}
  .mob-overlay{position:fixed;inset:0;background:rgba(3,3,15,.75);z-index:99;backdrop-filter:blur(4px)}
  .adm-content{padding:1.2rem}
  .adm-topbar{padding:.75rem 1.2rem}
}
@media(min-width:768px){
  .mob-overlay{display:none!important}
}

/* Section slide-in */
.adm-section{animation:slideIn .38s cubic-bezier(.23,1,.32,1) both}
.stat-anim{animation:countUp .5s cubic-bezier(.23,1,.32,1) both}
`

// ── Sub-components ────────────────────────────────────────────────────────

function StatCard({ stat, delay = 0 }) {
  return (
    <div className="adm-stat-card stat-anim" style={{ "--col": stat.color, animationDelay: `${delay}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".7rem" }}>
        <span style={{ fontSize: "1.6rem" }}>{stat.icon}</span>
        <span className="badge badge-active" style={{ borderColor: `${stat.color}44`, color: stat.color, background: `${stat.color}11` }}>live</span>
      </div>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "clamp(1.5rem,4vw,2rem)", color: stat.color, letterSpacing: "-.01em", marginBottom: ".2rem" }}>{stat.value.toLocaleString()}</div>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#C8BEA0", marginBottom: ".2rem" }}>{stat.label}</div>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "7.5px", letterSpacing: ".12em", color: "#6A6458" }}>{stat.sub}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>
}

function ContentManager({ role, user }) {
  const [contentList, setContentList] = useState(() => {
    try {
      const saved = localStorage.getItem("jnana_admin_content");
      return saved ? JSON.parse(saved) : CONTENT;
    } catch {
      return CONTENT;
    }
  });

  useEffect(() => {
    localStorage.setItem("jnana_admin_content", JSON.stringify(contentList));
  }, [contentList]);

  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [translating, setTranslating] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const textareaRef = useRef(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = filter === "all" ? contentList : contentList.filter(c => c.status === filter);

  const handleFormat = (prefix, suffix = "") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentText = editForm.body || "";
    const newText = currentText.substring(0, start) + prefix + currentText.substring(start, end) + suffix + currentText.substring(end);
    setEditForm(prev => ({ ...prev, body: newText }));
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (!e.shiftKey) {
        if (e.key === 'b') { e.preventDefault(); handleFormat("**", "**"); }
        if (e.key === 'i') { e.preventDefault(); handleFormat("*", "*"); }
        if (e.key === 'k') { e.preventDefault(); handleFormat("[", "](url)"); }
      } else {
        if (e.key.toLowerCase() === 'l') { e.preventDefault(); handleFormat('<div style="text-align: left;">\n\n', '\n\n</div>'); }
        if (e.key.toLowerCase() === 'e') { e.preventDefault(); handleFormat('<div style="text-align: center;">\n\n', '\n\n</div>'); }
        if (e.key.toLowerCase() === 'r') { e.preventDefault(); handleFormat('<div style="text-align: right;">\n\n', '\n\n</div>'); }
        if (e.key.toLowerCase() === 'j') { e.preventDefault(); handleFormat('<div style="text-align: justify;">\n\n', '\n\n</div>'); }
      }
    }
  };

  const handleInsertMedia = (type) => {
    setModal({
      type: "prompt",
      title: `Insert ${type}`,
      message: `Enter the direct URL for the ${type}:`,
      placeholder: `https://...`,
      onConfirm: (url) => {
        if (!url) return;
        if (type === 'Image') {
          handleFormat(`\n![Image description](${url})\n`, '');
        } else if (type === 'Video') {
          handleFormat(`\n<center><video controls src="${url}" style="max-width: 100%; border: 1px solid #D4A017; margin: 2rem 0; border-radius: 4px; box-shadow: 0 0 20px rgba(212,160,23,0.2);"></video></center>\n`, '');
        } else if (type === 'Audio') {
          handleFormat(`\n<audio controls src="${url}" style="width: 100%; margin: 2rem 0; opacity: 0.8; filter: sepia(100%) hue-rotate(350deg);"></audio>\n`, '');
        }
        setModal(null);
      },
      onCancel: () => setModal(null)
    });
  };

  const handleTranslate = async () => {
    if (!editForm.title && !editForm.body) return;
    setTranslating(true);
    let successCount = 0;
    try {
      const translateText = async (text, tl) => {
        if (!text) return "";
        try {
          const params = new URLSearchParams();
          params.append("q", text);
          
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
          });
          
          if (!res.ok) throw new Error("API limits reached");
          const data = await res.json();
          successCount++;
          return data[0].map(s => s[0]).join("");
        } catch (e) {
          console.warn("Translation fallback active:", e);
          return `[Translated: ${tl.toUpperCase()}] ${text}`;
        }
      };

      const title_ta = await translateText(editForm.title, 'ta');
      const title_sa = await translateText(editForm.title, 'sa');
      const body_ta = await translateText(editForm.body, 'ta');
      const body_sa = await translateText(editForm.body, 'sa');

      setEditForm(prev => ({ ...prev, title_ta, title_sa, body_ta, body_sa }));
      
      setTimeout(() => {
        if (successCount >= 2) {
          showToast("✨ AI Translation generated successfully!", "success");
        } else {
          showToast("⚠️ AI API network limits reached. Fallback applied.", "warning");
        }
      }, 100);
      
    } catch (err) {
      console.error("Translation fundamental error", err);
      showToast("AI translation completely failed.", "error");
    }
    setTranslating(false);
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setEditForm({ ...c });
  };

  const handleSave = () => {
    setContentList(prev => prev.map(c => c.id === editingId ? editForm : c));
    setEditingId(null);
    showToast("Document saved successfully.", "success");
  };

  const handleCancel = () => {
    if (editingId && editingId.startsWith("new-")) {
      setContentList(prev => prev.filter(c => c.id !== editingId));
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setModal({
      type: "delete",
      title: "Delete Warning",
      message: "Are you sure you want to permanently delete this essay? This cannot be undone.",
      onConfirm: () => {
        setContentList(prev => prev.filter(c => c.id !== id));
        if (editingId === id) setEditingId(null);
        setModal(null);
        showToast("Essay deleted.", "info");
      },
      onCancel: () => setModal(null)
    });
  };

  const handleNew = () => {
    const newId = "new-" + Date.now();
    const newItem = {
      id: newId,
      title: "New Essay Draft",
      title_ta: "",
      title_sa: "",
      author: user?.name || "Admin",
      tag: "General",
      status: "draft",
      date: new Date().toISOString().split("T")[0],
      views: 0,
      body: "",
      body_ta: "",
      body_sa: ""
    };
    setContentList([newItem, ...contentList]);
    setEditingId(newId);
    setEditForm(newItem);
    setFilter("all");
  };

  return (
    <>
      {/* Custom Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "2rem", left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? "#3A0D0D" : toast.type === "success" ? "#0D2518" : toast.type === "warning" ? "#3A2A0D" : "#0A0D15",
          border: `1px solid ${toast.type === "error" ? "#E8650A" : toast.type === "success" ? "#00BFA0" : toast.type === "warning" ? "#D4A017" : "#0A5C80"}`,
          color: "#F0E8D0", padding: "1rem 1.5rem", borderRadius: "4px",
          fontFamily: "'Share Tech Mono',monospace", fontSize: "14px", zIndex: 9999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)", animation: "slideDownFade 0.3s ease-out both"
        }}>
          {toast.message}
        </div>
      )}

      {/* Custom Modal */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
          animation: "ambientGlow 0.3s ease-out both"
        }}>
          <div style={{
            background: "#060300", border: "1px solid #D4A017", padding: "2.5rem", maxWidth: "450px", width: "90%",
            boxShadow: "0 0 50px rgba(212,160,23,0.1)", borderRadius: "2px"
          }}>
            <h3 style={{ fontFamily: "'Cinzel Decorative',serif", color: "#F0E8D0", fontSize: "1.5rem", marginBottom: "1rem" }}>{modal.title}</h3>
            <p style={{ fontFamily: "'EB Garamond',serif", color: "#C8BEA0", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.5 }}>{modal.message}</p>
            
            {modal.type === "prompt" && (
              <input 
                id="modal-prompt-input"
                autoFocus
                style={{ width: "100%", background: "rgba(212,160,23,0.05)", color: "#F0E8D0", border: "1px solid #443c2c", padding: "0.8rem", outline: "none", fontFamily: "monospace", marginBottom: "2rem", fontSize: "1rem" }}
                placeholder={modal.placeholder}
                onKeyDown={(e) => { if(e.key === 'Enter') modal.onConfirm(e.target.value); }}
              />
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button className="adm-btn" onClick={modal.onCancel}>Cancel</button>
              <button className={`adm-btn ${modal.type === "delete" ? "adm-btn-danger" : "adm-btn-primary"}`} 
                onClick={() => {
                  if (modal.type === "prompt") modal.onConfirm(document.getElementById('modal-prompt-input').value);
                  else modal.onConfirm();
                }}>
                {modal.type === "delete" ? "Confirm Delete" : modal.type === "save" ? "Confirm Save" : "Accept"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingId ? (
      <div className="adm-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.2rem", color: "#F0E8D0", marginBottom: ".2rem" }}>Editor</h3>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".2em", color: "#6A6458", textTransform: "uppercase" }}>Drafting Mode</p>
          </div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <button className={`adm-btn ${translating ? "btn-disabled" : ""}`} onClick={handleTranslate} disabled={translating} style={{ color: "#00BFA0", borderColor: "rgba(0,191,160,0.3)" }}>
              {translating ? "Translating..." : "✨ Auto-Translate (AI)"}
            </button>
            <button className="adm-btn adm-btn-primary" onClick={handleSave}>Save Document</button>
            <button className="adm-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input 
              style={{ width: "100%", background: "transparent", color: "#F0E8D0", border: "none", borderBottom: "1px solid #D4A017", padding: ".6rem 0", outline: "none", fontFamily: "'EB Garamond',serif", fontSize: "2rem" }} 
              placeholder="Essay Title"
              value={editForm.title} 
              onChange={e => setEditForm({...editForm, title: e.target.value})} 
            />
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem", background: "rgba(6,6,26,0.6)", border: "1px solid #2A2820", borderBottom: "none", flexWrap: "wrap", alignItems: "center" }}>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat("**", "**")} title="Bold (Ctrl+B)"><b>B</b></button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat("*", "*")} title="Italic (Ctrl+I)"><i>I</i></button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem", fontFamily: "serif", fontWeight: "bold" }} onClick={() => handleFormat("### ", "")} title="Heading">H</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat("> ", "")} title="Quote">❞</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat("- ", "")} title="List">•</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat("[", "](url)")} title="Link (Ctrl+K)">🔗</button>
                <div style={{ width: "1px", height: "1.2rem", background: "rgba(212,160,23,0.3)", margin: "0 0.3rem" }}></div>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat('<div style="text-align: left;">\n\n', '\n\n</div>')} title="Align Left (Ctrl+Shift+L)">⫷</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat('<div style="text-align: center;">\n\n', '\n\n</div>')} title="Align Center (Ctrl+Shift+E)">⫼</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat('<div style="text-align: right;">\n\n', '\n\n</div>')} title="Align Right (Ctrl+Shift+R)">⫸</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleFormat('<div style="text-align: justify;">\n\n', '\n\n</div>')} title="Justify (Ctrl+Shift+J)">▤</button>
                <div style={{ width: "1px", height: "1.2rem", background: "rgba(212,160,23,0.3)", margin: "0 0.3rem" }}></div>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleInsertMedia('Image')} title="Insert Image URL">🖼️</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleInsertMedia('Video')} title="Insert Video URL">🎞️</button>
                <button className="adm-btn" style={{ padding: "0.2rem 0.6rem", fontSize: "0.9rem" }} onClick={() => handleInsertMedia('Audio')} title="Insert Audio URL">🎵</button>
              </div>
              <textarea 
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                style={{ width: "100%", minHeight: "60vh", background: "rgba(0,0,0,0.2)", color: "#C8BEA0", border: "1px solid #2A2820", padding: "1.2rem", outline: "none", fontFamily: "'EB Garamond',serif", fontSize: "1.1rem", lineHeight: 1.6, resize: "vertical" }}
                placeholder="Write the wisdom here... (Markdown supported)"
                value={editForm.body || ""}
                onChange={e => setEditForm({...editForm, body: e.target.value})}
              />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", background: "rgba(6,6,26,0.6)", padding: "1.5rem", border: "1px solid #2A2820" }}>
            <div style={{ borderBottom: "1px solid #2A2820", paddingBottom: ".8rem", marginBottom: ".4rem", fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "#A07A0A", textTransform: "uppercase", letterSpacing: ".15em" }}>Metadata</div>
            <div>
              <label style={{ display: "block", fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458", textTransform: "uppercase", marginBottom: ".3rem" }}>Author</label>
              <input style={{ width: "100%", background: "rgba(0,0,0,0.4)", color: "#A07A0A", border: "1px solid #443c2c", padding: ".4rem", outline: "none", fontFamily: "'Share Tech Mono',monospace" }} value={editForm.author} onChange={e => setEditForm({...editForm, author: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458", textTransform: "uppercase", marginBottom: ".3rem" }}>Path / Tag</label>
              <input style={{ width: "100%", background: "rgba(0,0,0,0.4)", color: "#C8BEA0", border: "1px solid #443c2c", padding: ".4rem", outline: "none", fontFamily: "'Share Tech Mono',monospace" }} value={editForm.tag} onChange={e => setEditForm({...editForm, tag: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458", textTransform: "uppercase", marginBottom: ".3rem" }}>Status</label>
              <select style={{ width: "100%", background: "#06061A", color: "#C8BEA0", border: "1px solid #443c2c", padding: ".4rem", outline: "none", fontFamily: "'Share Tech Mono',monospace" }} value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                <option value="draft">draft</option>
                <option value="review">review</option>
                <option value="published">published</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458", textTransform: "uppercase", marginBottom: ".3rem" }}>Date</label>
              <input type="date" style={{ width: "100%", background: "rgba(0,0,0,0.4)", color: "#6A6458", border: "1px solid #443c2c", padding: ".4rem", outline: "none", fontFamily: "'Share Tech Mono',monospace" }} value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} />
            </div>
            {editingId && !editingId.startsWith("new-") && role === "admin" && (
              <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                <button className="adm-btn adm-btn-danger" style={{ width: "100%" }} onClick={() => handleDelete(editingId)}>Delete Document</button>
              </div>
            )}
          </div>
        </div>
      </div>
      ) : (
      <div className="adm-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.4rem", flexWrap: "wrap", gap: ".7rem" }}>
        <div>
          <h3 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1rem", color: "#F0E8D0", marginBottom: ".2rem" }}>Content Manager</h3>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".2em", color: "#6A6458", textTransform: "uppercase" }}>Vyasa's Archives · Essays & Study Maps</p>
        </div>
        <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
          {["all", "published", "draft", "review"].map(f => (
            <button key={f} className={`adm-btn${filter === f ? " adm-btn-primary" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
          {role === "admin" && <button className="adm-btn adm-btn-primary" onClick={handleNew}>+ New Essay</button>}
        </div>
      </div>
      <div style={{ border: "1px solid #2A2820", overflow: "visible" }}>
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th><th>Title</th><th>Author</th><th>Tag</th><th>Status</th><th>Date</th><th>Views</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458" }}>
                  {c.id.startsWith("new-") ? "NEW" : c.id}
                </td>
                <td style={{ color: "#F0E8D0", maxWidth: "260px" }}>{c.title}</td>
                <td style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", color: "#A07A0A" }}>{c.author}</td>
                <td><span className="badge badge-review" style={{ whiteSpace: "nowrap" }}>{c.tag}</span></td>
                <td><StatusBadge status={c.status} /></td>
                <td style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458" }}>{c.date}</td>
                <td style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", color: "#C8BEA0" }}>{c.views || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: ".3rem" }}>
                    <button className="adm-btn" onClick={() => handleEdit(c)}>Edit</button>
                    {role === "admin" && <button className="adm-btn adm-btn-danger" onClick={() => handleDelete(c.id)}>Del</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )}
    </>
  );
}

function MemberRegistry() {
  return (
    <div className="adm-section">
      <div style={{ marginBottom: "1.4rem" }}>
        <h3 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1rem", color: "#F0E8D0", marginBottom: ".2rem" }}>Member Registry</h3>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".2em", color: "#6A6458", textTransform: "uppercase" }}>Sangha · Registered seekers</p>
      </div>
      <div style={{ border: "1px solid #2A2820", overflow: "auto" }}>
        <table className="adm-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Role</th><th>Yoga Path</th><th>Joined</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {MEMBERS.map(m => (
              <tr key={m.id}>
                <td style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458" }}>{m.id}</td>
                <td style={{ color: "#F0E8D0" }}>{m.name}</td>
                <td><span className={`badge badge-${m.role}`}>{m.role}</span></td>
                <td style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8.5px", color: "#A07A0A" }}>{m.yoga}</td>
                <td style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458" }}>{m.joined}</td>
                <td>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: m.active ? "#00BFA0" : "#2A2820" }} />
                </td>
                <td>
                  <div style={{ display: "flex", gap: ".3rem" }}>
                    <button className="adm-btn">View</button>
                    <button className="adm-btn adm-btn-danger">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProjectTracker() {
  return (
    <div className="adm-section">
      <div style={{ marginBottom: "1.4rem" }}>
        <h3 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1rem", color: "#F0E8D0", marginBottom: ".2rem" }}>Project Tracker</h3>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".2em", color: "#6A6458", textTransform: "uppercase" }}>Open-source · Brahmastra & Initiatives</p>
      </div>
      <div style={{ display: "grid", gap: "1px", background: "#2A2820" }}>
        {PROJECTS.map((p, i) => (
          <div key={p.name} style={{ background: i % 2 === 0 ? "#03030F" : "#06061A", padding: "1.4rem 1.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".6rem", flexWrap: "wrap", gap: ".5rem" }}>
              <div>
                <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.05rem", color: "#F0E8D0", marginBottom: ".15rem" }}>{p.name}</div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".14em", color: "#6A6458" }}>{p.phase}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                <StatusBadge status={p.status} />
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: p.col }}>{p.pct}%</span>
              </div>
            </div>
            <div className="adm-progress">
              <div className="adm-progress-fill" style={{ "--pct": `${p.pct}%`, background: p.col }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsPanel() {
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    showToast("Settings updated globally.", "success");
  };

  return (
    <div className="adm-section">
      {/* Custom Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "2rem", left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? "#3A0D0D" : toast.type === "success" ? "#0D2518" : toast.type === "warning" ? "#3A2A0D" : "#0A0D15",
          border: `1px solid ${toast.type === "error" ? "#E8650A" : toast.type === "success" ? "#00BFA0" : toast.type === "warning" ? "#D4A017" : "#0A5C80"}`,
          color: "#F0E8D0", padding: "1rem 1.5rem", borderRadius: "4px",
          fontFamily: "'Share Tech Mono',monospace", fontSize: "14px", zIndex: 9999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)", animation: "slideDownFade 0.3s ease-out both"
        }}>
          {toast.message}
        </div>
      )}

      {/* Custom Modal */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
          animation: "ambientGlow 0.3s ease-out both"
        }}>
          <div style={{
            background: "#060300", border: "1px solid #D4A017", padding: "2.5rem", maxWidth: "450px", width: "90%",
            boxShadow: "0 0 50px rgba(212,160,23,0.1)", borderRadius: "2px"
          }}>
            <h3 style={{ fontFamily: "'Cinzel Decorative',serif", color: "#F0E8D0", fontSize: "1.5rem", marginBottom: "1rem" }}>{modal.title}</h3>
            <p style={{ fontFamily: "'EB Garamond',serif", color: "#C8BEA0", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.5 }}>{modal.message}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button className="adm-btn" onClick={modal.onCancel}>Cancel</button>
              <button className={`adm-btn adm-btn-primary`} onClick={modal.onConfirm}>Confirm Save</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: "1.8rem" }}>
        <h3 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1rem", color: "#F0E8D0", marginBottom: ".2rem" }}>Site Settings</h3>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".2em", color: "#6A6458", textTransform: "uppercase" }}>Admin only · Global configuration</p>
      </div>
      {[
        { label: "Community Name",        val: "JÑĀNA",                 hint: "Displayed in nav and footer" },
        { label: "Default Language",      val: "English (en)",          hint: "Fallback display language" },
        { label: "Satsang Schedule",      val: "Every Sunday, 10:00 AM IST", hint: "Shown in community circles" },
        { label: "GitHub Org URL",        val: "github.com/jnana-community", hint: "Project Brahmastra repo" },
        { label: "Contact Email",         val: "jnana@domain.com",      hint: "Appears in join section" },
      ].map(s => (
        <div key={s.label} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid #16161F", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase", color: "#C8BEA0", marginBottom: ".2rem" }}>{s.label}</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "7.5px", color: "#6A6458" }}>{s.hint}</div>
          </div>
          <input defaultValue={s.val} className="login-input" style={{ fontSize: ".9rem", padding: ".6rem .9rem" }} />
        </div>
      ))}
      <div style={{ marginTop: "1.5rem", display: "flex", gap: ".7rem" }}>
        <button className="adm-btn adm-btn-primary" onClick={handleSave}>Save Changes</button>
        <button className="adm-btn">Reset</button>
      </div>
    </div>
  )
}

// ── Meditations Submodule ─────────────────────────────────────────────────
function MeditationsPanel() {
  const [history, setHistory] = useState([]);
  const [live, setLive] = useState([]);
  
  useEffect(() => {
    const update = () => {
      try {
        setHistory(JSON.parse(localStorage.getItem("jnana_meditation_sessions") || "[]"));
        setLive(JSON.parse(localStorage.getItem("jnana_live_meditators") || "[]"));
      } catch(e) {}
    }
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalTime = Math.floor(history.filter(s => s.completed !== false).reduce((a, b) => a + b.duration, 0) / 60);

  return (
    <div className="adm-section" style={{ animation: "slideUpFade .4s ease-out" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", padding: "1.4rem 1.6rem", border: "1px solid #2A2820", background: "#06061A", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#D4A017,transparent)" }} />
        <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.2rem", color: "#F0E8D0", marginBottom: ".5rem" }}>
          Dhyana (Meditation) Network
        </div>
        <div style={{ fontFamily: "'EB Garamond',serif", color: "#C8BEA0", fontSize: ".97rem" }}>
          "In the still mind, in the depths of meditation, the Self reveals itself." — Bhagavad Gita
        </div>
        <div style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", fontFamily: "'Tiro Devanagari Hindi',serif", fontSize: "4rem", color: "#D4A017", opacity: .06 }}>ॐ</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Sessions", val: history.length, color: "#D4A017" },
          { label: "Completed Success", val: history.filter(s => s.completed !== false).length, color: "#00BFA0" },
          { label: "Global Silence", val: `${totalTime} MINS`, color: "#E8650A" },
          { label: "Currently Live", val: live.length, color: live.length > 0 ? "#00BFA0" : "#6A6458" }
        ].map((s, i) => (
          <div key={i} style={{ padding: "1.5rem", border: "1px solid #2A2820", background: "#16161F", textAlign: "center" }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "#6A6458", textTransform: "uppercase", letterSpacing: ".2em", marginBottom: "1rem" }}>{s.label}</div>
            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "2rem", color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Full History Log */}
      <div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".28em", textTransform: "uppercase", color: "#6A6458", marginBottom: "1rem" }}>Comprehensive Dhyana Log</div>
        <div style={{ border: "1px solid #2A2820", background: "#16161F" }}>
          {history.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6A6458", fontStyle: "italic" }}>No sessions recorded in the network.</div>
          ) : (
            history.slice().reverse().map((s, i) => (
              <div key={s.id || i} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.2rem", borderBottom: i < history.length - 1 ? "1px solid #2A2820" : "none" }}>
                <span className="badge badge-active" style={{ width: "80px", textAlign: "center", background: s.completed === false ? "rgba(204,85,119,0.08)" : "rgba(232,101,10,0.05)", borderColor: s.completed === false ? "#CC557744" : "#E8650A44", color: s.completed === false ? "#CC5577" : "#E8650A" }}>
                  {Math.ceil(s.duration / 60)} MINS
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "1rem", color: s.completed === false ? "#CC5577" : "#F0E8D0", marginBottom: "0.2rem" }}>
                    {s.completed === false ? "Broken Session (Premature Exit)" : "Successfully Completed Dhyana"}
                  </div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", color: "#6A6458", letterSpacing: ".1em" }}>
                    ID: {s.id} · DURATION: {s.duration} SECONDS
                  </div>
                </div>
                <div style={{ textAlign: "right", fontFamily: "'Share Tech Mono',monospace", fontSize: "10px", color: "#A0988A" }}>
                  <div>{new Date(s.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div>
                  <div style={{ color: "#6A6458", marginTop: "0.2rem" }}>{new Date(s.date).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function OverviewPanel({ user }) {
  const [liveMeditators, setLiveMeditators] = useState([]);
  const [meditationHistory, setMeditationHistory] = useState([]);

  useEffect(() => {
    const updateStats = () => {
      try {
        setLiveMeditators(JSON.parse(localStorage.getItem("jnana_live_meditators") || "[]"));
        setMeditationHistory(JSON.parse(localStorage.getItem("jnana_meditation_sessions") || "[]"));
      } catch(e) {}
    };
    
    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const dynamicStats = [
    { label: "Live Meditators", value: liveMeditators.length, icon: "🧘", color: liveMeditators.length > 0 ? "#00BFA0" : "#6A6458", sub: liveMeditators.map(m => m.name).join(", ") || "Silence" },
    { label: "Community Members", value: 1284, icon: "🪷", color: "#E8650A", sub: "+38 this month" },
    { label: "Total Completed", value: meditationHistory.filter(s => s.completed !== false).length, icon: "🪔", color: "#D4A017", sub: "Successful sessions" },
    { label: "Premature Exits", value: meditationHistory.filter(s => s.completed === false).length, icon: "⚠️", color: "#CC5577", sub: "Broken sessions" },
  ];

  return (
    <div className="adm-section">
      {/* Welcome */}
      <div style={{ marginBottom: "2rem", padding: "1.4rem 1.6rem", border: "1px solid #2A2820", background: "#06061A", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#E8650A,#D4A017,transparent)" }} />
        <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(.85rem,2.5vw,1.1rem)", color: "#F0E8D0", marginBottom: ".5rem" }}>
          Namasté, <span style={{ color: "#E8650A" }}>{user.name}</span> 🙏
        </div>
        <div style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", color: "#6A6458", fontSize: ".97rem" }}>
          "Yogasthaḥ kuru karmāṇi" — be established in yoga, then act. — Gita 2.48
        </div>
        <div style={{ position: "absolute", right: "1.4rem", top: "50%", transform: "translateY(-50%)", fontFamily: "'Tiro Devanagari Hindi',serif", fontSize: "4rem", color: "#E8650A", opacity: .06 }}>ॐ</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1px", background: "#2A2820", marginBottom: "2rem" }}>
        {dynamicStats.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 80} />)}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".28em", textTransform: "uppercase", color: "#6A6458", marginBottom: "1rem" }}>Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
          {[
            ["📜 New Essay", "#00BFA0"],
            ["🛕 Schedule Satsang", "#D4A017"],
            ["⚡ Open PR — Brahmastra", "#E8650A"],
            ["📨 Send Newsletter", "#CC5577"],
          ].map(([label, col]) => (
            <button key={label} className="adm-btn" style={{ borderColor: `${col}44`, color: col }} onClick={() => {}}>{label}</button>
          ))}
        </div>
      </div>

      {/* History Grids */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        
        {/* Recent content */}
        <div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".28em", textTransform: "uppercase", color: "#6A6458", marginBottom: "1rem" }}>Recent Content Activity</div>
          <div style={{ border: "1px solid #2A2820" }}>
            {CONTENT.slice(0, 3).map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".9rem 1.2rem", borderBottom: i < 2 ? "1px solid #16161F" : "none" }}>
                <StatusBadge status={c.status} />
                <span style={{ flex: 1, fontSize: ".95rem", color: "#C8BEA0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</span>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458" }}>{c.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meditation History */}
        <div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".28em", textTransform: "uppercase", color: "#6A6458", marginBottom: "1rem" }}>Dhyana History (Global)</div>
          <div style={{ border: "1px solid #2A2820", minHeight: "155px" }}>
            {meditationHistory.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#6A6458", fontStyle: "italic", fontSize: "0.9rem" }}>No completed sessions recorded yet.</div>
            ) : (
              meditationHistory.slice(-3).reverse().map((s, i) => (
                <div key={s.id || i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".9rem 1.2rem", borderBottom: i < 2 ? "1px solid #16161F" : "none" }}>
                  <span className="badge badge-active" style={{ background: s.completed === false ? "rgba(204,85,119,0.08)" : "rgba(232,101,10,0.05)", borderColor: s.completed === false ? "#CC557744" : "#E8650A44", color: s.completed === false ? "#CC5577" : "#E8650A" }}>{Math.ceil(s.duration / 60)} MINS</span>
                  <span style={{ flex: 1, fontSize: ".95rem", color: s.completed === false ? "#CC5577" : "#C8BEA0" }}>{s.completed === false ? "Broken Session" : "Completed Session"}</span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: s.completed === false ? "#CC557799" : "#6A6458" }}>{new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Navigation config ─────────────────────────────────────────────────────
const NAV = [
  { id: "overview",  label: "Overview",        icon: "🔮", roles: ["admin", "contributor"] },
  { id: "content",   label: "Content",          icon: "📜", roles: ["admin", "contributor"] },
  { id: "members",   label: "Member Registry",  icon: "🪷", roles: ["admin"] },
  { id: "meditations", label: "Meditations",    icon: "🪔", roles: ["admin"] },
  { id: "projects",  label: "Projects",         icon: "⚡", roles: ["admin", "contributor"] },
  { id: "settings",  label: "Settings",         icon: "⚙️", roles: ["admin"] },
]

// ── Admin Dashboard ───────────────────────────────────────────────────────
function AdminDashboard({ user, onLogout, onGoPublic }) {
  const [tab, setTab] = useState("overview")
  const [collapsed, setCollapsed] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)
  const isMob = typeof window !== "undefined" && window.innerWidth < 768

  const canAccess = (nav) => nav.roles.includes(user.role)

  const handleNav = (id) => {
    if (!canAccess(NAV.find(n => n.id === id))) return
    setTab(id)
    setMobOpen(false)
  }

  return (
    <div className="adm-root">
      {/* Mobile overlay */}
      {mobOpen && <div className="mob-overlay" onClick={() => setMobOpen(false)} />}

      {/* Sidebar */}
      <aside className={`adm-sidebar${collapsed && !isMob ? " collapsed" : ""}${mobOpen ? " mob-open" : ""}`}>
        {/* Brand */}
        <div className="adm-brand">
          <span style={{ fontFamily: "'Tiro Devanagari Hindi',serif", fontSize: "1.5rem", color: "#E8650A", flexShrink: 0, animation: "floatY 4s ease-in-out infinite" }}>ॐ</span>
          <div className="adm-brand-text">
            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: ".75rem", color: "#D4A017", letterSpacing: ".12em" }}>JÑĀNA</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "7px", letterSpacing: ".22em", color: "#6A6458", textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {/* Collapse toggle — desktop */}
          <button className="adm-nav-item" onClick={() => setCollapsed(v => !v)} style={{ marginBottom: ".4rem" }}>
            <span className="adm-nav-icon" style={{ color: "#6A6458" }}>{collapsed ? "▷" : "◁"}</span>
            <span className="adm-nav-label" style={{ color: "#6A6458" }}>Collapse</span>
          </button>

          {NAV.map(n => {
            const allowed = canAccess(n)
            return (
              <button
                key={n.id}
                className={`adm-nav-item${tab === n.id && allowed ? " active" : ""}${!allowed ? " locked" : ""}`}
                onClick={() => handleNav(n.id)}
                title={!allowed ? "Admin only" : n.label}
              >
                <span className="adm-nav-icon">{n.icon}</span>
                <span className="adm-nav-label">{n.label}</span>
                {!allowed && <span className="adm-nav-badge" style={{ borderColor: "#CC557744", color: "#CC5577", border: "1px solid #CC557744" }}>🔒</span>}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="adm-user">
          <div className="adm-user-avatar">{user.avatar}</div>
          <div className="adm-user-info">
            <div style={{ fontFamily: "'EB Garamond',serif", fontSize: ".94rem", color: "#C8BEA0", marginBottom: ".15rem" }}>{user.name}</div>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="adm-main">
        {/* Topbar */}
        <div className="adm-topbar">
          <button className="adm-btn" style={{ padding: ".38rem .7rem", fontSize: "1rem", lineHeight: 1, display: "flex" }}
            onClick={() => setMobOpen(v => !v)}>☰</button>
          <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "clamp(.75rem,2vw,.88rem)", color: "#F0E8D0", letterSpacing: ".06em", flex: 1 }}>
            {NAV.find(n => n.id === tab)?.icon} {NAV.find(n => n.id === tab)?.label}
          </div>
          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".14em", color: "#6A6458" }}>
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <button className="adm-btn" onClick={onLogout} style={{ borderColor: "#CC557744", color: "#CC5577" }}>Logout</button>
            <button className="adm-btn" onClick={onGoPublic}>← Public Site</button>
          </div>
        </div>

        {/* Content */}
        <div className="adm-content">
          {tab === "overview" && <OverviewPanel user={user} />}
          {tab === "content" && <ContentManager role={user.role} user={user} />}
          {tab === "members" && (
            canAccess(NAV.find(n => n.id === "members"))
              ? <MemberRegistry />
              : <LockedSection label="Member Registry" />
          )}
          {tab === "meditations" && (
            canAccess(NAV.find(n => n.id === "meditations"))
              ? <MeditationsPanel />
              : <LockedSection label="Meditations" />
          )}
          {tab === "projects" && <ProjectTracker />}
          {tab === "settings" && (
            canAccess(NAV.find(n => n.id === "settings"))
              ? <SettingsPanel />
              : <LockedSection label="Settings" />
          )}
        </div>
      </div>
    </div>
  )
}

function LockedSection({ label }) {
  return (
    <div className="locked-overlay">
      <span style={{ fontSize: "3rem" }}>🔒</span>
      <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.1rem", color: "#F0E8D0" }}>{label}</div>
      <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6458", maxWidth: "300px", textAlign: "center" }}>
        This section requires Admin privileges.<br />Contact the Ādityā to request access.
      </p>
    </div>
  )
}

// ── Admin Login ───────────────────────────────────────────────────────────
function AdminLogin({ onLogin, onGoPublic }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const cardRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate async check
    setTimeout(() => {
      const u = USERS[username.trim().toLowerCase()]
      if (u && u.password === password) {
        onLogin({ name: u.name, role: u.role, avatar: u.avatar, username: username.toLowerCase() })
      } else {
        setError("Invalid credentials. Access denied.")
        setShake(true)
        setLoading(false)
        setTimeout(() => setShake(false), 600)
      }
    }, 700)
  }

  return (
    <div className="login-wrap">
      <style>{CSS}</style>
      {/* Background halos */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", border: "1px solid rgba(212,160,23,.06)", animation: "haloSpin 40s linear infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "420px", height: "420px", borderRadius: "50%", border: "1px solid rgba(232,101,10,.04)", animation: "haloSpinRev 28s linear infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", fontFamily: "'Tiro Devanagari Hindi',serif", fontSize: "clamp(14rem,35vw,26rem)", color: "#E8650A", opacity: .025, userSelect: "none", pointerEvents: "none", animation: "breathe 8s ease-in-out infinite" }}>ॐ</div>

      <div className="login-card" ref={cardRef} style={{ animation: shake ? "shake .5s ease, loginFadeIn .65s cubic-bezier(.23,1,.32,1) both" : undefined }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Tiro Devanagari Hindi',serif", fontSize: "2.4rem", color: "#E8650A", marginBottom: ".4rem", animation: "floatY 4s ease-in-out infinite" }}>ॐ</div>
          <div className="gold-shimmer" style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.1rem", fontWeight: 900, letterSpacing: ".18em", marginBottom: ".3rem" }}>JÑĀNA</div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".38em", textTransform: "uppercase", color: "#6A6458" }}>Restricted · Admin Access</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".28em", textTransform: "uppercase", color: "#6A6458", display: "block", marginBottom: ".4rem" }}>Username</label>
            <input className="login-input" id="admin-username" type="text" value={username} onChange={e => { setUsername(e.target.value); setError("") }} placeholder="admin" autoComplete="username" required />
          </div>
          <div>
            <label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".28em", textTransform: "uppercase", color: "#6A6458", display: "block", marginBottom: ".4rem" }}>Password</label>
            <input className="login-input" id="admin-password" type="password" value={password} onChange={e => { setPassword(e.target.value); setError("") }} placeholder="••••••••••" autoComplete="current-password" required />
          </div>

          {error && (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8.5px", letterSpacing: ".14em", color: "#CC5577", background: "rgba(204,85,119,.07)", border: "1px solid #CC557744", padding: ".65rem .9rem" }}>⚠ {error}</div>
          )}

          <button className="login-submit" id="admin-login-btn" type="submit" disabled={loading}>
            {loading ? "Verifying…" : "Enter the Sanctum"}
          </button>
        </form>

        {/* Hint */}
        <div style={{ marginTop: "1.6rem", paddingTop: "1.2rem", borderTop: "1px solid #2A2820", textAlign: "center" }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "7.5px", letterSpacing: ".18em", color: "#3A3830", textTransform: "uppercase", marginBottom: ".4rem" }}>Demo Credentials</div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", color: "#6A6458", lineHeight: 2 }}>
            admin / jnana2025 → Full access<br />
            seva / dharma2025 → Contributor
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
          <button id="back-to-site-link" onClick={onGoPublic} style={{ background: "transparent", border: "none", fontFamily: "'Share Tech Mono',monospace", fontSize: "8px", letterSpacing: ".18em", color: "#6A6458", cursor: "pointer", textTransform: "uppercase", padding: 0 }}>← Return to public site</button>
        </div>
      </div>
    </div>
  )
}

// ── Root Export ───────────────────────────────────────────────────────────
export default function AdminPanel({ user, onLogin, onLogout, onGoPublic }) {
  return (
    <>
      <style>{CSS}</style>
      {user
        ? <AdminDashboard user={user} onLogout={onLogout} onGoPublic={onGoPublic} />
        : <AdminLogin onLogin={onLogin} onGoPublic={onGoPublic} />
      }
    </>
  )
}
