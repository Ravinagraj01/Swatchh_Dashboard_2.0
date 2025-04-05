import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function Home() {
  const images = [
    '/assets/clean1.jpg',
    '/assets/clean2.jpg',
    '/assets/clean3.jpg'
  ];

  return (
    <div className='pt-[100px] bg-gray-500'>
      {/* Image Slider */}

      {/* About Section */}
      <section className="about-section p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to Swachh Dashboard</h1>
        <p>Swachh Dashboard promotes cleanliness by enabling users to report trash, track cleanup progress, and earn rewards. We foster community collaboration for effective waste management and ensure transparency through real-time updates.</p>
        <Link to="/about" className="text-green-600 mt-4 inline-block">Learn More About Us →</Link>
      </section>

      {/* Features Section */}
      <section className="features-section p-8 ">
        <h2 className="text-2xl font-semibold mb-4">Our Features</h2>
        <ul>
          <li>🗑 Report trash with images and location</li>
          <li>👷 Track the progress of cleanup</li>
          <li>🌿 Earn rewards for contributions</li>
          <li>📊 View detailed reports and insights</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="contact-section p-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>Have questions or want to collaborate? Reach out to us!</p>
        <Link to="/contact" className="text-green-600 mt-4 inline-block">Contact Us →</Link>
      </section>
      <Footer/>
    </div>
  );
}

export default Home;
