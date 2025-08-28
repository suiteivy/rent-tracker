import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Home, DollarSign, Phone } from "lucide-react";
import logo from "../assets/logo.jpeg";
import image3 from "../assets/image3.jpg";
import image2 from "../assets/image2.jpg";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
            <span className="font-bold text-xl text-pink-600">Rentease</span>
          </div>
          <div className="space-x-6 hidden md:flex">
            <a href="#home" className="hover:text-pink-600">Home</a>
            <a href="#features" className="hover:text-pink-600">Features</a>
            <a href="#pricing" className="hover:text-pink-600">Pricing</a>
            <a href="#contact" className="hover:text-pink-600">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<section
  id="home"
  className="relative flex flex-col items-center justify-center min-h-screen text-center px-4"
>
  {/* Image Container */}
  <div className="relative w-full flex justify-center">
    <div
      className="relative rounded-3xl overflow-hidden shadow-lg"
      style={{
        width: "120vw",
        maxWidth: "1100px",
        height: "600px",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
        }}
        />
  {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Simplified Renting with <span className="text-pink-600">Rentease</span>
        </motion.h1>
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          For Landlords and Tenants
        </motion.h2>

        <motion.p
          className="mb-8 text-lg text-gray-200 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Connecting landlords and tenants with hassle-free rental management
        </motion.p>
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
    >
      <button
        onClick={() => navigate("/signup")}
        className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-gray-400 shadow-md"
      >
        Sign Up
      </button>
      <button
        onClick={() => navigate("/login")}
        className="bg-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-400 shadow-md"
      >
        Login
      </button>
    </motion.div>
  </div>
  </div>
  </div>
</section>
      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 px-6">
            {[
              { icon: <Home className="w-10 h-10 text-blue-600" />, title: "Property Management", desc: "Easily track and manage all your rental properties." },
              { icon: <DollarSign className="w-10 h-10 text-green-600" />, title: "Rent Collection", desc: "Secure and hassle-free rent payment tracking." },
              { icon: <LineChart className="w-10 h-10 text-purple-600" />, title: "Finacial Analysis", desc: "Get an overall analysis of your finaces instantly." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tenants Section (replaces Pricing Section) */}
<section id="tenants" className="py-16">
  <div className="container mx-auto flex flex-col md:flex-row items-center px-6">
    {/* Image at far left */}
    <div className="md:w-1/3 w-full flex justify-center md:justify-start mb-8 md:mb-0">
      <img
        src={image2}
        alt="Tenants"
        className="rounded-2xl shadow-lg w-[400px] h-[400px] object-cover"
      />
    </div>
    {/* Information about tenants */}
    <div className="md:w-2/3 w-full md:pl-12">
      <h2 className="text-3xl font-bold mb-6">Tenant Management</h2>
      <p className="text-gray-700 mb-4 text-lg">
        Easily manage your tenants with Rentease. Keep track of tenant details, lease agreements, payment history, and communication all in one place.
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Store and update tenant contact information</li>
        <li>Monitor rent payments and outstanding balances</li>
        <li>Access lease documents and renewal reminders</li>
        <li>Send notifications and updates directly to tenants</li>
        <li>View tenant history results</li>
        </ul>
    </div>
  </div>
</section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8 px-6">
            {[
              { plan: "Basic", price: "Free", features: ["1 Property", "Basic Support"] },
              { plan: "Pro", price: "$19/mo", features: ["Up to 10 Properties", "Priority Support", "Rent Tracking"] },
              { plan: "Enterprise", price: "$49/mo", features: ["Unlimited Properties", "Dedicated Manager", "Advanced Analytics"] },
            ].map((tier, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4">{tier.plan}</h3>
                <p className="text-pink-600 text-3xl font-semibold mb-6">{tier.price}</p>
                <ul className="text-gray-600 mb-6 space-y-2">
                  {tier.features.map((f, i) => (
                    <li key={i}>✔ {f}</li>
                  ))}
                </ul>
                <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-gray-400">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
<section id="contact" className="py-16 bg-gray-50">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center justify-center md:space-x-12 text-center md:text-left">
      <motion.img
        src={logo}
        alt="Logo"
        className="md:w-1/3 w-full flex justify-center md:justify-start mb-8 md:mb-0"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      />
      <div>
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="mb-8 text-gray-600">
          Have questions? Reach out and we’ll be happy to help.
        </p>
        <div className="flex justify-center md:justify-start space-x-6">
          <a href="tel:+123456789" className="flex items-center space-x-2 text-pink-600 hover:underline">
            <Phone /> <span>+123 456 789</span>
          </a>
          <a href="mailto:info@rentease.com" className="flex items-center space-x-2 text-pink-600 hover:underline">
            <span>Email Us</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Footer */}
      <footer className="bg-white py-6 text-center text-gray-500 shadow-inner">
        © {new Date().getFullYear()} Rentease. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
