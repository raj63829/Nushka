import React, { useState } from 'react';
import { Mail, Phone, MapPin, Star, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const info = [
    {
      title: "Visit Our Store",
      emoji: "🏢",
      icon: MapPin,
      text: "123 Natural Beauty Lane, Green Valley, Mumbai, Maharashtra 400001",
    },
    {
      title: "Email Us",
      emoji: "✉️",
      icon: Mail,
      text: "hello@nushka.com • support@nushka.com",
    },
    {
      title: "Call Us",
      emoji: "📞",
      icon: Phone,
      text: "+91 98765 43210 • +91 87654 32109",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "Nushka's gentle herb cleanser transformed my sensitive skin. The natural ingredients work wonders without any irritation.",
      rating: 5,
    },
    {
      name: "Anisha Patel",
      text: "The vitamin C serum gave me the glow I've been searching for. My skin looks brighter and more radiant than ever!",
      rating: 5,
    },
    {
      name: "Kavya Menon",
      text: "I love the rose moisturizer! The scent is divine and it keeps my skin hydrated all day. Highly recommend!",
      rating: 4,
    },
    {
      name: "Meera Singh",
      text: "The face oil is incredible. My dry skin feels nourished and looks healthy. Natural skincare at its best!",
      rating: 5,
    },
    {
      name: "Riya Gupta",
      text: "Amazing products! The clay mask cleared my pores and left my skin feeling fresh and clean.",
      rating: 4,
    },
    {
      name: "Sneha Reddy",
      text: "Nushka's skincare ritual changed my routine completely. My skin has never looked better!",
      rating: 5,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    console.log("Contact form data:", formData);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sage-50 to-cream-50 border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
              We'd Love to Hear From You
            </h1>
            <p className="text-xl text-sage-700">
              Have questions about our natural skincare products? We're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {info.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-sage-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">{item.emoji}</div>
                <item.icon className="h-6 w-6 text-sage-600" />
              </div>
              <h3 className="font-semibold text-sage-800 text-lg mb-2">{item.title}</h3>
              <p className="text-sage-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form + Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-center text-3xl font-bold text-sage-800 mb-8">Send Us a Message</h2>
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-sage-200 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-sage-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-sage-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="skincare-advice">Skincare Advice</option>
                    <option value="order-support">Order Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sage-600 text-white py-3 px-6 rounded-md font-medium hover:bg-sage-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Image/Info Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-sage-200 p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-sage-800 mb-4">Why Choose Nushka?</h3>
              <ul className="space-y-3 text-sage-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-sage-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>100% natural and organic ingredients</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-sage-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cruelty-free and environmentally conscious</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-sage-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Dermatologist tested for all skin types</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-sage-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Free shipping on orders above ₹1999</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-sage-100 to-cream-100 rounded-xl p-8">
              <img 
                src="https://images.pexels.com/photos/7755476/pexels-photo-7755476.jpeg" 
                alt="Natural skincare consultation"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h4 className="text-lg font-semibold text-sage-800 mb-2">Need Skincare Advice?</h4>
              <p className="text-sage-700">
                Our skincare experts are here to help you find the perfect routine for your skin type and concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-xl overflow-hidden border">
          <iframe
            title="SJ Soft Solutions Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.886709097833!2d78.52964237890932!3d17.369183641009148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb98e42de6e5cf%3A0x16ba31cedc2924e2!2sHoney%20Soft%20Solutions!5e0!3m2!1sen!2sin!4v1751612181457!5m2!1sen!2sin"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-sage-800 mb-8">What Our Customers Say</h2>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-6 animate-marquee"
              style={{
                animation: 'marquee 30s linear infinite',
                width: 'max-content'
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="w-80 flex-shrink-0 bg-sage-50 rounded-xl p-6 border border-sage-200"
                >
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating 
                            ? 'text-gold-400 fill-current' 
                            : 'text-sage-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sage-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-sage-800">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
};

export default Contact;
