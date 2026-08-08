import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Edit, Trash2, Plus } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Category, JobPost, AppSettings, TrafficStats } from "../types";

const CATEGORIES: Category[] = [
  "Results", "Admit Card", "Latest Jobs", 
  "Answer Key", "Board Update", "University Update",
  "Sarkari Yojana", "Admission", "Scholarship"
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "settings" | "highlights" | "categoryAds" | "traffic">("posts");
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ adScript: "", adDelay: 5 });
  const [traffic, setTraffic] = useState<TrafficStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    category: "Latest Jobs" as Category,
    title: "",
    statusText: "New",
    shortDescription: "",
    importantDates: "Start Date: \nLast Date: ",
    applicationFee: "General / OBC: \nSC / ST: ",
    ageLimit: "Minimum Age: \nMaximum Age: ",
    vacancyDetails: "Post Name | Total Post | Eligibility\n",
    officialLink: "",
    applyLink: "",
    admitCardLink: "",
    resultLink: ""
  });

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    
    Promise.all([
      fetch("/api/posts").then(r => r.json()),
      fetch("/api/settings").then(r => r.json()),
      fetch("/api/traffic", { headers: { "Authorization": `Bearer ${token}` } }).then(r => r.json())
    ]).then(([postsData, settingsData, trafficData]) => {
      setPosts(postsData);
      setSettings(settingsData);
      setTraffic(Array.isArray(trafficData) ? trafficData : []);
      setLoading(false);
    }).catch(() => {
      // If unauthorized, token is probably bad
      navigate("/admin/login");
    });
  }, [navigate, token]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      alert("Post created successfully!");
      setFormData({
        category: "Latest Jobs" as Category,
        title: "",
        statusText: "New",
        shortDescription: "",
        importantDates: "Start Date: \nLast Date: ",
        applicationFee: "General / OBC: \nSC / ST: ",
        ageLimit: "Minimum Age: \nMaximum Age: ",
        vacancyDetails: "Post Name | Total Post | Eligibility\n",
        officialLink: "",
        applyLink: "",
        admitCardLink: "",
        resultLink: ""
      });
    } else {
      alert("Failed to create post.");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      alert("Settings updated successfully!");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-fit">
          <div className="bg-[#8b0000] text-white p-4 font-bold text-lg text-center rounded-t">
            Admin Panel
          </div>
          <button 
            onClick={() => setActiveTab("posts")}
            className={`p-4 text-left font-semibold border-b border-gray-100 hover:bg-gray-50 ${activeTab === "posts" ? "bg-red-50 text-[#8b0000]" : ""}`}
          >
            Manage Vacancies
          </button>
          <button 
            onClick={() => setActiveTab("highlights")}
            className={`p-4 text-left font-semibold border-b border-gray-100 hover:bg-gray-50 ${activeTab === "highlights" ? "bg-red-50 text-[#8b0000]" : ""}`}
          >
            Manage Highlights
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`p-4 text-left font-semibold border-b border-gray-100 hover:bg-gray-50 ${activeTab === "settings" ? "bg-red-50 text-[#8b0000]" : ""}`}
          >
            Ad & Social Settings
          </button>
          <button 
            onClick={() => setActiveTab("categoryAds")}
            className={`p-4 text-left font-semibold border-b border-gray-100 hover:bg-gray-50 ${activeTab === "categoryAds" ? "bg-red-50 text-[#8b0000]" : ""}`}
          >
            Category Ads
          </button>
          <button 
            onClick={() => setActiveTab("traffic")}
            className={`p-4 text-left font-semibold hover:bg-gray-50 ${activeTab === "traffic" ? "bg-red-50 text-[#8b0000]" : ""}`}
          >
            Traffic & Analytics
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("admin_token");
              navigate("/");
            }}
            className="p-4 text-left font-semibold text-red-600 border-t border-gray-200 hover:bg-red-50 mt-auto"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          
          {activeTab === "posts" && (
            <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">Add New Vacancy</h2>
              
              <form onSubmit={handleCreatePost} className="space-y-4 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as Category})}
                      className="w-full border p-2 rounded"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Post Title</label>
                    <input 
                      type="text" required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. SSC CGL 2026 Notification" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Status Text</label>
                    <input 
                      type="text"
                      value={formData.statusText}
                      onChange={e => setFormData({...formData, statusText: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. New, Out, Start" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Short Description</label>
                  <textarea 
                    rows={2} required
                    value={formData.shortDescription}
                    onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Important Dates</label>
                    <textarea 
                      rows={4}
                      value={formData.importantDates}
                      onChange={e => setFormData({...formData, importantDates: e.target.value})}
                      className="w-full border p-2 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Application Fee</label>
                    <textarea 
                      rows={4}
                      value={formData.applicationFee}
                      onChange={e => setFormData({...formData, applicationFee: e.target.value})}
                      className="w-full border p-2 rounded text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Age Limit</label>
                    <textarea 
                      rows={4}
                      value={formData.ageLimit}
                      onChange={e => setFormData({...formData, ageLimit: e.target.value})}
                      className="w-full border p-2 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Official Link</label>
                    <input 
                      type="url" required
                      value={formData.officialLink}
                      onChange={e => setFormData({...formData, officialLink: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Apply Online Link (Optional)</label>
                    <input 
                      type="url"
                      value={formData.applyLink}
                      onChange={e => setFormData({...formData, applyLink: e.target.value})}
                      className="w-full border p-2 rounded text-sm" 
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Admit Card Link (Optional)</label>
                    <input 
                      type="url"
                      value={formData.admitCardLink}
                      onChange={e => setFormData({...formData, admitCardLink: e.target.value})}
                      className="w-full border p-2 rounded text-sm" 
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Result Link (Optional)</label>
                    <input 
                      type="url"
                      value={formData.resultLink}
                      onChange={e => setFormData({...formData, resultLink: e.target.value})}
                      className="w-full border p-2 rounded text-sm" 
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Vacancy Details (HTML/Text)</label>
                  <textarea 
                    rows={4}
                    value={formData.vacancyDetails}
                    onChange={e => setFormData({...formData, vacancyDetails: e.target.value})}
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>

                <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded hover:bg-green-700">
                  Publish Vacancy
                </button>
              </form>

              <h2 className="text-xl font-bold mb-4 border-b pb-2">Recent Vacancies</h2>
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                    <div>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded mr-2">{post.category}</span>
                      <span className="font-semibold text-sm">{post.title}</span>
                    </div>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {posts.length === 0 && <p className="text-sm text-gray-500">No vacancies added yet.</p>}
              </div>

            </div>
          )}

          {activeTab === "highlights" && (
            <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">Manage Highlight Jobs (Top Alerts)</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {(settings.topAlerts || []).map((alert, index) => (
                  <div key={alert.id} className="border p-4 rounded bg-gray-50 flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                      <span className="font-bold">Highlight #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newAlerts = [...(settings.topAlerts || [])];
                          newAlerts.splice(index, 1);
                          setSettings({ ...settings, topAlerts: newAlerts });
                        }}
                        className="text-red-600 font-semibold text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Title</label>
                      <input
                        type="text"
                        value={alert.title}
                        onChange={(e) => {
                          const newAlerts = [...(settings.topAlerts || [])];
                          newAlerts[index].title = e.target.value;
                          setSettings({ ...settings, topAlerts: newAlerts });
                        }}
                        className="w-full border p-2 rounded"
                        placeholder="e.g. Railway RRB Technician Recruitment 2026"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Color Classes (Tailwind)</label>
                        <input
                          type="text"
                          value={alert.color}
                          onChange={(e) => {
                            const newAlerts = [...(settings.topAlerts || [])];
                            newAlerts[index].color = e.target.value;
                            setSettings({ ...settings, topAlerts: newAlerts });
                          }}
                          className="w-full border p-2 rounded font-mono text-sm"
                          placeholder="bg-yellow-300 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Link URL</label>
                        <input
                          type="text"
                          value={alert.link}
                          onChange={(e) => {
                            const newAlerts = [...(settings.topAlerts || [])];
                            newAlerts[index].link = e.target.value;
                            setSettings({ ...settings, topAlerts: newAlerts });
                          }}
                          className="w-full border p-2 rounded"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newAlerts = [...(settings.topAlerts || [])];
                    newAlerts.push({
                      id: Date.now().toString(),
                      title: "New Highlight Job",
                      color: "bg-blue-600 text-white",
                      link: "#"
                    });
                    setSettings({ ...settings, topAlerts: newAlerts });
                  }}
                  className="bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded hover:bg-gray-300 text-sm"
                >
                  + Add Highlight Job
                </button>

                <div className="pt-4 border-t border-gray-200">
                  <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700">
                    Save All Highlights
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "categoryAds" && (
            <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">Category Specific Ads</h2>
              <p className="text-sm text-gray-600 mb-6">Set different ad codes or image links for each category block on the homepage.</p>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {CATEGORIES.map((cat, i) => {
                  const existingAd = (settings.categoryAds || []).find(ca => ca.category === cat);
                  const adVal = existingAd ? existingAd.adScript : "";
                  
                  return (
                    <div key={cat} className="border p-4 rounded bg-gray-50">
                      <label className="block text-md font-bold mb-2 text-[#a11728]">{cat} Ad Script / Image Link</label>
                      <textarea
                        rows={3}
                        value={adVal}
                        onChange={(e) => {
                          const newCatAds = [...(settings.categoryAds || [])];
                          const idx = newCatAds.findIndex(ca => ca.category === cat);
                          if (idx >= 0) {
                            newCatAds[idx].adScript = e.target.value;
                          } else {
                            newCatAds.push({ category: cat, adScript: e.target.value });
                          }
                          setSettings({ ...settings, categoryAds: newCatAds });
                        }}
                        className="w-full border p-2 rounded font-mono text-sm"
                        placeholder={`<a href="#"><img src="..." alt="Ad for ${cat}" /></a>\nOR AdSense Script`}
                      />
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t border-gray-200">
                  <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700">
                    Save Category Ads
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "traffic" && (
            <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">Traffic & Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period, i) => {
                  let count = 0;
                  const now = new Date();
                  const trafficCopy = [...traffic].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  
                  if (period === 'Daily') {
                    const todayStr = now.toISOString().split('T')[0];
                    const todayStat = trafficCopy.find(t => t.date === todayStr);
                    count = todayStat ? todayStat.views : 0;
                  } else if (period === 'Weekly') {
                    // last 7 days
                    count = trafficCopy.slice(0, 7).reduce((acc, t) => acc + t.views, 0);
                  } else if (period === 'Monthly') {
                    // last 30 days
                    count = trafficCopy.slice(0, 30).reduce((acc, t) => acc + t.views, 0);
                  } else if (period === 'Yearly') {
                    // last 365 days
                    count = trafficCopy.slice(0, 365).reduce((acc, t) => acc + t.views, 0);
                  }

                  return (
                    <div key={period} className="bg-gray-50 border p-4 text-center rounded">
                      <div className="text-sm text-gray-500 font-bold uppercase">{period} Views</div>
                      <div className="text-3xl font-bold text-[#a11728] mt-2">{count}</div>
                    </div>
                  );
                })}
              </div>

              <h3 className="font-bold mb-2">Recent Daily Stats</h3>
              <div className="border rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border-b">Date</th>
                      <th className="p-3 border-b">Page Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traffic.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 14).map((t, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{t.date}</td>
                        <td className="p-3 border-b font-bold">{t.views}</td>
                      </tr>
                    ))}
                    {traffic.length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-4 text-center text-gray-500">No traffic data recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">Site & Ad Settings</h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Site Name</label>
                    <input 
                      type="text" 
                      value={settings.siteName || ""}
                      onChange={e => setSettings({...settings, siteName: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. Sarkari Exams"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Site Domain</label>
                    <input 
                      type="text" 
                      value={settings.siteDomain || ""}
                      onChange={e => setSettings({...settings, siteDomain: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. sarkariexams.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Promotion Email</label>
                    <input 
                      type="email" 
                      value={settings.promoEmail || ""}
                      onChange={e => setSettings({...settings, promoEmail: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. ranaytabhishek@gmail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Marquee Text (Scrolling text)</label>
                    <input 
                      type="text" 
                      value={settings.marqueeText || ""}
                      onChange={e => setSettings({...settings, marqueeText: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. Sarkari Job Alert : SarkariJobAlert.Com Sarkari Result Latest Jobs Online Form"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Welcome Text</label>
                    <input 
                      type="text" 
                      value={settings.welcomeText || ""}
                      onChange={e => setSettings({...settings, welcomeText: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. Welcome to No. 1 Education Portal SarkariJobAlert.Com Result 2026"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Meta Description (SEO)</label>
                    <textarea 
                      value={settings.metaDescription || ""}
                      onChange={e => setSettings({...settings, metaDescription: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="Sarkari Job Alert - Latest Jobs, Admit Cards, Results."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Meta Keywords (SEO)</label>
                    <textarea 
                      value={settings.metaKeywords || ""}
                      onChange={e => setSettings({...settings, metaKeywords: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="Sarkari, Job, Results, Admit Card"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Google AdSense Publisher ID</label>
                    <input 
                      type="text" 
                      value={settings.adsenseId || ""}
                      onChange={e => setSettings({...settings, adsenseId: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. ca-pub-1234567890123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave blank to disable. AdSense script will be injected automatically.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">WhatsApp Group Link</label>
                  <input 
                    type="url" 
                    value={settings.whatsappLink || ""}
                    onChange={e => setSettings({...settings, whatsappLink: e.target.value})}
                    className="w-full border p-2 rounded" 
                    placeholder="https://chat.whatsapp.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Instagram Profile Link</label>
                  <input 
                    type="url" 
                    value={settings.instagramLink || ""}
                    onChange={e => setSettings({...settings, instagramLink: e.target.value})}
                    className="w-full border p-2 rounded" 
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Telegram Channel Link</label>
                  <input 
                    type="url" 
                    value={settings.telegramLink || ""}
                    onChange={e => setSettings({...settings, telegramLink: e.target.value})}
                    className="w-full border p-2 rounded" 
                    placeholder="https://t.me/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Ad Delay (Seconds)</label>
                  <p className="text-xs text-gray-500 mb-2">Wait time before redirecting users to the job details page.</p>
                  <input 
                    type="number" min="0" max="30"
                    value={settings.adDelay}
                    onChange={e => setSettings({...settings, adDelay: parseInt(e.target.value) || 0})}
                    className="w-full md:w-1/3 border p-2 rounded" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Ad Code (HTML / Google AdSense Script)</label>
                  <p className="text-xs text-gray-500 mb-2">Paste your AdSense snippet or custom ad HTML here.</p>
                  <textarea 
                    rows={8}
                    value={settings.adScript}
                    onChange={e => setSettings({...settings, adScript: e.target.value})}
                    className="w-full border p-2 rounded font-mono text-sm bg-gray-50"
                  />
                </div>

                <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700">
                  Save Settings
                </button>
              </form>

              <div className="mt-12 border-t pt-8">
                <h3 className="text-xl font-bold mb-2 text-[#a11728]">Export Source Code</h3>
                <p className="text-gray-600 mb-4">
                  Download the complete source code of your website as a ZIP file. This includes all your latest changes, settings, and features, and is fully compatible with GitHub and other hosting platforms.
                </p>
                <a 
                  href="/api/export-zip" 
                  download
                  className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download Source Code (ZIP)
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
