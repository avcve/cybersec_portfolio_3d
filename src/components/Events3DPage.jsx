import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "../constants";
import CylinderCanvas from "./canvas/CylinderCanvas";
import { StarsCanvas } from "./canvas";

// Build the array of 20 images to populate the 3D instanced mesh cylinder
import {
  griffin_cabal_weekly_1,
  griffin_cabal_weekly_2,
  griffin_cabal_weekly_3,
  CyberSecuritySpaces,
  WebDevTutoring,
  OrochiTraining
} from "../assets";

const galleryImages = [
  griffin_cabal_weekly_1,
  griffin_cabal_weekly_2,
  griffin_cabal_weekly_3,
  CyberSecuritySpaces,
  WebDevTutoring,
  OrochiTraining,
  
  griffin_cabal_weekly_1,
  griffin_cabal_weekly_2,
  griffin_cabal_weekly_3,
  CyberSecuritySpaces,
  WebDevTutoring,
  OrochiTraining,
  
  griffin_cabal_weekly_1,
  griffin_cabal_weekly_2,
  griffin_cabal_weekly_3,
  CyberSecuritySpaces,
  WebDevTutoring,
  OrochiTraining,
  
  griffin_cabal_weekly_1,
  griffin_cabal_weekly_2
];

const Events3DPage = () => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [galleryMode, setGalleryMode] = useState("cybersec");

  const activeEvent = events[activeEventIndex];

  return (
    <div className="relative w-screen min-h-screen bg-primary overflow-x-hidden flex flex-col justify-between z-0">
      {/* Stars Background */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Cybersecurity Cyber-Grid Background Effect */}
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%] opacity-30 pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-white font-mono text-[14px] uppercase tracking-wider hover:text-[#6df4ce] transition-colors duration-300 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span> Back to Home
        </Link>
        <div className="text-right">
          <p className="text-secondary font-mono text-[11px] uppercase tracking-widest">Interactive Gallery</p>
          <h1 className="text-white font-black text-[20px] tracking-wide">3D EVENTS SHOWCASE</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-4 z-10">
        {/* Left Side: Dynamic Event Information Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-black-200/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden min-h-[480px]">
          {/* Subtle neon glowing ambient background */}
          <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full transition-all duration-700 blur-[80px] ${
            galleryMode === "cybersec" ? "bg-[#6df4ce] opacity-10" : "bg-purple-500 opacity-20"
          }`} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeEventIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className={`font-mono text-[13px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border transition-all duration-500 ${
                    galleryMode === "cybersec"
                      ? "text-[#6df4ce] bg-[#6df4ce]/10 border-[#6df4ce]/20"
                      : "text-purple-300 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                  }`}>
                    {activeEvent.company}
                  </span>
                  <span className="text-secondary font-mono text-[13px] uppercase tracking-wider">
                    {activeEvent.role}
                  </span>
                </div>

                <h2 className="text-white font-black text-[28px] sm:text-[34px] mt-4 leading-tight">
                  {activeEvent.title}
                </h2>

                <p className="text-secondary text-[15px] sm:text-[16px] mt-4 leading-[26px]">
                  {activeEvent.description}
                </p>

                <ul className="mt-6 list-none space-y-3">
                  {activeEvent.points.map((point, index) => (
                    <li
                      key={`point-${index}`}
                      className="text-white-100 text-[14px] leading-[22px] flex items-start gap-2"
                    >
                      <span className={`mt-[6px] text-[10px] transition-colors duration-500 ${
                        galleryMode === "cybersec" ? "text-[#6df4ce]" : "text-purple-400"
                      }`}>■</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
            <span className="text-secondary font-mono text-[14px] tracking-widest select-none">
              EVENT 0{activeEventIndex + 1} / 0{events.length}
            </span>
          </div>
        </div>

        {/* Right Side: Interactive 3D Cylindrical Gallery */}
        <div className="lg:col-span-7 h-[500px] lg:h-[600px] w-full bg-black-100/10 backdrop-blur-sm rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center shadow-2xl">
          
          {/* Cybersec / Media Mode Switcher Overlay */}
          <div className="absolute top-4 right-4 z-10 flex items-center bg-black/60 border border-white/10 backdrop-blur-md rounded-full p-1 select-none font-mono text-[9px] sm:text-[10px] uppercase tracking-wider shadow-lg">
            <button
              type="button"
              onClick={() => setGalleryMode("cybersec")}
              className={`px-2.5 py-1 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                galleryMode === "cybersec"
                  ? "bg-[#6df4ce]/20 text-[#6df4ce] border border-[#6df4ce]/30 shadow-[0_0_10px_rgba(109,244,206,0.2)]"
                  : "text-secondary hover:text-white border border-transparent"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${galleryMode === "cybersec" ? "bg-[#6df4ce] animate-pulse" : "bg-gray-600"}`} />
              Cybersec
            </button>
            <button
              type="button"
              onClick={() => setGalleryMode("media")}
              className={`px-2.5 py-1 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                galleryMode === "media"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  : "text-secondary hover:text-white border border-transparent"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${galleryMode === "media" ? "bg-purple-400 animate-pulse" : "bg-gray-600"}`} />
              Media
            </button>
          </div>

          <CylinderCanvas
            images={galleryImages}
            onActiveEventChange={setActiveEventIndex}
            mode={galleryMode}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-secondary font-mono text-[11px] uppercase tracking-widest opacity-50">
        © {new Date().getFullYear()} • Interactive WebGL Cylindrical Gallery
      </footer>
    </div>
  );
};

export default Events3DPage;
