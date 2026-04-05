import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiInfo, FiAlertCircle, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Critical Risk Alert',
            message: 'High concentration of PM2.5 detected in Zone B.',
            time: '2 mins ago',
            type: 'error',
            read: false,
        },
        {
            id: 2,
            title: 'New Site Plan Uploaded',
            message: 'A new site plan for Delhi Metro has been added.',
            time: '1 hour ago',
            type: 'info',
            read: false,
        },
        {
            id: 3,
            title: 'Maintenance Reminder',
            message: 'Sensor #402 requires calibration.',
            time: '3 hours ago',
            type: 'warning',
            read: true,
        },
        {
            id: 4,
            title: 'Report Generated',
            message: 'Monthly air quality report is ready for download.',
            time: '5 hours ago',
            type: 'success',
            read: true,
        },
    ]);

    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'error': return { bg: 'bg-rose-50', text: 'text-rose-600', icon: <FiAlertCircle size={16} /> };
            case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-600', icon: <FiAlertTriangle size={16} /> };
            case 'success': return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <FiCheck size={16} /> };
            default: return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <FiInfo size={16} /> };
        }
    };

    return (
        <div ref={ref} className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl text-gray hover:text-title transition-all duration-200 relative group ${isOpen ? 'bg-base text-title' : ''}`}
            >
                <FiBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Container */}
            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[360px] bg-card border border-border-main rounded-2xl shadow-[0_20px_60px_rgba(7,34,103,0.15)] z-[2000] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-border-main/50 flex items-center justify-between bg-card sticky top-0 z-10">
                        <div>
                            <h3 className="text-title font-extrabold text-base">Notifications</h3>
                            <p className="text-gray text-xs font-semibold mt-0.5">You have {unreadCount} unread alerts</p>
                        </div>
                        <button 
                            onClick={markAllRead}
                            className="text-primary text-xs font-bold hover:underline"
                        >
                            Mark all read
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar py-1">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => {
                                const styles = getTypeStyles(notif.type);
                                return (
                                    <div 
                                        key={notif.id}
                                        className={`px-4 py-4 flex gap-4 transition-colors cursor-pointer hover:bg-base relative group ${!notif.read ? 'bg-primary/5' : ''}`}
                                    >
                                        {!notif.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                        )}
                                        <div className={`w-10 h-10 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center shrink-0`}>
                                            {styles.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className={`text-sm tracking-tight truncate ${!notif.read ? 'font-extrabold text-title' : 'font-bold text-body'}`}>
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-gray/60 whitespace-nowrap">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-gray font-medium leading-relaxed line-clamp-2">
                                                {notif.message}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-gray/40 text-sm font-bold">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-border-main/50 bg-base/50">
                        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-body hover:text-title text-sm font-bold transition-all group">
                            <span>View all activities</span>
                            <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
