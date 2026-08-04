import {
    backend,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    tailwind,
    nodejs,
    git,
    docker,
    orochi,
    syec,
    griffin,
    rigitix,
    syecw,
    slaty,
    da_vid,
    mary,
    tehilla,
    darkpinno,
    vanity,
    threejs,
    python,
    solidity,
    papersagebot,
    woo,
    ai_workflow,
    SecurityResearcher,
    SmartContractAuditor,
    OffensiveTool,
    griffin_cabal_weekly_1,
    griffin_cabal_weekly_2,
    griffin_cabal_weekly_3,
    CyberSecuritySpaces,
    WebDevTutoring,
    OrochiTraining,
} from "../assets";



export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "work",
        title: "Work",
    },
    {
        id: "events",
        title: "Events",
    },
    {
        id: "contact",
        title: "Contact",
    },
];

const services = [
    {
        title: "Security Researcher",
        icon: SecurityResearcher,
    },
    {
        title: "Smart Contract Auditor",
        icon: SmartContractAuditor,
    },
    {
        title: "Fullstack Developer",
        icon: backend,
    },
    {
        title: "Offensive Tool Builder",
        icon: OffensiveTool,
    },
];

const technologies = [
    {
        name: "HTML 5",
        icon: html,
    },
    {
        name: "CSS 3",
        icon: css,
    },
    {
        name: "JavaScript",
        icon: javascript,
    },
    {
        name: "TypeScript",
        icon: typescript,
    },
    {
        name: "React JS",
        icon: reactjs,
    },
    {
        name: "Tailwind CSS",
        icon: tailwind,
    },
    {
        name: "Node JS",
        icon: nodejs,
    },
    {
        name: "python",
        icon: python,
    },
    {
        name: "solidity",
        icon: solidity,
    },
    {
        name: "Three JS",
        icon: threejs,
    },
    {
        name: "git",
        icon: git,
    },
    {
        name: "docker",
        icon: docker,
    },
];

const experiences = [
    {
        title: "Founder & Lead Auditor",
        company_name: "Griffin Cabal",
        icon: griffin,
        iconBg: "#0A0A0F",
        date: "2025 - Present",
        points: [
            "Founded and lead Griffin Cabal, an independent security auditing group focused on smart contract and web application security.",
            "Currently running concurrent audits on 2 live Web3 projects, delivering structured monthly vulnerability reports covering critical, high, and medium severity findings.",
            "Perform manual code reviews alongside automated tooling (Slither, Aderyn, Echidna) to surface logic flaws, reentrancy issues, and access control vulnerabilities.",
            "Built offensive Python security tooling from scratch — including a keylogger with exfiltration capability and a custom C2 framework for red team simulation.",
            "Active on PortSwigger Web Security Academy, Hack The Box, and TryHackMe — covering OWASP Top 10, network pentesting, and privilege escalation paths.",
        ],
    },
    {
        title: "Cybersecurity Intern",
        company_name: "rigitiX (RIGITIX LTD)",
        icon: rigitix,
        iconBg: "#0F0A1E",
        date: "June 2026 - Present",
        points: [
            "Supporting the rigitiX team in strengthening the security posture of their event management and ticketing platform.",
            "Conducting security reviews and audits across backend, APIs, and frontend components to identify and document vulnerabilities.",
            "Reviewing and advising on secure implementation of payment flows, transaction handling, and gateway integrations.",
            "Supporting NDPC data protection compliance efforts and user data handling best practices.",
            "Helping identify and mitigate fraud risks in ticketing, voting, contests, and affiliate systems.",
            "Assisting with secure coding standards, input validation, authentication/authorization, and access control reviews.",
        ],
    },
    {
        title: "Technical Educator",
        company_name: "Slaty",
        icon: slaty,
        iconBg: "#383E56",
        date: "March 2020 - Present",
        points: [
            "Hosted beginner-focused bootcamps and live learning spaces on Rust smart contracts, Solana, and Avalanche development.",
            "Designed and delivered structured curricula simplifying complex Web3 and blockchain concepts for newcomers.",
            "Led the Elite Class bootcamp, mentoring students and guiding hands-on projects from idea to implementation.",
            "Built student showcase platforms and demo galleries to present code, screenshots, and project progress.",
            "Created educational content (threads and videos) that creatively explained advanced Web3 topics and development workflows.",
            "Fostered an active learning community by providing ongoing technical support, feedback, and project reviews.",
        ],
    },
    {
        title: "Regional Ambassador & Content Creator",
        company_name: "Orochi Network",
        icon: orochi,
        iconBg: "#0B0F1A",
        date: "2024 - 2025",
        points: [
            "Represented Orochi Network as a regional ambassador, promoting awareness of ONPROVER and Web3 security tooling across regional and online communities.",
            "Created educational content (threads, visuals, and short-form videos) explaining zero-knowledge proofs and Orochi's technology in simple, engaging ways.",
            "Hosted a Web3 anime-themed community event that blended storytelling, anime culture, and blockchain education to drive engagement and learning.",
            "Supported community growth by onboarding new users, answering technical questions, and guiding developers to relevant documentation and resources.",
            "Recognised by CEO Mary Kieudiem as the highest-quality ambassador representative in the program.",
        ],
    },
    {
        title: "Software Developer",
        company_name: "Southern Yale Educational Consultancy (SYEC)",
        icon: syec,
        iconBg: "#1E2A38",
        date: "2025 - Present",
        points: [
            "Built a responsive website that streamlined visa application submissions and student inquiries.",
            "Created educational content and managed community engagement to promote SYEC programs and services.",
            "Organised and hosted events to increase awareness of study abroad opportunities and educational services.",
            "Worked closely with students and partners to provide guidance and resources for successful program participation.",
        ],
    },
    {
        title: "WOO Network Ambassador (WOO FORCE)",
        company_name: "WOO Network",
        icon: woo,
        iconBg: "#1E1E2F",
        date: "2025 - Present",
        points: [
            "Actively contributed to the growth of the WOO ecosystem as part of the WOO Force ambassador and contributor program.",
            "Created and shared educational content to increase awareness and adoption of WOO Network products and initiatives.",
            "Engaged with community members across social platforms, providing support, insights, and onboarding assistance.",
            "Provided user feedback and market insights to help improve community experience and ecosystem engagement.",
        ],
    },
];

const testimonials = [
    {
        testimonial:
            "We've never seen representation this good from any of our ambassadors keep it up",
        name: "mary kieudiem",
        designation: "CEO",
        company: "Orochi Network",
        image: mary,
    },
    {
        testimonial:
            "I've never met a developer and creator who truly cares about their clients' success like he does.",
        name: "Tehilla Esin",
        designation: "CEO",
        company: "SYEC",
        image: tehilla,
    },
    {
        testimonial:
            "Connected him with multiple dApp projects, and he consistently delivered high-quality results. He's my go-to developer.",
        name: "Da_vidd🍃",
        designation: "CEO",
        company: "D-casino",
        image: da_vid,
    },
];

const projects = [
    {
        name: "MCP Automated Reporting Tool",
        description:
            "An AI-powered workflow automation tool that connects Manus and Notion via MCP to generate and publish structured security audit reports automatically. Eliminates manual formatting and syncs findings directly into Notion workspaces.",
        tags: [
            {
                name: "manus-mcp",
                color: "blue-text-gradient",
            },
            {
                name: "notion-api",
                color: "green-text-gradient",
            },
            {
                name: "ai-automation",
                color: "pink-text-gradient",
            },
        ],
        image: ai_workflow,
        source_code_link: "https://github.com/avcve",
    },
    {
        name: "Whale Vanity Bot",
        description:
            "A high-performance on-chain vanity address generator with a Rust core for speed and a Python interface layer for usability. Enables custom wallet address creation for Web3 users and projects.",
        tags: [
            {
                name: "rust",
                color: "blue-text-gradient",
            },
            {
                name: "python",
                color: "green-text-gradient",
            },
            {
                name: "web3-tooling",
                color: "pink-text-gradient",
            },
        ],
        image: vanity,
        source_code_link: "https://github.com/avcve/whale-vanity-bot",
    },
    {
        name: "Dark Pino Contest",
        description:
            "A Web3-powered raffle store where users purchase products and receive tickets that grant entry into prize raffles. Winners are selected using Chainlink VRF to ensure provably fair, transparent, and tamper-proof randomness.",
        tags: [
            {
                name: "nextjs",
                color: "blue-text-gradient",
            },
            {
                name: "supabase",
                color: "green-text-gradient",
            },
            {
                name: "chainlink-vrf",
                color: "pink-text-gradient",
            },
        ],
        image: darkpinno,
        source_code_link: "https://github.com/avcve/Dark-pinno",
    },
    {
        name: "SYEC",
        description:
            "An educational consultancy platform helping Nigerian students secure study opportunities abroad. SYEC provides guidance for UK and US student visas, including school selection, documentation, and interview preparation.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "tailwindcss",
                color: "pink-text-gradient",
            },
            {
                name: "consultancy-platform",
                color: "green-text-gradient",
            },
        ],
        image: syecw,
        source_code_link: "https://github.com/avcve/SYEC",
    },
    {
        name: "PaperSageBot",
        description:
            "An AI-powered crypto community helper bot that answers FAQs from whitepapers and admin responses. It streamlines support, enhances engagement, and provides accurate, real-time guidance for blockchain communities.",
        tags: [
            {
                name: "python",
                color: "blue-text-gradient",
            },
            {
                name: "discord-bot",
                color: "green-text-gradient",
            },
            {
                name: "AI",
                color: "pink-text-gradient",
            },
        ],
        image: papersagebot,
        source_code_link: "https://github.com/avcve/PaperSageBot",
    },
];

