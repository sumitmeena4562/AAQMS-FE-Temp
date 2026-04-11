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
    // Core (Synced with CSS variables)
    primary:        'var(--color-primary)',
    primaryDark:    'var(--color-primary-dark)',
    primaryLight:   'var(--color-secondary)',
    primaryBg:      'var(--color-accent-soft)',
    primaryBorder:  'var(--color-border)',

    // Text
    text:           'var(--color-text-title)',
    textSecondary:  'var(--color-text-body)',
    textTertiary:   'var(--color-text-muted)',
    textMuted:      'var(--color-text-muted)',
    textPlaceholder:'#9CA3AF',
    textInverse:    '#FFFFFF',

    // Backgrounds
    bg:             'var(--color-surface)',
    bgPage:         'var(--color-background)',
    bgHover:        'rgba(var(--color-primary-rgb), 0.03)',
    bgMuted:        'var(--color-background)',
    bgDark:         'var(--color-background)',

    // Borders
    border:         'var(--color-border)',
    borderLight:    'var(--color-border-subtle)',
    borderDark:     'var(--color-border)',
    borderInput:    'var(--color-border)',

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
    sidebarBg:        '#F8FAFC',
    sidebarBorder:    '#E5E7EB',
    sidebarLabelBorder:'#F3F4F6',
    sidebarActive:    '#072267',
    sidebarActiveBg:  'rgba(7, 34, 103, 0.05)',

    // Navbar
    navbarBg:         '#FFFFFF',
    navbarBorder:     '#E5E7EB',

    // Avatar gradient pairs
    avatarGradients: [
        ['#6366F1', '#A855F7'],
        ['#3B82F6', '#06B6D4'],
        ['#F43F5E', '#FB923C'],
        ['#10B981', '#3B82F6'],
        ['#F59E0B', '#ef4444ff'],
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
    pill:  24,
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
    card:   '0 4px 12px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0,0,0,0.05)',
    cardHover:'0 12px 28px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.26)',
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
    dropdown:  2000,
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
