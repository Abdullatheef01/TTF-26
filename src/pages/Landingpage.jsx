import Navbar from "../components/Navbar.jsx"
import Hero from "../components/Hero.jsx"
import About from "../components/About.jsx"
// import Event from "../components/Event.jsx"
import Contactpage from "../components/Contactpage.jsx"
import Footer from "../components/Footer.jsx"
import { Contact } from "lucide-react"
const Landingpage = () => {
  return (
    <>
     <Navbar/>
    <Hero/>
    <About/>
    <Contactpage/>
    <Footer/>
    </>
  )
}

export default Landingpage