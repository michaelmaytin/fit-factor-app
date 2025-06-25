import React from 'react';
import LogoutButton from '../components/LogoutButton';

function Dashboard() {
    return (
        <div style={{ padding: '40px' }}>
            <h2>Dashboard</h2>
            <p>Welcome back!</p>
            <LogoutButton />
        </div>
    );
}

export default Dashboard;