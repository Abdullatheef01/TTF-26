import React from 'react'
import "../index.css"
import { Mail, Phone, MapPin, CalendarDays, Landmark } from 'lucide-react'
import { FaInstagram, FaYoutube } from 'react-icons/fa'

const Contact = () => {
  return (
    <div id="contact" className="contactSection">

      {/* Register button - shine sweep only, no glow */}
      <button className="registerBtn">Register</button>

      {/* 3 line description */}
      <p className="contactDesc">
        Got questions about the fest? We're just a message away.
        Reach out to us and our team will get back to you shortly.
       
      </p>

      {/* Straight scrolling marquee */}
      <div className="marqueeBand">
        <div className="marqueeTrack">
          {Array.from({ length: 2 }).map((_, loopIndex) => (
            <React.Fragment key={loopIndex}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="marqueeItem" key={i}>
                  <span>REGISTER</span>
                  <span className="marqueeStar">✳</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contact info cards */}
      <div className="contactGrid">

        <div className="infoCard">
          <h4 className="infoLabel">Get In Touch</h4>

          <div className="infoRow">
            <div className="infoIconBox"><Mail size={18} color="#ddd" /></div>
            <span>onepiecefest@sjcet.edu</span>
          </div>

          <div className="infoRow">
            <div className="infoIconBox"><Phone size={18} color="#ddd" /></div>
            <span>+91 99999 99999</span>
          </div>

          <div className="infoRow">
            <div className="infoIconBox"><Phone size={18} color="#ddd" /></div>
            <span>+91 88888 88888</span>
          </div>

          <h4 className="infoLabel followLabel">Follow Us</h4>
          <div className="socialRow">
            <div className="socialIconBox"><FaInstagram size={18} color="#ddd" /></div>
            <div className="socialIconBox"><FaYoutube size={18} color="#ddd" /></div>
            <div className="socialIconBox"><Mail size={18} color="#ddd" /></div>
          </div>
        </div>

        <div className="infoCard">
          <h4 className="infoLabel">Location & Venue</h4>

          <div className="infoRow">
            <div className="infoIconBox"><MapPin size={18} color="#ddd" /></div>
            <span>St. Joseph's College of Engineering & Technology, Thanjavur — 613 403</span>
          </div>

          <div className="infoRow">
            <div className="infoIconBox"><CalendarDays size={18} color="#ddd" /></div>
            <span>15th April 2026, 9:00 AM onwards</span>
          </div>

          <div className="infoRow">
            <div className="infoIconBox"><Landmark size={18} color="#ddd" /></div>
            <span>Main Auditorium & Computer Science Block</span>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Contact