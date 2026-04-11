import React from 'react';
import {
    MdEmail,
    MdPhone,
    MdLocationOn,
} from 'react-icons/md';
import { BRAND_NAME, CONTACT_INFO, COPYRIGHT_TEXT } from '../Branding/BrandConfig';
import { FOOTER_LINKS, SOCIAL_LINKS } from '../../data/footerData';
import Logo from '../Branding/Logo';

const FooterLink = ({ href, children, label }) => (
    <a
        href={href}
        aria-label={label || children}
        className="text-[13px] text-slate-500 hover:text-primary transition-all duration-300 block mb-3 font-semibold hover:translate-x-1"
    >
        {children}
    </a>
);

const SocialIcon = ({ icon: Icon, href, label }) => (
    <a
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
    >
        <Icon className="text-lg" />
    </a>
);

const Footer = () => {
    return (
        <footer className="bg-slate-50/50 py-16 sm:py-20 px-6 border-t border-slate-100 relative z-10 overflow-hidden" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            
            {/* Premium Background Glow */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(7,34,103,0.03)_0%,_transparent_70%)]" />
            </div>

            {/* Glossy Top Border */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">

                    {/* Brand Info */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-start">
                        <Logo size="lg" className="mb-6 -ml-5" />
                        <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-[300px] font-medium opacity-90">
                            The advanced engineering blueprint for asset quality monitoring and field safety compliance.
                        </p>
                        <nav className="flex gap-3" aria-label="Social media links">
                            {SOCIAL_LINKS.map((social, idx) => (
                                <SocialIcon key={idx} {...social} />
                            ))}
                        </nav>
                    </div>

                    {/* Dynamic Link Categories */}
                    {FOOTER_LINKS.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-7 opacity-70 cursor-default">
                                {section.title}
                            </h4>
                            <nav className="flex flex-col" aria-label={`${section.title} links`}>
                                {section.links.map((link, lIdx) => (
                                    <FooterLink key={lIdx} href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                ))}
                            </nav>
                        </div>
                    ))}

                    {/* Contact & Legal — Manual as it uses specific icons/format */}
                    <div className="col-span-2 lg:col-span-1 mt-10 lg:mt-0 pt-10 lg:pt-0 border-t lg:border-t-0 border-slate-200/50">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-7 opacity-70 cursor-default">Get in Touch</h4>
                        <div className="space-y-4">
                            <a 
                                href={`mailto:${CONTACT_INFO.EMAIL}`}
                                className="flex items-center gap-3 group cursor-pointer w-fit"
                                aria-label={`Email us at ${CONTACT_INFO.EMAIL}`}
                            >
                                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <MdEmail className="text-xl" />
                                </div>
                                <span className="text-[13px] text-slate-600 font-bold group-hover:text-primary transition-colors">{CONTACT_INFO.EMAIL}</span>
                            </a>
                            <a 
                                href={`tel:${CONTACT_INFO.PHONE.replace(/\D/g,'')}`}
                                className="flex items-center gap-3 group cursor-pointer w-fit"
                                aria-label={`Call us at ${CONTACT_INFO.PHONE}`}
                            >
                                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <MdPhone className="text-xl" />
                                </div>
                                <span className="text-[13px] text-slate-600 font-bold group-hover:text-primary transition-colors">{CONTACT_INFO.PHONE}</span>
                            </a>
                            <div className="flex items-start gap-4 group cursor-pointer w-fit" tabIndex="0">
                                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 mt-1">
                                    <MdLocationOn className="text-xl" />
                                </div>
                                <span className="text-[13px] text-slate-600 font-bold leading-relaxed group-hover:text-primary transition-colors">
                                    {CONTACT_INFO.ADDRESS[0]}<br />{CONTACT_INFO.ADDRESS[1]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[12px] text-slate-400 font-semibold tracking-tight">
                        {COPYRIGHT_TEXT}
                    </div>
                    <nav className="flex gap-8" aria-label="Legal links">
                        <a href="#" className="text-[12px] text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest">Privacy Policy</a>
                        <a href="#" className="text-[12px] text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest">Terms</a>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
