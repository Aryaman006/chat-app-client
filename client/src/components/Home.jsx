import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import MessageContainer from "./messageContainer";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { user, selected } = useAuth();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(()=>{
    if(!user){
      navigate("/login");
    }
  },[])
 

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize(); // Initial check

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-cover" >
        {isSmallScreen && !selected && (
          <div className="bg-white backdrop-filter backdrop-blur-md bg-opacity-10 rounded-lg shadow-lg p-8" >
            <Sidebar />
          </div>
        )}

        {(isSmallScreen && selected && user) ? (
            <MessageContainer />
        ) : (
          <></>
        )}

        {(!isSmallScreen && user) ? (
          <>
          <div className="bg-white backdrop-filter backdrop-blur-md bg-opacity-10 rounded-lg shadow-lg p-8">
          <Sidebar />
        </div>
        <MessageContainer/>
        </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Home;
