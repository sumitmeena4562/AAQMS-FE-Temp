import React from 'react';
import { Outlet } from 'react-router-dom';

const FieldLayout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            {/* Topbar Placeholder */}
            <header style={{ padding: '16px', background: 'var(--color-success-dark)', color: 'white' }}>
                <h2>Field Officer App</h2>
            </header>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar Placeholder */}
                <aside style={{ width: '250px', background: 'var(--color-bg-sidebar)', color: 'white', padding: '16px' }}>
                    Field Menu
                </aside>

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '24px', background: 'var(--color-bg-primary)', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FieldLayout;
