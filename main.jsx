import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import JnanaBrand from "./JnanaBrand.jsx";
import AdminPanel from "./AdminPanel.jsx";
import DevoteeLogin from "./DevoteeLogin.jsx";
import DevoteeDashboard from "./DevoteeDashboard.jsx";

function AppRoot() {
  // Restore persisted session on mount
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("jnana_admin") || "null"); }
    catch { return null; }
  });

  const [devoteeUser, setDevoteeUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("jnana_devotee") || "null"); }
    catch { return null; }
  });

  const [view, setView] = useState(() => {
    if (window.location.hash === "#admin") return "admin";
    if (window.location.hash === "#devotee") return "devotee";
    if (window.location.hash === "#sanctum") return "sanctum";
    return "public";
  });

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#admin") setView("admin");
      else if (window.location.hash === "#devotee") setView("devotee");
      else if (window.location.hash === "#sanctum") setView("sanctum");
      else setView("public");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goAdmin = () => { window.location.hash = "#admin"; setView("admin"); };
  const goDevotee = () => { window.location.hash = "#devotee"; setView("devotee"); };
  const goDevoteeDashboard = () => { window.location.hash = "#sanctum"; setView("sanctum"); };
  const goPublic = () => { window.location.hash = ""; setView("public"); };

  const handleAdminLogin = (user) => {
    setAdminUser(user);
    sessionStorage.setItem("jnana_admin", JSON.stringify(user));
  };
  const handleAdminLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem("jnana_admin");
  };

  const handleDevoteeLogin = (user) => {
    setDevoteeUser(user);
    sessionStorage.setItem("jnana_devotee", JSON.stringify(user));
    goDevoteeDashboard(); 
  };
  const handleDevoteeLogout = () => {
    setDevoteeUser(null);
    sessionStorage.removeItem("jnana_devotee");
    goPublic();
  };

  if (view === "admin") {
    return (
      <AdminPanel
        user={adminUser}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onGoPublic={goPublic}
      />
    );
  }

  if (view === "devotee") {
    // If they manually try to go to #devotee but are already logged in, redirect to sanctum
    if (devoteeUser) {
      setTimeout(goDevoteeDashboard, 0);
      return null;
    }
    return (
      <DevoteeLogin 
        onLogin={handleDevoteeLogin}
        onGoPublic={goPublic}
      />
    );
  }

  if (view === "sanctum") {
    if (!devoteeUser) {
      setTimeout(goDevotee, 0);
      return null;
    }
    return (
      <DevoteeDashboard
        user={devoteeUser}
        onLogout={handleDevoteeLogout}
        onGoPublic={goPublic}
      />
    );
  }

  return (
    <JnanaBrand 
      adminUser={adminUser} 
      onAdminClick={goAdmin} 
      devoteeUser={devoteeUser}
      onDevoteeClick={goDevotee}
      onDevoteeDashboardClick={goDevoteeDashboard}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);