import React, {useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';

function Dashboard() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(!storedUser) {
            window.location.href = "/login";
        } else {
            setUser(JSON.parse(storedUser))
        }
    }, []);

    if (!user) return null;

    return (
        <div style={{ padding: '40px' }}>
            <h2>Dashboard</h2>
            <p>Welcome back!, <strong>{user.email}</strong></p>
            <p>Your role: <strong>{user.role}</strong></p>

            {user.role === "admin" && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                     <strong>Admin Access:</strong> You can manage users, data, or settings here.
                </div>
            )}

            <LogoutButton />
        </div>
    );
}

export default Dashboard;