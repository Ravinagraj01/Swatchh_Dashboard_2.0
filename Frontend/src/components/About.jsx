import React from 'react';

function About() {
  return (
    <div className="p-8 bg-gradient-to-b from-green-700 to-green-300 pt-[100px]">
      <h1 className="text-4xl font-bold mb-8 text-center">About Swachh Dashboard</h1>

      {/* Section: Introduction */}
      <div className="mb-12 flex items-center">
        <div className="w-1/2 pr-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700">
          Swachh Dashboard aims to promote cleanliness by enabling users to report trash, track cleanup progress, and earn rewards for their contributions.<br/><br/> We foster community collaboration by connecting volunteers, organizations, and local authorities for effective waste management.<br/><br/> Our platform ensures transparency through real-time updates and data-driven insights for a cleaner and healthier environment.
          </p>
        </div>
        <div>
            <img src='https://images.indianexpress.com/2019/09/climate-change.jpg' 
            alt="About Us" 
            className="w-full h-fullobject-cover rounded-xl" />
        </div>
      </div>

      {/* Section: Features */}
      <h2 className="text-2xl font-semibold mb-8">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4">🗑️ Report Trash</h3>
          <p>Users can easily report trash in their locality using our mobile app with image and location details.</p>
        </div>

        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4">👷 Worker Assignment</h3>
          <p>Once reported, the nearest worker is assigned to clean the trash, ensuring a quick response.</p>
        </div>

        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4">🏆 Reward System</h3>
          <p>Users earn reward points for reporting trash, encouraging active participation in maintaining cleanliness.</p>
        </div>
      </div>

      {/* Section: Future Goals */}
      <h2 className="text-2xl font-semibold my-8">Future Goals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4">🌿 Expand Coverage</h3>
          <p>We plan to expand to more cities and towns to make a larger impact.</p>
        </div>

        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4">📊 Data Insights</h3>
          <p>Provide detailed analytics on cleanliness progress for authorities to take further action.</p>
        </div>
      </div>

      {/* Section: Conclusion */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
        <p className="text-lg text-gray-700">Become a part of the movement. Report trash, earn rewards, and make your community cleaner!</p>
      </div>
    </div>
  );
}

export default About;