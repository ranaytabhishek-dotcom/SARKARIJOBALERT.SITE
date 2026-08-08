import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [promoEmail, setPromoEmail] = useState("ranaytabhishek@gmail.com");
  const [siteName, setSiteName] = useState("Sarkari Job Alert");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.promoEmail) setPromoEmail(data.promoEmail);
        if (data.siteName) setSiteName(data.siteName);
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <footer className="bg-black text-white text-center py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 text-sm font-semibold text-gray-300">
          <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
        <p className="text-xs text-gray-400 mt-2">
          Disclaimer: The examination results / marks published on this website are only for the immediate information to the examinees and do not constitute to be a legal document.
        </p>
        <p className="text-sm mt-4 font-bold">
          For Promotion Contact: <a href={`mailto:${promoEmail}`} className="text-yellow-400 hover:underline">{promoEmail}</a>
        </p>
      </div>
    </footer>
  );
}
