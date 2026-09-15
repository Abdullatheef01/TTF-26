import React, { useState } from 'react'
import {auth} from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {
    const [email,emailstate]=useState("")
    const [password,passstate]=useState("")
    const[error,errorstate]=useState()
    const navigate = useNavigate();
  const handleLogin=async()=>{
      try{
        await signInWithEmailAndPassword(auth,email,password)
        navigate("/dashboard");
      }
      catch (err){
         errorstate(err.message)
      }
    }
  return (
    <>
      <div className='bg-black min-h-screen flex justify-center items-center'>
        <div className='bg-[#090909] w-[90%] max-w-[380px] h-[400px] rounded-3xl '>

          <h1 className='text-[#f0f00c] text-3xl text-center p-3 font-rajdhani mt-3 font-bold'>Log in</h1>
          <div className='flex flex-col items-center font-rajdhani'>
          <label htmlFor="adminid" className='text-[20px] m-5 w-[80%] flex flex-col text-[#9b9a9a]'>Admin ID
            <input type="text" id='adminid' className='border h-12 m-2 border-[#f0f00c] outline-none pl-2 rounded-[10px]' onChange={(e)=>{emailstate(e.target.value)}} value={email}/>
          </label>
          <label htmlFor="adminPass" className='text-[20px]  flex flex-col w-[80%] text-[#9b9a9a]'>Password
            <input type="password" id='adminPass' className='border h-12 m-2 border-[#f0f00c] outline-none pl-2 rounded-[10px]' onChange={(e)=>{passstate(e.target.value)}} value={password}/>
          </label>
          <button className='bg-[#f0f00c] w-[80%] h-10 font-bold text-[20px] rounded-2xl mt-8 hover:bg-[#e8e827]' onClick={(e)=>handleLogin(e)}>Sign in</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLogin