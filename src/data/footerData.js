import { FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6';

export const FOOTER_LINKS = [
    {
        title: "Platform",
        links: [
            { label: "Capabilities", href: "#capabilities" },
            { label: "Visual Planning", href: "#planning" },
            { label: "Workflow Engine", href: "#workflow" },
            { label: "Mobile Operator App", href: "#mobile" },
            { label: "Edge Analytics", href: "#analytics" },
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Help Center", href: "#" },
            { label: "API Documentation", href: "#" },
            { label: "Security Suite", href: "#" },
            { label: "System Status", href: "#" },
            { label: "Community Forum", href: "#" },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About AAQMS", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Legal & Compliance", href: "#" },
            { label: "Newsroom", href: "#" },
            { label: "Partners", href: "#" },
        ]
    }
];

export const SOCIAL_LINKS = [
    { 
        icon: FaLinkedinIn, 
        href: "https://linkedin.com", 
        label: "Follow us on LinkedIn" 
    },
    { 
        icon: FaXTwitter, 
        href: "https://twitter.com", 
        label: "Follow us on X" 
    },
    { 
        icon: FaGithub, 
        href: "https://github.com", 
        label: "Star our project on GitHub" 
    }
];
