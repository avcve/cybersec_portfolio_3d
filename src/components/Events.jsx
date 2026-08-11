import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { events } from "../constants";

const Events = () => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const activeEvent = events[activeEventIndex];

  const handleNext = () => {
    setActiveEventIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    setActiveEventIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  // Reset activeImgIndex when activeEventIndex changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [activeEventIndex]);

  // Slideshow auto-rotation for multi-image events
  useEffect(() => {
    if (activeEvent.images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % activeEvent.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeEvent]);

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
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full transition-all duration-700 blur-[80px] bg-[#6df4ce] opacity-5" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full transition-all duration-700 blur-[80px] bg-purple-500 opacity-5" />

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
                  <span className="font-mono text-[13px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border text-[#6df4ce] bg-[#6df4ce]/10 border-[#6df4ce]/20">
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
                      <span className="mt-[6px] text-[10px] text-[#6df4ce]">■</span>
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
              className="w-10 h-10 rounded-full border border-white/10 flex justify-center items-center text-white hover:bg-white/5 transition-all duration-300 active:scale-95 hover:border-[#6df4ce]/50 hover:text-[#6df4ce]"
              aria-label="Previous event"
            >
              ←
            </button>
            <span className="text-secondary font-mono text-[14px] tracking-widest select-none">
              0{activeEventIndex + 1} / 0{events.length}
            </span>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-white/10 flex justify-center items-center text-white hover:bg-white/5 transition-all duration-300 active:scale-95 hover:border-[#6df4ce]/50 hover:text-[#6df4ce]"
              aria-label="Next event"
            >
              →
            </button>
          </div>
        </div>

        {/* Right Side: Premium 2D Visual Summary Card */}
        <div className="flex flex-col justify-between bg-black-200/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-card relative overflow-hidden h-[450px] sm:h-[500px] lg:h-auto">
          {/* Glowing neon bg gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] bg-gradient-to-tr from-[#6df4ce] to-[#bf61ff] opacity-10 pointer-events-none" />

          {/* Event Preview Image Slide */}
          <div className="relative flex-1 w-full rounded-xl overflow-hidden border border-white/5 group bg-black/40 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${activeEventIndex}-${activeImgIndex}`}
                src={activeEvent.images[activeImgIndex]}
                alt={`${activeEvent.title} preview`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            {/* Slideshow dot indicators if there are multiple images */}
            {activeEvent.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {activeEvent.images.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeImgIndex ? "bg-[#6df4ce] w-4" : "bg-white/40"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Premium Call to Action */}
          <Link
            to="/events"
            className="w-full mt-6 py-4 px-6 rounded-xl font-mono text-[13px] uppercase tracking-wider text-center font-bold bg-transparent text-[#6df4ce] border border-[#6df4ce]/30 hover:border-[#6df4ce] hover:bg-[#6df4ce]/10 shadow-[0_0_15px_rgba(109,244,206,0.1)] hover:shadow-[0_0_25px_rgba(109,244,206,0.25)] active:scale-[0.98] transition-all duration-300 block"
          >
            Explore Interactive 3D Gallery →
          </Link>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Events, "events");
