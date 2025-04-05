import React from 'react';
import Footer from '../components/Footer';
import homeImage from '../assets/home_page.png';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-b from-green-700 to-green-300 text-white py-20 mt-1">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-lg text-center md:text-left">
            <h1 className="text-5xl font-bold mb-6">Welcome to Swachh Dashboard</h1>
            <p className="text-xl mb-8">Discover amazing features and contribute to a cleaner community with us.</p>
            <button className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition duration-300">
              Get Started
            </button>
          </div>
          <div className="w-[300px] h-full mt-[100px] mr-[100px] flex border-collapse justify-between">
            <img src={homeImage} alt="Clean City" className="w-[500px] h-[400px] object-cover rounded-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300">
                <div className="text-green-600 text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-green-300">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// Features Data
const features = [
  {
    icon: "🚀",
    title: "Fast & Reliable",
    description: "Experience lightning-fast performance with our optimized platform."
  },
  {
    icon: "🛡️",
    title: "Secure",
    description: "Your data is protected with enterprise-grade security measures."
  },
  {
    icon: "💡",
    title: "Innovative",
    description: "Stay ahead with cutting-edge features and regular updates."
  }
];

export default Home;
