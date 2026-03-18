import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineBuild } from 'react-icons/md';
import { t } from '../../theme/theme';

const PlaceholderPage = ({ title, icon: Icon = MdOutlineBuild }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            background: t.color.bg,
            borderRadius: t.radius.card,
            boxShadow: t.shadow.pro,
            border: `1px solid ${t.color.borderLight}`,
            minHeight: '400px'
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: t.radius.circle,
                    background: t.color.primaryLight,
                    color: t.color.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                }}
            >
                <Icon size={40} />
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: t.color.primaryDark,
                    marginBottom: '12px',
                    letterSpacing: '-0.02em'
                }}
            >
                {title}
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                    fontSize: '15px',
                    color: t.color.textSecondary,
                    maxWidth: '400px',
                    lineHeight: 1.6
                }}
            >
                This module is currently under development as we scale the AAQMS platform. Stay tuned for advanced management capabilities coming soon.
            </motion.p>
        </div>
    );
};

export default PlaceholderPage;
