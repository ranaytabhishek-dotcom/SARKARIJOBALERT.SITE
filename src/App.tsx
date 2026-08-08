/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Home from "./pages/Home";
import JobDetail from "./pages/JobDetail";
import Search from "./pages/Search";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdOverlay from "./components/AdOverlay";
import { About, Contact, Privacy, Disclaimer } from "./pages/StaticPages";

function GlobalHead() {
  const [adsenseId, setAdsenseId] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.adsenseId) setAdsenseId(data.adsenseId);
      })
      .catch(e => console.error(e));
  }, []);

  if (!adsenseId) return null;

  return (
    <Helmet>
      <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`} crossOrigin="anonymous"></script>
    </Helmet>
  );
}

function TrackViews() {
  const location = useLocation();
  useEffect(() => {
    fetch("/api/track", { method: "POST" }).catch(e => console.error(e));
  }, [location]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <GlobalHead />
      <BrowserRouter>
        <TrackViews />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/job/:id" element={<AdOverlay><JobDetail /></AdOverlay>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
