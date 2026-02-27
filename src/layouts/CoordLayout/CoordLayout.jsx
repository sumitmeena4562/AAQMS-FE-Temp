import React from 'react';
import { Outlet } from 'react-router-dom';

const CoordLayout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            {/* Topbar Placeholder */}
            <header style={{ padding: '16px', background: 'var(--color-primary-dark)', color: 'white' }}>
                <h2>Coordinator Portal</h2>
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
