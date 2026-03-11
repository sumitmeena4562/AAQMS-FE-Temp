/**
 * ═══════════════════════════════════════════════════════════════════════
 *  AAQMS Global Theme — Single source of truth for all design tokens
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  Usage:
 *    import { t } from '../../theme/theme';
 *    <div style={{ color: t.color.text, padding: t.space.md }}>
 *
 *  Changing ANY value here will update it across the ENTIRE app.
 */

// ── Colors ──────────────────────────────────────────────────────────────────────
const color = {
    // Core
    primary:        '#072267',
    primaryDark:    '#051b52',
    primaryLight:   '#0070F3',
    primaryBg:      '#F0F7FF',
    primaryBorder:  '#EAEAEA',

    // Text
    text:           '#111827',
    textSecondary:  '#374151',
    textTertiary:   '#4B5563',
    textMuted:      '#6B7280',
    textPlaceholder:'#9CA3AF',
    textInverse:    '#FFFFFF',

    // Backgrounds
    bg:             '#FFFFFF',
    bgPage:         '#FAFAFA',
    bgHover:        '#F9FAFB',
    bgMuted:        '#F3F4F6',
    bgDark:         '#F9FAFB',

    // Borders
    border:         '#E5E7EB',
    borderLight:    '#F3F4F6',
    borderDark:     '#D1D5DB',
    borderInput:    '#E5E7EB',

    // Status — Success
    success:        '#059669',
    successDark:    '#065F46',
    successBg:      '#ECFDF5',
    successBorder:  '#A7F3D0',
    successPill:    '#D1FAE5',

    // Status — Danger
    danger:         '#EF4444',
    dangerDark:     '#991B1B',
    dangerBg:       '#FEF2F2',
    dangerBorder:   '#FECACA',
    dangerPill:     '#FEE2E2',

    // Status — Warning
    warning:        '#D97706',
    warningDark:    '#92400E',
    warningBg:      '#FFFBEB',
    warningBorder:  '#FDE68A',
    warningPill:    '#FEF3C7',

    // Status — Info
    info:           '#2563EB',
    infoDark:       '#1E40AF',
    infoBg:         '#EFF6FF',
    infoBorder:     '#BFDBFE',

    // Roles
    coordinatorBg:    '#F5F3FF',
    coordinatorText:  '#5B21B6',
    coordinatorBorder:'#DDD6FE',
    fieldOfficerBg:   '#EFF6FF',
    fieldOfficerText: '#1E40AF',
    fieldOfficerBorder:'#BFDBFE',
    adminBg:          '#FFF7ED',
    adminText:        '#C2410C',
    adminBorder:      '#FED7AA',

    // Sidebar
    sidebarBg:        '#FAFAFA',
    sidebarBorder:    '#E5E7EB',
    sidebarLabelBorder:'#F3F4F6',
    sidebarActive:    '#072267',
    sidebarActiveBg:  '#F0F7FF',

    // Navbar
    navbarBg:         '#FAFAFA',
    navbarBorder:     '#E5E7EB',

    // Avatar gradient pairs
    avatarGradients: [
        ['#6366F1', '#A855F7'],
        ['#3B82F6', '#06B6D4'],
        ['#F43F5E', '#FB923C'],
        ['#10B981', '#3B82F6'],
        ['#F59E0B', '#EF4444'],
    ],

    // Overlay / Backdrop
    overlay:          'rgba(0,0,0,0.25)',
    overlayDark:      'rgba(0,0,0,0.3)',

    // Notification dot
    notifDot:         '#3B82F6',
};

// ── Spacing ─────────────────────────────────────────────────────────────────────
const space = {
    '0':  0,
    xs:   4,
    sm:   6,
    md:   8,
    lg:   12,
    xl:   16,
    '2xl':20,
    '3xl':24,
    '4xl':32,
};

// ── Border Radius ───────────────────────────────────────────────────────────────
const radius = {
    xs:   4,
    sm:   6,
    md:   7,
    lg:   8,
    xl:   10,
    '2xl':12,
    pill:  20,
    full:  9999,
    circle:'50%',
};

// ── Font Sizes ──────────────────────────────────────────────────────────────────
const fontSize = {
    'xxs':  10,
    xs:     11,
    sm:     12,
    md:     13,
    base:   14,
    lg:     15,
    xl:     16,
    '2xl':  18,
    '3xl':  20,
    '4xl':  22,
    '5xl':  24,
};

// ── Font Weights ────────────────────────────────────────────────────────────────
const fontWeight = {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
};

// ── Shadows ─────────────────────────────────────────────────────────────────────
const shadow = {
    none:   'none',
    xs:     '0 1px 2px rgba(0,0,0,0.04)',
    sm:     '0 1px 3px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.05)',
    card:   '0 1px 4px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.05)',
    cardHover:'0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.04)',
    md:     '0 4px 12px rgba(0,0,0,0.08)',
    lg:     '0 8px 24px rgba(0,0,0,0.1)',
    xl:     '0 20px 60px rgba(0,0,0,0.15)',
    drawer: '-8px 0 30px rgba(0,0,0,0.1)',
    drawerLight:'-6px 0 24px rgba(0,0,0,0.08)',
};

// ── Transitions ─────────────────────────────────────────────────────────────────
const transition = {
    fast:   '120ms ease',
    base:   '150ms ease',
    smooth: '200ms ease',
    slow:   '250ms ease',
};

// ── Layout Dimensions ───────────────────────────────────────────────────────────
const layout = {
    sidebarWidth:      240,
    sidebarCollapsed:  64,
    navbarHeight:      52,
    contentPadding:    20,
    maxContentWidth:   1400,
    drawerWidth:       420,
    formDrawerWidth:   440,
    modalWidth:        400,
};

// ── Z-Index Scale ───────────────────────────────────────────────────────────────
const zIndex = {
    dropdown:  50,
    sidebar:   1000,
    overlay:   9998,
    modal:     9999,
    toast:     10000,
};

// ── Export ───────────────────────────────────────────────────────────────────────
export const t = {
    color,
    space,
    radius,
    fontSize,
    fontWeight,
    shadow,
    transition,
    layout,
    zIndex,
};

export default t;
