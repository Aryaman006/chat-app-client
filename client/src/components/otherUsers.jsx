import React, { useEffect, useState } from 'react';
// import profilePlaceholder from '../assets/profile-placeholder.jpg'; // Assuming you have a placeholder image
import { useAuth } from '../context/auth';

const OtherUsers = () => {
    const [users, setUsers] = useState([]);
    const { port, user, setUser, token, setSelected, selected, setOtherUsers, onlineUsers } = useAuth();
    const [loading, setLoading] = useState(true);
    
    const getUsers = async () => {
        try {
            const response = await fetch(`${port}/api/v1/auth/users/${user.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            setUsers(data);
            setOtherUsers(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            // Handle error - show error message to user, retry fetching, etc.
        }
    }

    useEffect(() => {
        getUsers();
    }, [user]);

    return (
        <div className="chat-cards-container mt-8">
            {loading ? (
                <div>Loading...</div>
            ) : (
                users.map((otherUser, index) => (
                    <React.Fragment key={otherUser.id}>
                        <div className="chat-card flex items-center cursor-pointer text-white" onClick={() => setSelected(otherUser)}>
                            <div className={`avatar ${onlineUsers.includes(otherUser._id) ? 'online' : ''}`}>
                                <img src={otherUser.profilePhoto} alt="Profile" className="w-12 h-12 rounded-full" style={{ height: '50px' }} />
                            </div>
                            <h3 className="ml-4" style={{marginLeft:'15px'}}>{otherUser.name}</h3>
                        </div>
                        {index !== users.length - 1 && <hr className="divider border-gray-300" />}
                    </React.Fragment>
                ))
            )}
        </div>
    );
}

export default OtherUsers;
