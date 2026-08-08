import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [siteName, setSiteName] = useState("Sarkari Job Alert");
  const [siteDomain, setSiteDomain] = useState("sarkarijobalert.site");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.siteName) setSiteName(data.siteName);
        if (data.siteDomain) setSiteDomain(data.siteDomain);
        if (data.siteName) document.title = data.siteName;
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <header className="bg-[#a11728] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-[#a11728] rounded-full flex items-center justify-center border-2 border-white shadow-md relative shrink-0">
             <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-dashed border-[#a11728] flex flex-col items-center justify-center text-[10px] md:text-xs font-bold leading-tight text-center uppercase overflow-hidden p-1">
               {siteName.split(' ').slice(0, 2).map((word, i) => <span key={i} className="truncate w-full">{word}</span>)}
             </div>
          </div>
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">{siteName}</h1>
            <div className="flex items-center mt-1">
              <div className="h-[1px] w-8 bg-white opacity-70"></div>
              <p className="text-sm md:text-base px-2 font-medium">{siteDomain.toLowerCase()}</p>
              <div className="h-[1px] w-8 bg-white opacity-70"></div>
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm md:text-base font-medium uppercase">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <a href="/#Latest-Jobs" className="hover:text-gray-300">Latest Jobs</a>
          <a href="/#Results" className="hover:text-gray-300">Results</a>
          <a href="/#Admit-Card" className="hover:text-gray-300">Admit Card</a>
          <a href="/#Answer-Key" className="hover:text-gray-300">Answer Key</a>
          <a href="/#Admission" className="hover:text-gray-300">Admission</a>
          <Link to="/admin/login" className="hover:text-gray-300">Admin</Link>
          <Link to="/search" className="hover:text-gray-300 ml-2">
            <Search className="w-4 h-4 cursor-pointer" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
