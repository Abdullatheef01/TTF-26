import Video from '../assets/video.mp4'
import '../index.css'
import Countdown from "./Countdown";
import { useLocation, useNavigate } from "react-router-dom";

const Hero = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname.toLowerCase() === "/register";

  return (
    <>
      {isRegisterPage && (
        <button
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 z-50 flex items-center border border-[#f0f00c]/40 bg-[black]/70 backdrop-blur-sm px-5 py-2.5 tracking-[2px] text-[#c7c741] transition-all duration-300 hover:border-[#f0f00c] hover:shadow-[0_0_15px_rgba(240,240,12,0.4)] rounded-[50px]"
        >
          <span className="material-symbols-outlined text-3xl">
            arrow_back
          </span>
        </button>
      )}
        
    <div>
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className='w-full h-screen object-cover'
      >
        <source src={Video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    {/* paragraph sentence */}

       <div class="absolute  inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/50">
        <div className='mb-5 mt-10'>
       < Countdown />
    </div>
        <p class=" text-base md:text-sm  max-w-8xl font-[Audiowide] font-extralight text-white opacity-40 text-sm ">
      
ST. JOSEPH'S COLLEGE OF ENGINERRING AND TECHNOLOGY,THANJAVUR
    </p>
    <p className='text-white font-[Krona_one] md:text-2xl md:mt-1.5 opacity-60 text-xs mt-3'>
      DEPARTMENT OF CSE <span>PRESENT</span>
    </p>
    <h1 class="text-white text-[40px] md:text-9xl font-bold font-[Krona_one] mt-4">
     <span className='text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]'>TITAN </span> <span className='"
  font-[Krona_One]
  text-transparent
  bg-clip-text
  bg-gradient-to-r from-[#f0f00c] via-[#f0f00c] to-[#f0f00c]
  drop-shadow-[0_0_15px_rgba(255,215,1,0.2)]
"'> TECH <br /> FEST'26</span>
    </h1>
   
  
  </div>
    </>
  )
}

export default Hero