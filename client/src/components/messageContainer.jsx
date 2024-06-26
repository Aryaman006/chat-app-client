import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/auth";
import { IoFastFoodOutline, IoSend, IoArrowBack } from "react-icons/io5";

const MessageContainer = () => {
    const { selected, port, token, user, socket, setSocket, onlineUsers, setSelected } = useAuth();
    const senderId = user.id;
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const scroll = useRef(null);

    useEffect(() => {
        if (socket) {
            // Listen for incoming messages from the server
            socket.on("newMessage", (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                // Scroll to the latest message
                scroll.current.scrollTop = scroll.current.scrollHeight;
            });
        }
        return () => {
            // Cleanup the socket listener when component unmounts
            if (socket) {
                socket.off("newMessage");
            }
        };
    }, [socket]);

    const sendMessage = async () => {
        try {
            const response = await fetch(`${port}/api/v1/message/send`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId,
                    recieverId: selected._id,
                    message
                })
            });
            const data = await response.json();
            console.log(data);
            setMessages([]);
            await getMessage();
        } catch (error) {
            console.log(error);
        }
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (!selected) {
            console.error('No recipient selected');
            return;
        }
        await sendMessage();
        setMessage("");
    }
    useEffect(()=>{
        setMessages([]);
        getMessage();
    },[selected])

    const getMessage = async () => {
        try {
            if (!selected) {
                console.error('No recipient selected');
                return;
            }
            const response = await fetch(`${port}/api/v1/message/${selected._id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId
                })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const isOnline = onlineUsers?.includes(selected?._id); // Added conditional access here

    useEffect(() => {
        // Fetch messages when selected user changes
        if (selected !== null) {
            getMessage();
        }
    }, [selected]);

    useEffect(() => {
        if (scroll.current && scroll.current.lastChild) {
            // Scroll the last message into view
            scroll.current.lastChild.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    return (
        <div className="bg-white backdrop-filter backdrop-blur-md bg-opacity-10 rounded-lg shadow-lg p-8 relative" style={{ height: "560px", width: "500px", marginLeft: '2px', display: 'flex', flexDirection: 'column' }}>
           
               { selected !== null ? (
                    <div className="messageContainer" style={{ flex: 1, overflowY: 'auto' }}>
                        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto mt-8" style={{ backgroundColor: '#212121', position: 'fixed', width: '450px', marginBottom: '50px' }}>
                            <div className="header flex items-center justify-between mb-4">
                                {selected && (
                                    <div className="profile-info flex items-center gap-4" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <IoArrowBack onClick={() => setSelected(null)} className="text-gray-300 hover:text-white cursor-pointer" />
                                        <div className={`avatar ${isOnline ? 'online' : ''}`}>
                                            <img src={selected.profilePhoto} alt="user-profile" className="w-12 h-12 rounded-full" style={{ height: '50px' }} />
                                        </div>
                                        <h1 className="text-lg font-semibold">{selected.name}</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                        {messages && selected && (
                            <div ref={scroll} className="message-list" style={{ marginTop: '70px' }}>
                                {messages.map((message, index) => (
                                    <div className={`message-bubble ${message.senderId === user.id ? 'sent' : 'received'}`} key={message._id}>
                                        {message.message}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="welcome-message flex flex-col items-center mt-8" style={{ marginBottom: '200px', marginLeft: '40px', fontSize: '20px', marginTop:'200px' }}>
                    <h1 className="text-4xl font-bold mb-2">Hi, {user.name}</h1>
                    <br />
                    <p className="text-xl">Let's start a conversation</p>
                </div>
                )}
            

            {!selected && (
                 <div className="welcome-message flex flex-col items-center mt-8" style={{ marginBottom: '200px', marginLeft: '40px', fontSize: '20px', marginTop:'200px' }}>
                   <h1 className="text-4xl font-bold mb-2">Hi, {user.name}</h1>
                    <br />
                   <p className="text-xl">Let's start a conversation</p>
                 </div>
            )}

            <form onSubmit={handleSend} className="px-4 my-3" style={{ height: '80px' }}>
                <div className="w-full relative">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className='border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white'
                        placeholder="Type your message here..."
                        style={{ padding: '15px' }}
                    />
                    <button type="submit" className="absolute top-0 right-0 mt-2 mr-2 text-gray-300 hover:text-white">
                        <IoSend className="text-xl" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageContainer;
