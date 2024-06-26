import React, { useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import OtherUsers from './otherUsers';
import { useAuth } from '../context/auth';
import  {toast} from 'react-toastify' 
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [find, setFind] = useState();
  const {otherUsers,setUser,setToken,setOtherUsers} = useAuth();

  const handleLogOut = ()=>{
    setUser("");
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login")
  }
  // console.log(otherUsers);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const conversationUser = otherUsers?.find((user)=> user.fullName.toLowerCase().includes(search.toLowerCase()));
    if(conversationUser){
      setOtherUsers(conversationUser);
    }else{
      toast.error("user not found");
    }
  }

  return (
    <>
    <div className="container" style={{height:'500px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div className="box">
      <div className='border-r border-gray-300 p-4 flex flex-col'>
        <form action='' className='flex gap-2'>
          <input
            id='search'
            className='input input-bordered rounded-md'
            type='text'
            value={find}
            onChange={()=>setFind(e.target.value)}
            placeholder='Search...'
            style={{ marginTop: '0' }}
          />
          <button type='submit' className='btn bg-primary text-white' onClick={handleSubmit}>
            <BiSearchAlt2 className='w-6 h-6 outline-none' />
          </button>
        </form>
        <div className='divider px-3'></div>
      </div>
          <OtherUsers />
      </div>
        <div className='mt-2 '>
          <button onClick={handleLogOut} className='btn btn-sm'>Logout</button>
        </div>
        </div>
    </>
  );
};

export default Sidebar;
