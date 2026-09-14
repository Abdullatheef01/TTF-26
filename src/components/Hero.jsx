import Video from '../assets/video.mp4'
const Hero = () => {
  return (
    <>
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
       <div class="absolute  inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/60">
        <p class="text-white text-base md:text-lg mt-4 max-w-xl">
      Your supporting sentence goes here.
    </p>
    <h1 class="text-white text-3xl md:text-5xl font-bold">
      Your Heading Here
    </h1>
   
  </div>
    </>
  )
}

export default Hero