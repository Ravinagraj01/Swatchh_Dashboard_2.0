import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const activeLinkStyle = 'text-black font-semibold';
  const normalLinkStyle = 'text-white';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 w-full text-white z-50 h-16 transition-all duration-300  ${isScrolled ? 'bg-green-800' : 'bg-green-700'}`}>
      <div className='flex justify-between p-4 align-middle'>
        <div className="w-[25%] text-3xl font-bold text-white">Swachh Dashboard</div>
        
        {/* Navigation Links */}
        <div className="flex w-[50%]">
          <ul className='flex gap-4'>
            <li><NavLink to="/" className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}>Home</NavLink></li>
            <li><NavLink to="/reports" className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}>Reports</NavLink></li>
            <li><NavLink to="/contribution" className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}>Contribution</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}>About</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}>Contact</NavLink></li>
          </ul>
        </div>

        {/* Login Button */}
        <div className="font-semibold">
          <NavLink 
            to="/login" 
            className={({ isActive }) => isActive ? activeLinkStyle : normalLinkStyle}
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
