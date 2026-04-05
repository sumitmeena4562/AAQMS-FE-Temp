import React from 'react';
import {
    MdEmail,
    MdPhone,
    MdLocationOn,
    MdSecurity
} from 'react-icons/md';
import {
    FaXTwitter,
    FaLinkedinIn,
    FaGithub
} from 'react-icons/fa6';

const FooterLink = ({ href, children }) => (
    <a
        href={href}
        className="text-sm text-slate-500 hover:text-primary transition-colors duration-200 block mb-2 font-medium"
    >
        {children}
    </a>
);

const SocialIcon = ({ icon: Icon, href }) => (
    <a
        href={href}
        className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
    >
        <Icon className="text-lg" />
    </a>
);

const Footer = () => {
    return (
        <footer className="bg-slate-50/50 py-20 px-6 border-t border-slate-100 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">

                    {/* Brand Info */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-6 group cursor-default">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                                <MdSecurity className="text-xl" />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter">
                                SAFETY AI
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-[280px] font-medium">
                            Next-generation AI-driven safety management suite. Digitizing audits for unmatched field compliance.
                        </p>
                        <div className="flex gap-3">
                            <SocialIcon icon={FaLinkedinIn} href="#" />
                            <SocialIcon icon={FaXTwitter} href="#" />
                            <SocialIcon icon={FaGithub} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Platform</h4>
                        <div className="flex flex-col">
                            <FooterLink href="#capabilities">Capabilities</FooterLink>
                            <FooterLink href="#planning">Visual Planning</FooterLink>
                            <FooterLink href="#workflow">Workflow</FooterLink>
                            <FooterLink href="#mobile">Mobile App</FooterLink>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Company</h4>
                        <div className="flex flex-col">
                            <FooterLink href="#">About Us</FooterLink>
                            <FooterLink href="#">Our Mission</FooterLink>
                            <FooterLink href="#">Compliance Hub</FooterLink>
                            <FooterLink href="#analytics">Reporting</FooterLink>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Contact</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                    <MdEmail className="text-lg" />
                                </div>
                                <span className="text-sm text-slate-500 font-medium">support@safetyai.com</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                    <MdPhone className="text-lg" />
                                </div>
                                <span className="text-sm text-slate-500 font-medium">+91 (800) 123-4567</span>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                                    <MdLocationOn className="text-lg" />
                                </div>
                                <span className="text-sm text-slate-500 font-medium leading-relaxed">
                                    Cyber Park, Zone 4,<br />Tech Hub, Mumbai
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[13px] text-slate-400 font-medium">
                        © {new Date().getFullYear()} AAQMS Safety Management. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-[13px] text-slate-400 hover:text-primary transition-colors font-medium">Privacy Policy</a>
                        <a href="#" className="text-[13px] text-slate-400 hover:text-primary transition-colors font-medium">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
