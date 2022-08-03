import React from 'react'
import './footer.css'
import nftlogo from '../../assets/logo.png'
import { AiOutlineInstagram,AiOutlineTwitter, } from "react-icons/ai";
import { RiDiscordFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='footer section__padding'>
      <div className="footer-links">
        <div className="footer-links_logo">
        <div>
          <img src={nftlogo} alt="logo" />
          <p>DLSBT</p>
        </div>
        <div>
          <h3>Get the lastes Updates</h3>
        </div>
        <div>
          <input type="text" placeholder='Your Email' />
          <button>Email Me!</button>
        </div>
        </div>
        <div className="footer-links_div">
          <h4>CSBS</h4>
          <p>Explore</p>
          <p>How it Works</p>
          <p>Counters</p>
          <p>Contact Us</p>
        </div>
        <div className="footer-links_div">
          <h4>Support</h4>
          <p>Help center</p>
          <p>Terms of service</p>
          <p>Legal</p>
          <p>Privacy policy</p>
        </div>
      </div>
      <div className="footer-copyright">
        <div>
        <p> © {(new Date().getFullYear())} Build by Plancker^, Community. <br/>Sponsored by <a herf="https://twitter.com/CGreenpill">CGreenPill Community</a> All Rights Reserved</p>
        </div>
        <div>
          <a href='https://twitter.com/PlanckerDao'><AiOutlineInstagram size={25} color='white' className='footer-icon' /></a>
          {/* <AiOutlineTwitter size={25} color='white' className='footer-icon'/> */}
          <a href='https://twitter.com/PlanckerDao'><RiDiscordFill size={25} color='white' className='footer-icon'/></a>
          <a href='https://twitter.com/PlanckerDao'><FaTelegramPlane size={25} color='white'  className='footer-icon' /></a>
        </div>

      </div>
    </div>
  )
}

export default Footer
