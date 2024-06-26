import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { toast } from 'react-toastify';

const Register = () => {
  const { port } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  // Function to detect background brightness and set text color accordingly
  useEffect(() => {
    const body = document.querySelector('body');
    const computedStyle = window.getComputedStyle(body);
    const backgroundColor = computedStyle.backgroundColor;

    // Convert background color to RGB
    const rgbValues = backgroundColor.match(/\d+/g);
    const brightness = (rgbValues[0] * 299 + rgbValues[1] * 587 + rgbValues[2] * 114) / 1000;

    // Set text color based on background brightness
    const textColor = brightness >= 128 ? 'text-black' : 'text-white';
    document.documentElement.classList.add(textColor);

    // Cleanup function to remove the added class
    return () => {
      document.documentElement.classList.remove(textColor);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !gender) {
      alert('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${port}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, gender })
      });
      if(response.ok){
        const data = await response.json();
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setGender("");
        toast.success("registration successfull")
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error,"error in registration");
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover">
      <div className="bg-white backdrop-filter backdrop-blur-md bg-opacity-10 rounded-lg shadow-lg p-8 max-w-md w-full" style={{ height: '600px', width: '400px' }}>
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-600">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block  w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-opacity-10 p-2 text-black"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-opacity-10 p-2"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-opacity-10 p-2"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 bg-opacity-10 p-2"
              placeholder="Confirm your password"
            />
          </div>
          <div className="space-y-2">
            <label className="block">Gender:</label>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="text-blue-500 form-radio focus:ring-blue-400 h-4 w-4"
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="text-pink-500 form-radio focus:ring-pink-400 h-4 w-4"
              />
              <label htmlFor="female">Female</label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                id="other"
                name="gender"
                value="other"
                checked={gender === 'other'}
                onChange={() => setGender('other')}
                className="text-green-500 form-radio focus:ring-green-400 h-4 w-4"
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 p-2"
              disabled={!name || !email || !password || !confirmPassword || !gender}
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
