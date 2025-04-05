import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-green-700 text-white py-8 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">About Swachh Dashboard</h2>
          <p className="text-sm">Empowering communities to keep their surroundings clean by reporting, tracking, and resolving waste issues.</p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4 ">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/reports" className="hover:text-gray-300">Reports</Link></li>
            <li><Link to="/contribution" className="hover:text-gray-300">Contribution</Link></li>
            <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="text-sm">Email: support@swachhdashboard.com</p>
          <p className="text-sm">Phone: +91 98765 43210</p>
          <p className="text-sm">Address: Bengaluru, India</p>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300"><FaFacebook size={24} /></a>
            <a href="#" className="hover:text-gray-300"><FaTwitter size={24} /></a>
            <a href="#" className="hover:text-gray-300"><FaInstagram size={24} /></a>
            <a href="#" className="hover:text-gray-300"><FaLinkedin size={24} /></a>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="text-center mt-8 text-sm border-t border-gray-600 pt-4">
        &copy; {new Date().getFullYear()} Swachh Dashboard. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
