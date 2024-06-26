import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate  = useNavigate();
  const {user,setUser,port,token,setToken} = useAuth();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !email || !password) {
      alert('All fields are required.');
      return;
    }
    try {
        const response = await fetch(`${port}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data.user);
            setToken(data.token);
            setEmail("");
            setPassword("");
            toast.success("login successfull")
            navigate("/")
        }
    } catch (error) {
        console.log(error);
      toast.error(error,"error in login");

    }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover"
     
    >
      <div className="bg-white backdrop-filter backdrop-blur-md bg-opacity-10 rounded-lg shadow-lg p-8" style={{height:"400px",width:"400px"}}>
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-50 sm:text-gray-800">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block  ">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value )}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block ">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword( e.target.value )}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
              placeholder="Enter your password"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 "
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;