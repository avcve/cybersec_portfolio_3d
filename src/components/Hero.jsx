import { motion } from 'framer-motion';
import { styles } from '../styles';
import ComputersCanvas from './canvas/Computers'; // default import

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      
      {/* Responsive two-column wrapper */}
      <div className={`${styles.paddingX} max-w-7xl mx-auto w-full h-full flex md:flex-row flex-col justify-between items-center gap-5 relative z-10`}>
        
        {/* Left Column: Text & Indicator */}
        <div className="flex flex-row items-start gap-5 w-full md:w-1/2 pt-[120px] md:pt-0">
          <div className="flex flex-col justify-center items-center mt-5">
            <div className="w-5 h-5 rounded-full bg-[#915eff]" />
            <div className="w-1 sm:h-48 h-32 bg-gradient-to-b from-[#915eff] via-purple-500 to-transparent" />
          </div>

          <div>
            <h1 className={`${styles.heroHeadText} text-white`}>
              Hi, I'm <span className="text-[#915eff]">Avcve</span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-gray-200`}>
              Founder of <span className="text-[#915eff]">Griffin Cabal</span>  cybersecurity researcher, smart contract auditor, and offensive tool builder
            </p>
          </div>
        </div>

        {/* Right Column: 3D Canvas */}
        <div className="w-full md:w-1/2 flex-1 md:h-[80%] lg:h-[90%] flex justify-center items-center relative z-0">
          <ComputersCanvas />
        </div>

      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-5 xs:bottom-10 w-full flex justify-center items-center z-20 pointer-events-none"
      >
        <a href="#about" className="pointer-events-auto">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-gray-500 flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
              className="w-3 h-3 rounded-full bg-gray-500 mb-1"
            />
          </div>
        </a>
      </div>

    </section>
  );
};

export default Hero;
