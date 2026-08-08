import React, { useState, useEffect, useRef } from "react";
import { AppSettings } from "../types";

export default function AdOverlay({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: AppSettings) => {
        setSettings(data);
        if (data.adDelay > 0) {
          setTimeLeft(data.adDelay);
        } else {
          setTimeLeft(0);
        }
      });
  }, []);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (settings?.adScript && adContainerRef.current) {
      adContainerRef.current.innerHTML = "";
      const fragment = document.createRange().createContextualFragment(settings.adScript);
      adContainerRef.current.appendChild(fragment);
    }
  }, [settings?.adScript, timeLeft]);

  if (timeLeft === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (timeLeft > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Please wait {timeLeft} seconds to view the job details...</h2>
        {settings?.adScript && (
          <div 
            ref={adContainerRef}
            className="w-full max-w-3xl bg-white border border-gray-300 p-4 shadow-sm overflow-hidden flex justify-center"
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}
