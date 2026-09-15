import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
    <div >
<div className="text-amber-50 z-20 fixed top-8 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-[#ccc]/20">
            <ul className="flex gap-5  bg-black p-3 max-w-[400px] w-[100%]  rounded-4xl  text-center justify-center">
               <a href="#home"><li>Home</li></a> 
               <a href="#about"><li>About</li></a>
                <li>Event</li>
                <a href="#contact"><li>Contact</li></a>
                <Link to="/Register">
                <li><button className="bg-amber-300 px-5 py-1 rounded-3xl text-center text-black font-bold cursor-pointer">Register</button></li>
                </Link>
                
            </ul>
        </div>
    </div>
    </>
  )
}

export default Navbar