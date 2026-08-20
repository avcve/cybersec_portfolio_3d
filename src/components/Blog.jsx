import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { blogUrl } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const Blog = () => {
  return (
    <div className="cursor-feather">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Publications & Insights</p>
        <h2 className={styles.sectionHeadText}>My Blog.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("up", "tween", 0.1, 1)}
        className="mt-8 w-full bg-black-200/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 hover:border-white/20 transition-all duration-500 relative overflow-hidden group"
      >
        {/* Specular highlight sweep on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />

        {/* Ambient radial glows in the background of the card */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] bg-[#804dee] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] bg-white opacity-5 pointer-events-none" />

        {/* Left Side: Copy and CTA */}
        <div className="flex-1 flex flex-col gap-4 text-center md:text-left z-10">
          <h3 className="text-white font-bold text-[24px] sm:text-[28px]">
            Offensive Security & Web3 Writeups
          </h3>
          <p className="text-secondary text-[16px] max-w-2xl leading-[28px]">
            I write a blog sharing deep-dives into smart contract auditing, OWASP Top 10 vulnerabilities, custom security tooling, and post-mortems of live exploits. You can check out my latest writeups and technical research.
          </p>

          <div className="mt-4 flex justify-center md:justify-start">
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 rounded-xl font-mono text-[14px] uppercase tracking-wider text-center font-bold bg-transparent text-white border border-white/20 hover:border-white/60 hover:bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-300 block"
            >
              Explore Writeups on 0xReaper →
            </a>
          </div>
        </div>

        {/* Right Side: Glowing Fountain Pen Vector Graphic */}
        <div className="relative flex justify-center items-center w-36 h-36 shrink-0 z-10">
          {/* Backplate Glow */}
          <div className="absolute inset-0 bg-[#804dee] rounded-full blur-[30px] opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          
          {/* Framed Circle */}
          <div className="w-28 h-28 rounded-full border border-white/10 bg-black/40 flex justify-center items-center group-hover:border-white/20 transition-colors duration-500">
            <svg
              viewBox="0 0 64 64"
              className="w-16 h-16 transform -rotate-12 group-hover:scale-105 group-hover:rotate-6 transition-all duration-500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 12,12 L 48,48" stroke="#804dee" stroke-width="6" stroke-linecap="round" opacity="0.3" filter="url(#pen-glow)" />

              <path d="M 12,12 C 11.2,14 9.5,17 9.5,20 L 14.5,20 C 14.5,17 12.8,14 12,12 Z" fill="url(#illustSilver)" stroke="#888888" stroke-width="0.3" transform="translate(12,12) rotate(-45, 12, 12)" />
              <path d="M 12,13.2 C 11.5,14.7 10.4,17 10.4,20 L 13.6,20 C 13.6,17 12.5,14.7 12,13.2 Z" fill="url(#illustGold)" transform="translate(12,12) rotate(-45, 12, 12)" />
              <line x1="12" y1="12" x2="12" y2="17.5" stroke="#1a1a1a" stroke-width="0.5" transform="translate(12,12) rotate(-45, 12, 12)" />
              <circle cx="12" cy="17.5" r="0.55" fill="#1a1a1a" transform="translate(12,12) rotate(-45, 12, 12)" />

              <path d="M 9.5,20 L 10,24.5 L 14,24.5 L 14.5,20 Z" fill="url(#illustGrip)" stroke="#1a1a1a" stroke-width="0.3" transform="translate(12,12) rotate(-45, 12, 12)" />

              <path d="M 9.9,24.5 L 9.8,25.5 L 14.2,25.5 L 14.1,24.5 Z" fill="url(#illustGold)" transform="translate(12,12) rotate(-45, 12, 12)" />

              <path d="M 9.8,25.5 C 9.5,30 9.6,34 10.4,38.5 L 13.6,38.5 C 14.4,34 14.5,30 14.2,25.5 Z" fill="url(#illustPurple)" stroke="#2b1461" stroke-width="0.4" transform="translate(12,12) rotate(-45, 12, 12)" />

              <path d="M 10.4,38.5 L 10.8,40.5 L 13.2,40.5 L 13.6,38.5 Z" fill="url(#illustGold)" stroke="#443311" stroke-width="0.3" transform="translate(12,12) rotate(-45, 12, 12)" />

              <defs>
                <filter id="pen-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
                
                <linearGradient id="illustSilver" x1="9.5" y1="16" x2="14.5" y2="16" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#777777" />
                  <stop offset="25%" stop-color="#cccccc" />
                  <stop offset="55%" stop-color="#ffffff" />
                  <stop offset="85%" stop-color="#bbbbbb" />
                  <stop offset="100%" stop-color="#666666" />
                </linearGradient>

                <linearGradient id="illustGold" x1="9.9" y1="25" x2="14.1" y2="25" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#b8860b" />
                  <stop offset="25%" stop-color="#e5c158" />
                  <stop offset="55%" stop-color="#fff5bd" />
                  <stop offset="85%" stop-color="#d4af37" />
                  <stop offset="100%" stop-color="#aa7c11" />
                </linearGradient>

                <linearGradient id="illustGrip" x1="9.5" y1="22" x2="14.5" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#1c1c1c" />
                  <stop offset="30%" stop-color="#444444" />
                  <stop offset="60%" stop-color="#666666" />
                  <stop offset="85%" stop-color="#333333" />
                  <stop offset="100%" stop-color="#151515" />
                </linearGradient>

                <linearGradient id="illustPurple" x1="9.5" y1="32" x2="14.5" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#2d1460" />
                  <stop offset="25%" stop-color="#552aa6" />
                  <stop offset="55%" stop-color="#cbb5ff" />
                  <stop offset="75%" stop-color="#804dee" />
                  <stop offset="100%" stop-color="#1b0840" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Blog, "blog");
