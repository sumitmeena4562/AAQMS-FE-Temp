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
import { t } from '../../theme/theme';

const FooterLink = ({ href, children }) => (
    <a
        href={href}
        style={{
            color: t.color.textSecondary,
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s ease',
            display: 'block',
            marginBottom: '10px'
        }}
        onMouseEnter={(e) => e.target.style.color = t.color.primary}
        onMouseLeave={(e) => e.target.style.color = t.color.textSecondary}
    >
        {children}
    </a>
);

// eslint-disable-next-line no-unused-vars
const SocialIcon = ({ icon: Icon, href }) => (
    <a
        href={href}
        style={{
            width: '36px',
            height: '36px',
            borderRadius: t.radius.sm,
            background: t.color.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: t.color.primaryDark,
            transition: 'all 0.2s ease',
            border: `1px solid ${t.color.borderLight}`
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = t.color.primary;
            e.currentTarget.style.color = t.color.textInverse;
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = t.color.bg;
            e.currentTarget.style.color = t.color.primaryDark;
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <Icon size={18} />
    </a>
);

const Footer = () => {
    return (
        <footer style={{
            background: t.color.bgSecondary,
            padding: '80px 24px 40px',
            borderTop: `1px solid ${t.color.borderLight}`,
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1fr',
                    gap: '60px',
                    marginBottom: '60px'
                }} className="footer-grid">

                    {/* Brand Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: t.color.primary,
                                borderRadius: t.radius.sm,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: t.color.textInverse
                            }}>
                                <MdSecurity size={20} />
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 800, color: t.color.primaryDark, letterSpacing: '-0.5px' }}>
                                SAFETY AI
                            </span>
                        </div>
                        <p style={{
                            fontSize: '14px',
                            color: t.color.textSecondary,
                            lineHeight: 1.6,
                            marginBottom: '24px',
                            maxWidth: '280px'
                        }}>
                            Next-generation AI-driven safety management suite. Digitizing audits for unmatched field compliance.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <SocialIcon icon={FaLinkedinIn} href="#" />
                            <SocialIcon icon={FaXTwitter} href="#" />
                            <SocialIcon icon={FaGithub} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: t.color.primaryDark, marginBottom: '24px' }}>Platform</h4>
                        <FooterLink href="#capabilities">Capabilities</FooterLink>
                        <FooterLink href="#planning">Visual Planning</FooterLink>
                        <FooterLink href="#workflow">Workflow</FooterLink>
                        <FooterLink href="#mobile">Mobile App</FooterLink>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: t.color.primaryDark, marginBottom: '24px' }}>Company</h4>
                        <FooterLink href="#">About Us</FooterLink>
                        <FooterLink href="#">Our Mission</FooterLink>
                        <FooterLink href="#">Compliance Hub</FooterLink>
                        <FooterLink href="#analytics">Reporting</FooterLink>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: t.color.primaryDark, marginBottom: '24px' }}>Contact</h4>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <MdEmail size={20} color={t.color.primary} />
                            <span style={{ fontSize: '14px', color: t.color.textSecondary }}>support@safetyai.com</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <MdPhone size={20} color={t.color.primary} />
                            <span style={{ fontSize: '14px', color: t.color.textSecondary }}>+91 (800) 123-4567</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <MdLocationOn size={20} color={t.color.primary} />
                            <span style={{ fontSize: '14px', color: t.color.textSecondary, lineHeight: 1.5 }}>
                                Cyber Park, Zone 4,<br />Tech Hub, Mumbai
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '32px',
                    borderTop: `1px solid ${t.color.borderLight}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }} className="footer-bottom">
                    <div style={{ fontSize: '13px', color: t.color.textSecondary }}>
                        © {new Date().getFullYear()} AAQMS Safety Management. All rights reserved.
                    </div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <a href="#" style={{ fontSize: '13px', color: t.color.textSecondary, textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ fontSize: '13px', color: t.color.textSecondary, textDecoration: 'none' }}>Terms of Service</a>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 40px !important;
                    }
                }
                @media (max-width: 640px) {
                    .footer-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .footer-bottom {
                        flex-direction: column;
                        gap: 20px;
                        text-align: center;
                    }
                }
            `}} />
        </footer>
    );
};

export default Footer;
