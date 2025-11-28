import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sage-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-sage-600 p-2 rounded-full">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Nushka</h3>
            </div>
            <p className="text-sage-200 leading-relaxed">
              Natural skincare rituals crafted with pure ingredients from nature. 
              Nurture your skin's innate beauty with our carefully formulated products.
            </p>
            <div className="flex space-x-3">
              <button className="p-2 bg-sage-700 hover:bg-sage-600 rounded-full transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 bg-sage-700 hover:bg-sage-600 rounded-full transition-colors">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="p-2 bg-sage-700 hover:bg-sage-600 rounded-full transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 bg-sage-700 hover:bg-sage-600 rounded-full transition-colors">
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Shop All", "Skincare Rituals", "About Us", "Reviews"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sage-200 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Categories</h4>
            <ul className="space-y-3">
              {["Cleansers", "Serums", "Moisturizers", "Face Oils", "Masks"].map((category) => (
                <li key={category}>
                  <a
                    href="#"
                    className="text-sage-200 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sage-200">
                <MapPin className="h-5 w-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p>123 Natural Beauty Lane,</p>
                  <p>Green Valley, Mumbai 400001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sage-200">
                <Phone className="h-5 w-5 text-gold-400 flex-shrink-0" />
                <div>
                  <div>+91 98765 43210</div>
                  <div>+91 87654 32109</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sage-200">
                <Mail className="h-5 w-5 text-gold-400 flex-shrink-0" />
                <div>
                  <div>hello@nushka.com</div>
                  <div>support@nushka.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-700 mt-12 pt-8">
          <div className="bg-sage-700 text-sage-100 rounded-lg p-4 text-center max-w-2xl mx-auto">
            <p className="font-medium">© 2025 Nushka Natural Skincare. All Rights Reserved. Crafted with 💚 for your skin.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
