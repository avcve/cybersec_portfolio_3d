import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { events } from "../constants";
import CylinderCanvas from "./canvas/CylinderCanvas";
import {
  griffin_cabal_weekly_1,
  griffin_cabal_weekly_2,
  griffin_cabal_weekly_3,
  CyberSecuritySpaces,
  WebDevTutoring,
  OrochiTraining
} from "../assets";

// Build the array of 20 images to populate the 3D instanced mesh cylinder
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

const Events = () => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [galleryMode, setGalleryMode] = useState("cybersec");

  const activeEvent = events[activeEventIndex];

  const handleNext = () => {
    setActiveEventIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    setActiveEventIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <>
      <motion.div>
        <p className={styles.sectionSubText}>My communities & workshops</p>
        <h2 className={styles.sectionHeadText}>Events & Mentorship</h2>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch min-h-[550px]">
        {/* Left Side: Dynamic Event Information Card */}
        <div className="flex flex-col justify-between bg-black-200/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-card relative overflow-hidden transition-colors duration-500">
          {/* Subtle neon glowing ambient background */}
          <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full transition-all duration-700 blur-[80px] ${
            galleryMode === "cybersec" ? "bg-[#6df4ce] opacity-5" : "bg-purple-500 opacity-10"
          }`} />
          <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full transition-all duration-700 blur-[80px] ${
            galleryMode === "cybersec" ? "bg-purple-500 opacity-5" : "bg-blue-500 opacity-10"
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

                <h3 className="text-white font-black text-[24px] sm:text-[30px] mt-4 leading-tight">
                  {activeEvent.title}
                </h3>

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

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handlePrev}
              className={`w-10 h-10 rounded-full border border-white/10 flex justify-center items-center text-white hover:bg-white/5 transition-all duration-300 active:scale-95 ${
                galleryMode === "cybersec" ? "hover:border-[#6df4ce]/50 hover:text-[#6df4ce]" : "hover:border-purple-500/50 hover:text-purple-300"
              }`}
              aria-label="Previous event"
            >
              ←
            </button>
            <span className="text-secondary font-mono text-[14px] tracking-widest select-none">
              0{activeEventIndex + 1} / 0{events.length}
            </span>
            <button
              onClick={handleNext}
              className={`w-10 h-10 rounded-full border border-white/10 flex justify-center items-center text-white hover:bg-white/5 transition-all duration-300 active:scale-95 ${
                galleryMode === "cybersec" ? "hover:border-[#6df4ce]/50 hover:text-[#6df4ce]" : "hover:border-purple-500/50 hover:text-purple-300"
              }`}
              aria-label="Next event"
            >
              →
            </button>
          </div>
        </div>

        {/* Right Side: Interactive 3D Cylindrical Gallery */}
        <div className="h-[400px] sm:h-[500px] lg:h-auto w-full bg-black-100/20 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
          
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
      </div>
    </>
  );
};

export default SectionWrapper(Events, "events");
