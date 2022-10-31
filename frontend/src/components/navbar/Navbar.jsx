import React, { useState } from 'react'
import './navbar.css'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/logo.png'
import { Link } from "react-router-dom";
import { useAddress, useMetamask, useDisconnect, ConnectWallet } from "@thirdweb-dev/react";

const Menu = () => (
  <>
    <Link to="/create"><p>create community </p> </Link>
    <Link to="/createEvent"><p>create event </p> </Link>
    <Link to="/importSBT"><p>ImportSBT</p> </Link>
    <Link to="/eventProfile/Rian"><p>My SBT</p></Link>

  </>
)

const Navbar = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  const [toggleMenu, setToggleMenu] = useState(false)
  const [user, setUser] = useState(false)

  const handleLogout = () => {
    setUser(false);
  }
  const handleLogin = () => {
    setUser(true);
  }

  return (
    <div className='navbar'>
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
          <Link to="/">
            <h1>CSBS</h1>
          </Link>
        </div>
        <div className="navbar-links_container">
          {/* <input type="text" placeholder='Search Item Here' autoFocus={true} /> */}
          {address && <Menu />}
          {/* {user && <Link to="/"><p onClick={handleLogout}>Logout</p></Link> } */}

        </div>
      </div>
      <ConnectWallet accentColor="#f213a4" colorMode="dark" />
      {/* <div className="navbar-sign">
        <>
          {address ? (
            <>
              <button type='button' className='secondary-btn' >{address}</button>
              <button type='button' className='primary-btn' onClick={disconnect} >Disconnect</button>
            </>
          ) : (
            <button type='button' className='secondary-btn' onClick={connectWithMetamask} >Connect MetaMask</button>
          )
          }
        </>
      </div> */}
      <div className="navbar-menu">
        {toggleMenu ?
          <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
          <div className="navbar-menu_container scale-up-center" >
            <div className="navbar-menu_container-links">
              <Menu />
            </div>
            <div className="navbar-menu_container-links-sign">
              {user ? (
                <>
                  <Link to="/create">
                    <button type='button' className='primary-btn' >Create</button>
                  </Link>
                  <button type='button' className='secondary-btn'>Connect</button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button type='button' className='primary-btn' onClick={handleLogin} >Sign In</button>
                  </Link>
                  <Link to="/register">
                    <button type='button' className='secondary-btn'>Sign Up</button>
                  </Link>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