const events = [
    {
        title: "Weekly Security Discussions",
        role: "Initiator & Host",
        company: "Griffin Cabal",
        description: "Leading deep dives into active security research, vulnerability disclosure processes, and security tooling design.",
        points: [
            "Discussing zero-day vulnerabilities, OWASP Top 10 web vulnerabilities, and defensive mitigation strategies.",
            "Analyzing offensive security techniques, proof-of-concepts, and red-teaming scenarios.",
            "Reviewing smart contract auditing methodologies, logic bugs, and reentrancy vectors in Web3 protocols.",
            "Analyzing keylogger designs, remote command and control frameworks, and network packet analysis."
        ],
        images: [griffin_cabal_weekly_1, griffin_cabal_weekly_2, griffin_cabal_weekly_3]
    },
    {
        title: "Weekly X Spaces on Security",
        role: "Host & Moderator",
        company: "Griffin Cabal",
        description: "Hosting and facilitating weekly live audio spaces on X (formerly Twitter) discussing breaking security incidents, career paths, and technical frameworks.",
        points: [
            "Coordinating panel discussions with security professionals, lead smart contract auditors, and Web3 developers.",
            "Analyzing live security incidents, high-profile hacks, and post-mortem breakdown of vulnerabilities.",
            "Answering community questions on smart contract auditing, bug bounties, and offensive security tooling.",
            "Educating the community on basic cyber hygiene, secure wallet management, and common phish vectors."
        ],
        images: [CyberSecuritySpaces]
    },
    {
        title: "Web Development Bootcamp",
        role: "Technical Educator",
        company: "Slaty",
        description: "Mentoring and tutoring entry-level developers in frontend and fullstack technologies, guiding them from basic concepts to deployed products.",
        points: [
            "Leading training sessions on HTML5, CSS3, ES6 JavaScript, and responsive design systems.",
            "Tutoring React.js ecosystem patterns (state management, component lifecycles, and hooks).",
            "Simplifying complex web layouts, styling frameworks (Tailwind CSS, Sass), and API integration.",
            "Reviewing student code repositories, resolving build blockers, and guiding deployment onto Vercel/Netlify."
        ],
        images: [WebDevTutoring]
    },
    {
        title: "Orochi Network Onboarding & Training",
        role: "Regional Ambassador & Host",
        company: "Orochi Network",
        description: "Hosted local onboarding workshops and technical training sessions to educate developers on Zero-Knowledge cryptography and the Orochi ONPROVER SDK.",
        points: [
            "Conducting developer training on integrating Orochi's cryptographic and secure randomness primitives.",
            "Leading workshops explaining the mechanics of ZK-SNARKs and zero-knowledge proofs in modern Web3 architecture.",
            "Onboarding developers into the Orochi ecosystem, providing documentation guides and developer console tours.",
            "Organizing interactive community events blending cybersecurity, zero-knowledge, and developer tooling."
        ],
        images: [OrochiTraining]
    }
];

export { services, technologies, experiences, testimonials, projects, events };

