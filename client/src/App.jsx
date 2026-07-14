import { useEffect, useState } from "react";
import Loader from "./components/Loader.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Journey from "./components/Journey.jsx";
import Projects from "./components/Projects.jsx";
import Resume from "./components/Resume.jsx";
import Certifications from "./components/Certifications.jsx";
import Platforms from "./components/Platforms.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import { getContent } from "./api/api.js";
import fallbackData from "./data/portfolioData.js";

function usePortfolioContent() {
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    getContent()
      .then(setData)
      .catch(() => {
        // API not reachable yet (e.g. backend not deployed) — fall back
        // to the bundled real content so the site still renders correctly.
      });
  }, []);

  return data;
}

function Site() {
  const [loading, setLoading] = useState(true);
  const data = usePortfolioContent();

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Navbar name={data.hero?.name} resumeUrl={data.hero?.resumeUrl} />
      <main>
        <Hero hero={data.hero} />
        <About about={data.about} />
        <Skills skills={data.skills} />
        <Journey journey={data.journey} />
        <Projects projects={data.projects} />
        <Resume resumeUrl={data.hero?.resumeUrl} name={data.hero?.name} />
        <Certifications certifications={data.certifications} achievements={data.achievements} />
        <Platforms platforms={data.platforms} />
        <Contact contactEmail={data.contactEmail} contactPhone={data.contactPhone} />
      </main>
      <Footer name={data.hero?.name} />
    </>
  );
}

function Admin() {
  const [token, setToken] = useState(localStorage.getItem("portfolio_admin_token"));

  function logout() {
    localStorage.removeItem("portfolio_admin_token");
    setToken(null);
  }

  return token ? <AdminDashboard token={token} onLogout={logout} /> : <AdminLogin onLogin={setToken} />;
}

export default function App() {
  const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  return isAdmin ? <Admin /> : <Site />;
}