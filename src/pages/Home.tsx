import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, MessageCircle, Instagram, Send, ChevronRight, Hand } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { JobPost, Category, TopAlert } from "../types";

const CATEGORIES: Category[] = [
  "Results", 
  "Admit Card", 
  "Latest Jobs", 
  "Answer Key", 
  "Board Update", 
  "University Update",
  "Sarkari Yojana",
  "Admission",
  "Scholarship"
];

// Fallback Mock Top Alerts
const FALLBACK_TOP_ALERTS: TopAlert[] = [
  { id: "1", title: "Railway RRB Technician Recruitment 2026", color: "bg-yellow-300 text-black", link: "#" },
  { id: "2", title: "IAF Agniveervayu Musician Recruitment 2026", color: "bg-amber-900 text-white", link: "#" },
  { id: "3", title: "BPSC 72nd Pre Admit Card (1189 Posts)", color: "bg-green-600 text-white", link: "#" },
  { id: "4", title: "JNU Non-Teaching Recruitment 2026 For 215 Post", color: "bg-blue-600 text-white", link: "#" },
  { id: "5", title: "SSC CGL Online Form 2026 (12,256 Posts) – Start", color: "bg-blue-600 text-white", link: "#" },
  { id: "6", title: "Railway RRB Group D Admit Card 2026 For 22,195 Post", color: "bg-green-600 text-white", link: "#" },
  { id: "7", title: "UP Police Constable Result 2026 For 32,679 Post", color: "bg-amber-900 text-white", link: "#" },
  { id: "8", title: "Bihar Home Guard Vacancy 2026 (13,500+ Post)", color: "bg-yellow-300 text-black", link: "#" },
];

export default function Home() {
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [socialLinks, setSocialLinks] = useState({ whatsapp: "#", instagram: "#", telegram: "#" });
  const [topAlerts, setTopAlerts] = useState<TopAlert[]>(FALLBACK_TOP_ALERTS);

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data));
      
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setSocialLinks({
          whatsapp: data.whatsappLink || "#",
          instagram: data.instagramLink || "#",
          telegram: data.telegramLink || "#"
        });
        if (data.topAlerts && data.topAlerts.length > 0) {
          setTopAlerts(data.topAlerts);
        }
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>{settings?.siteName || "Sarkari Exams"}</title>
        <meta name="description" content={settings?.metaDescription || "Sarkari Job Alert - Latest Jobs, Admit Cards, Results."} />
        <meta name="keywords" content={settings?.metaKeywords || "Sarkari, Job, Results, Admit Card"} />
      </Helmet>
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 md:px-4 py-4">
        
        {/* Marquee */}
        <div className="mb-4 overflow-hidden py-1 border-y border-gray-200">
           <marquee className="text-lg md:text-xl font-bold font-sans text-[#a11728]">
              {settings?.marqueeText || `${settings?.siteName || "Sarkari Job Alert"} : ${settings?.siteDomain || "SarkariJobAlert.com"} Sarkari Result Latest Jobs Online Form`}
           </marquee>
        </div>

        {/* Welcome Text */}
        <h2 className="text-center text-[#ff0000] font-bold text-lg md:text-2xl mb-4">
          {settings?.welcomeText || `Welcome to No. 1 Education Portal ${settings?.siteDomain || "SarkariJobAlert.Com"} Result 2026`}
        </h2>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <Link to="/" className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-sm font-bold w-full md:w-auto justify-center hover:bg-blue-50">
            <CheckCircle2 className="w-5 h-5" />
            सरकारी काम
          </Link>
          <Link to="/" className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-sm font-bold w-full md:w-auto justify-center hover:bg-blue-50">
            <CheckCircle2 className="w-5 h-5" />
            Board Result
          </Link>
          <Link to="/" className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-sm font-bold w-full md:w-auto justify-center hover:bg-blue-50">
            <CheckCircle2 className="w-5 h-5" />
            सरकारी योजना
          </Link>
        </div>

        {/* Colorful Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] mb-4">
          {topAlerts.map((alert, idx) => (
            <a href={alert.link || "#"} target={alert.link && alert.link !== "#" ? "_blank" : "_self"} rel="noopener noreferrer" key={alert.id || idx} className={`${alert.color} p-2 text-center text-sm md:text-base font-bold flex items-center justify-center min-h-[60px] border border-white hover:opacity-90 cursor-pointer`}>
               {alert.title}
            </a>
          ))}
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mb-6">
          <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-[#4CAF50] text-white py-2 flex items-center justify-center gap-2 font-bold text-lg hover:opacity-90">
            <MessageCircle className="w-6 h-6" /> Join WhatsApp
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="bg-[#E1306C] text-white py-2 flex items-center justify-center gap-2 font-bold text-lg hover:opacity-90">
            <Instagram className="w-6 h-6" /> Follow Instagram
          </a>
          <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="bg-[#2CA5E0] text-white py-2 flex items-center justify-center gap-2 font-bold text-lg hover:opacity-90">
            <Send className="w-6 h-6" /> Join Telegram
          </a>
        </div>

        {/* Main Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map(category => (
            <div id={category.replace(/\s+/g, '-')} key={category} className="border-2 border-[#a11728] bg-white flex flex-col relative pb-10">
              <div className="bg-[#a11728] text-white text-center py-2 text-xl font-bold">
                {category}
              </div>
              <ul className="p-3 space-y-2.5 text-sm flex-1">
                {posts
                  .filter(post => post.category === category)
                  .map((post) => (
                    <li key={post.id} className="flex items-start gap-2 border-b border-gray-300 border-dashed pb-2 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e60026] shrink-0 mt-1.5"></div>
                      <div className="leading-snug flex-1">
                        <Link to={`/job/${post.id}`} className="text-blue-700 hover:underline font-bold text-[14px]">
                          {post.title}
                        </Link>
                        {post.statusText && (
                          <span className="text-[#ff0000] font-bold ml-1 text-[13px]">{post.statusText}</span>
                        )}
                      </div>
                    </li>
                  ))}
                {posts.filter(post => post.category === category).length === 0 && (
                  <li className="text-gray-500 italic">No updates available.</li>
                )}
              </ul>
              
              {/* View More Button */}
              <Link 
                to={`/category/${category.toLowerCase().replace(/ /g, '-')}`}
                className="absolute bottom-2 right-2 bg-[#e60026] text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1 hover:bg-red-700"
              >
                <Hand className="w-3 h-3 rotate-90" /> View More
              </Link>
              
              {/* Category Ad */}
              {settings?.categoryAds?.find((ca: any) => ca.category === category)?.adScript && (
                <div 
                  className="mt-6 border-t-2 border-dashed border-[#a11728] pt-2"
                  dangerouslySetInnerHTML={{ __html: settings.categoryAds.find((ca: any) => ca.category === category).adScript }}
                />
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
