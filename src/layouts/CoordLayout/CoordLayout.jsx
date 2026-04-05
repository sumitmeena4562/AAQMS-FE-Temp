import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfileDropdown from "../../components/Navbar/ProfileDropdown";

const CoordLayout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            {/* Topbar */}
            <header style={{ 
                padding: '12px 24px', 
                background: 'var(--color-primary-dark)', 
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>Coordinator Portal</h2>
                <ProfileDropdown />
            </header>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar Placeholder */}
                <aside style={{ width: '250px', background: 'var(--color-bg-sidebar)', color: 'white', padding: '16px' }}>
                    Coordinator Menu
                </aside>

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '24px', background: 'var(--color-bg-primary)', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CoordLayout;
