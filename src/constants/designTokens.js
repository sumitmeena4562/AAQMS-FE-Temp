/**
 * ────────────────────────────────────────────────────────────────────────────────
 *  AAQMS Design Tokens (Constants)
 * ────────────────────────────────────────────────────────────────────────────────
 * This file serves as the single source of truth for UI constants used 
 * across the application logic and inline styles.
 */

export const DESIGN_TOKENS = {
    // ── COLORS ──
    COLORS: {
        PRIMARY: '#072267',
        SECONDARY: '#3B82F6',
        ACCENT: '#0070F3',
        
        // Status Colors
        SUCCESS: '#10B981',
        DANGER: '#EF4444',
        WARNING: '#F59E0B',
        INFO: '#3B82F6',
        
        // Text Colors
        TITLE: '#000000',
        BODY: '#666666',
        MUTED: '#A1A1AA',
        INVERSE: '#FFFFFF',
        
        // Backgrounds
        PAGE: '#FAFAFA',
        CARD: '#FFFFFF',
        BASE: '#F8FAFC',
        
        BORDER: '#EAEAEA',
        BORDER_HOVER: '#D1D1D1',

        // Semantic Mappings
        TEXT_TITLE: '#000000',
        TEXT_BODY: '#666666',
        TEXT_MUTED: '#94A3B8', // Stronger than gray/40
        TEXT_LIGHT: '#A1A1AA',
        TEXT_PRIMARY: '#072267',
        
        // Status with Opacities (for badges/rings)
        SUCCESS_SOFT: 'rgba(16, 185, 129, 0.1)',
        DANGER_SOFT: 'rgba(239, 68, 68, 0.1)',
        PRIMARY_SOFT: 'rgba(7, 34, 103, 0.05)',

        // Badge Specific (Synced with Google/Material palette)
        BADGES: {
            SUCCESS_BG: '#e6f4ea',
            SUCCESS_TEXT: '#137333',
            PENDING_BG: '#FFF7E6',
            PENDING_TEXT: '#B45309',
            DANGER_BG: '#fce8e6',
            DANGER_TEXT: '#c5221f',
            BLOCKED_BG: '#f1f5f9',
            BLOCKED_TEXT: '#475569',
        }
    },

    // ── TYPOGRAPHY ──
    FONTS: {
        FAMILY: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        SIZES: {
            XXS: '0.625rem',  // 10px
            XS: '0.75rem',    // 12px
            SM: '0.8125rem',  // 13px
            BASE: '0.9375rem', // 15px
            LG: '1.125rem',   // 18px
            XL: '1.5rem',     // 24px
            '2XL': '2rem',    // 32px
        },
        WEIGHTS: {
            REGULAR: 400,
            MEDIUM: 500,
            SEMIBOLD: 600,
            BOLD: 700,
            BLACK: 900
        }
    },

    // ── SPACING ──
    SPACING: {
        XS: '4px',
        SM: '8px',
        MD: '16px',
        LG: '24px',
        XL: '32px',
        '2XL': '48px'
    },

    // ── BORDER RADIUS ──
    RADIUS: {
        SM: '4px',
        MD: '8px',
        LG: '12px',
        XL: '14px',
        '2XL': '24px',
        FULL: '9999px'
    },

    // ── SHADOWS ──
    SHADOWS: {
        SOFT: '0 4px 20px rgba(0, 0, 0, 0.05)',
        CARD: '0 4px 12px rgba(0, 0, 0, 0.15)',
        PREMIUM: '0 10px 40px -10px rgba(7, 34, 103, 0.12)'
    },

    // ── LAYOUT ──
    LAYOUT: {
        SIDEBAR_WIDTH: '260px',
        NAVBAR_HEIGHT: '80px',
        MAX_WIDTH: '1440px'
    }
};

export default DESIGN_TOKENS;
