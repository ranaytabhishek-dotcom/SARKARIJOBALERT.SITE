import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PageLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Helmet><title>{title}</title></Helmet>
    <Header />
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <div className="bg-white p-8 rounded shadow border border-gray-200">
        <h1 className="text-3xl font-bold text-[#a11728] mb-6 border-b pb-2">{title}</h1>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export const About = () => (
  <PageLayout title="About Us">
    <p>Welcome to our platform. We are dedicated to providing the latest and most accurate information on government jobs, results, admit cards, and educational updates.</p>
    <p className="mt-4">Our mission is to help candidates achieve their career goals by delivering timely and reliable notifications about various recruitment processes across the country.</p>
  </PageLayout>
);

export const Contact = () => (
  <PageLayout title="Contact Us">
    <p>If you have any questions, suggestions, or feedback, please feel free to reach out to us.</p>
    <p className="mt-4"><strong>Email For Queries & Promotion:</strong> <a href="mailto:ranaytabhishek@gmail.com" className="text-blue-600 hover:underline">ranaytabhishek@gmail.com</a></p>
  </PageLayout>
);

export const Privacy = () => (
  <PageLayout title="Privacy Policy">
    <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
    <h3 className="text-xl font-bold mt-6 mb-2 text-gray-900">Log Files</h3>
    <p>Like many other Web sites, we make use of log files. The information inside the log files includes internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends, administer the site, track user's movement around the site, and gather demographic information.</p>
    <h3 className="text-xl font-bold mt-6 mb-2 text-gray-900">Cookies and Web Beacons</h3>
    <p>We do use cookies to store information about visitors' preferences, record user-specific information on which pages the user access or visit, customize Web page content based on visitors browser type or other information that the visitor sends via their browser.</p>
    <h3 className="text-xl font-bold mt-6 mb-2 text-gray-900">Google AdSense (Future Implementation)</h3>
    <p>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
  </PageLayout>
);

export const Disclaimer = () => (
  <PageLayout title="Disclaimer">
    <p>The examination results / marks published on this website are only for the immediate information to the examinees and do not constitute to be a legal document.</p>
    <p className="mt-4">While all efforts have been made to make the information available on this website as authentic as possible, we are not responsible for any inadvertent error that may have crept in the examination results / marks being published in this website.</p>
    <p className="mt-4">We advise all candidates to verify the final results, admit cards, and job notifications with the official websites of the respective organizations.</p>
  </PageLayout>
);
