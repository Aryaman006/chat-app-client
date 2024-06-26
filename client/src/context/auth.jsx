import React, { createContext, useContext, useState, useEffect } from 'react';
import io from "socket.io-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [socket,setSocket] = useState();
  const [otherUsers,setOtherUsers] = useState(null);
  const [token, setToken] = useState(null);
  const [port, setPort] = useState('https://chat-app-backend-mv4a.onrender.com');
  const [selected,setSelected] = useState("");


  useEffect(() => {
    const data = localStorage.getItem("user");
    if(data){
      const parseData = JSON.parse(data)
      setUser(parseData.user);
      setToken(parseData.token);
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(()=>{
    if(user){
      const socketio = io(`${port}`,{
        query:{
          userId : user.id
        }
      });
      setSocket(socketio);
      socketio.on('getOnlineUsers',(online)=>{
        setOnlineUsers(online);
      });
      return ()=>socketio.close();
    }else{
      if(socket){
        socket.close();
        setSocket(null)
      }
    }
  },[user])

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, port, selected, setSelected, otherUsers,setOtherUsers, socket,setSocket, onlineUsers,setOnlineUsers}}>
      {children}
    </AuthContext.Provider>
  );
};
