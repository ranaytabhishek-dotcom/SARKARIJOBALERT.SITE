import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { JobPost, AppSettings } from "../types";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs").then(res => res.json()),
      fetch("/api/settings").then(res => res.json())
    ])
    .then(([postsData, settingsData]) => {
      setPosts(postsData);
      setSettings(settingsData);
    })
    .catch(e => console.error(e))
    .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q) {
      setSearchParams({ q });
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(query.toLowerCase()) || 
    post.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Search Results - {settings?.siteName || "Sarkari Job Alert"}</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input 
            type="text" 
            name="q" 
            defaultValue={query}
            placeholder="Search for jobs, results, admit cards..." 
            className="flex-1 border border-gray-300 rounded p-3 text-lg focus:outline-none focus:border-[#a11728]"
            autoFocus
          />
          <button type="submit" className="bg-[#a11728] text-white px-6 rounded font-bold hover:bg-[#801220] transition-colors flex items-center gap-2">
            <SearchIcon className="w-5 h-5" /> Search
          </button>
        </form>

        <h1 className="text-2xl font-bold mb-6 border-b pb-2">
          {query ? `Search Results for "${query}"` : "All Updates"}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#a11728]" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="bg-white rounded border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {filteredPosts.map(post => (
                <li key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <Link to={`/job/${post.id}`} className="block">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-blue-700 hover:underline">{post.title}</h3>
                        <div className="text-sm text-gray-500 mt-1 font-medium">{post.category}</div>
                      </div>
                      {post.statusText && (
                        <span className="text-[#ff0000] font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100 whitespace-nowrap ml-4">
                          {post.statusText}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded border border-gray-200">
            <p className="text-gray-500 text-lg">No results found for "{query}".</p>
            <p className="text-sm text-gray-400 mt-2">Try different keywords or browse categories on the homepage.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
