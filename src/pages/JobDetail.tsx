import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { JobPost } from "../types";

export default function JobDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex flex-col"><Header /><div className="flex-1 flex items-center justify-center text-xl font-bold">Loading Job Details...</div><Footer /></div>;
  
  if (!post) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">Job Post Not Found</h2>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-2 md:px-4 py-8">
        <div className="bg-white border-2 border-[#a11728] shadow-sm mb-8">
          <div className="bg-[#a11728] text-white text-center py-3 px-4">
             <h1 className="text-xl md:text-2xl font-bold">{post.title}</h1>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="font-bold text-lg mb-2 text-[#a11728]">Brief Information:</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.shortDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="bg-[#f2f2f2] p-2 font-bold text-center border-b border-gray-300 text-[#a11728]">Important Dates</div>
                <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: post.importantDates || "N/A" }} />
              </div>
              
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="bg-[#f2f2f2] p-2 font-bold text-center border-b border-gray-300 text-[#a11728]">Application Fee</div>
                <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: post.applicationFee || "N/A" }} />
              </div>
            </div>

            <div className="border border-gray-300 rounded overflow-hidden mb-8">
              <div className="bg-[#f2f2f2] p-2 font-bold text-center border-b border-gray-300 text-[#a11728]">Age Limit</div>
              <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed text-center" dangerouslySetInnerHTML={{ __html: post.ageLimit || "N/A" }} />
            </div>

            <div className="border border-gray-300 rounded overflow-hidden mb-8">
              <div className="bg-[#f2f2f2] p-2 font-bold text-center border-b border-gray-300 text-[#a11728]">Vacancy Details</div>
              <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed text-center" dangerouslySetInnerHTML={{ __html: post.vacancyDetails || "N/A" }} />
            </div>

            <div className="border border-gray-300 rounded overflow-hidden mt-8">
               <div className="bg-[#a11728] text-white p-2 font-bold text-center border-b border-gray-300 text-lg">Important Links</div>
               <div className="flex flex-col text-center md:text-left">
                 <div className="flex flex-col md:flex-row border-b border-gray-200 hover:bg-gray-50 items-center">
                   <div className="p-3 md:w-1/2 font-bold text-gray-800 text-center md:border-r border-gray-200">Official Notification</div>
                   <div className="p-3 md:w-1/2 text-center">
                     <a href={post.officialLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-bold text-lg">Click Here</a>
                   </div>
                 </div>
                 <div className="flex flex-col md:flex-row hover:bg-gray-50 items-center">
                   <div className="p-3 md:w-1/2 font-bold text-gray-800 text-center md:border-r border-gray-200">Official Website</div>
                   <div className="p-3 md:w-1/2 text-center">
                     <a href={post.officialLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-bold text-lg">Click Here</a>
                   </div>
                 </div>
                 {post.applyLink && (
                   <div className="flex flex-col md:flex-row border-t border-gray-200 hover:bg-gray-50 items-center">
                     <div className="p-3 md:w-1/2 font-bold text-gray-800 text-center md:border-r border-gray-200">Apply Online</div>
                     <div className="p-3 md:w-1/2 text-center">
                       <a href={post.applyLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-bold text-lg">Click Here</a>
                     </div>
                   </div>
                 )}
                 {post.admitCardLink && (
                   <div className="flex flex-col md:flex-row border-t border-gray-200 hover:bg-gray-50 items-center">
                     <div className="p-3 md:w-1/2 font-bold text-gray-800 text-center md:border-r border-gray-200">Download Admit Card</div>
                     <div className="p-3 md:w-1/2 text-center">
                       <a href={post.admitCardLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-bold text-lg">Click Here</a>
                     </div>
                   </div>
                 )}
                 {post.resultLink && (
                   <div className="flex flex-col md:flex-row border-t border-gray-200 hover:bg-gray-50 items-center">
                     <div className="p-3 md:w-1/2 font-bold text-gray-800 text-center md:border-r border-gray-200">Download Result</div>
                     <div className="p-3 md:w-1/2 text-center">
                       <a href={post.resultLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-bold text-lg">Click Here</a>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
