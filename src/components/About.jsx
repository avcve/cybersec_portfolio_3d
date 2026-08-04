import React from 'react';
import { Tilt } from "react-tilt";
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { services } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';
import { SectionWrapper } from '../hoc';

const ServiceCard = ({ index, title, icon }) => (
  <Tilt options={{ max: 45, scale: 1, speed: 450 }} className="w-full xs:w-[250px] sm:w-[250px]">
    <motion.div
      variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div className="bg-gray-800 rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
        <img src={icon} alt={title} className="w-28 h-28 object-contain" />
        <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <div
      className="relative z-10 bg-transparent"
      style={{ paddingTop: '30px' }} // manually pushes the section down
    >
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a cybersecurity researcher and the founder of Griffin Cabal — an independent security auditing group currently running active audits on live Web3 projects. My work sits at the intersection of offensive security and engineering: I research vulnerabilities, write audit reports, and build the tools I need when they don't exist — from keyloggers and C2 frameworks in Python to high-performance on-chain tooling in Rust. I train across PortSwigger, Hack The Box, and TryHackMe, and I'm Cyfrin Updraft-trained in smart contract security. On the dev side, I build full-stack applications with React, Node.js, and Solidity. Security isn't just a skill — it's the lens I apply to everything I build.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10 justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
