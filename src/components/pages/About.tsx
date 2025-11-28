import React from 'react';
import { Leaf, Heart, Award, Users } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Natural & Pure',
      description: 'We believe in harnessing the power of nature. Every ingredient is carefully sourced and naturally derived.'
    },
    {
      icon: Heart,
      title: 'Skin Wellness',
      description: 'Our mission is to promote healthy, radiant skin through gentle yet effective formulations.'
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'Each product undergoes rigorous testing to ensure the highest quality and efficacy standards.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We are building a community of conscious consumers who value natural beauty and wellness.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-sage-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-sage-800 mb-6">
              Our Story
            </h1>
            <p className="text-xl text-sage-700 max-w-3xl mx-auto leading-relaxed">
              Nushka was born from a simple belief: that skincare should be as pure and natural 
              as the ingredients found in nature itself. We create rituals that honor both your 
              skin and the earth.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-sage-800 mb-6">Our Mission</h2>
              <p className="text-lg text-sage-700 leading-relaxed mb-6">
                At Nushka, we believe that true beauty comes from within, nurtured by what we put on our skin. 
                Our mission is to provide pure, effective skincare products that work in harmony with your 
                skin's natural processes.
              </p>
              <p className="text-lg text-sage-700 leading-relaxed mb-6">
                We are committed to sustainability, ethical sourcing, and creating products that not only 
                make you look good but also feel good about your choices.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-800">100%</div>
                  <div className="text-sage-600 text-sm">Natural</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-800">0</div>
                  <div className="text-sage-600 text-sm">Harmful Chemicals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-800">10K+</div>
                  <div className="text-sage-600 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/7755461/pexels-photo-7755461.jpeg" 
                alt="Natural ingredients"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-sage-800 mb-4">Our Values</h2>
            <p className="text-xl text-sage-700">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-lg shadow-sm">
                <div className="bg-sage-100 p-4 rounded-full inline-block mb-4">
                  <value.icon className="h-8 w-8 text-sage-600" />
                </div>
                <h3 className="text-xl font-semibold text-sage-800 mb-3">{value.title}</h3>
                <p className="text-sage-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/7755443/pexels-photo-7755443.jpeg" 
                alt="Founder"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-sage-800 mb-6">Meet Our Founder</h2>
              <p className="text-lg text-sage-700 leading-relaxed mb-6">
                "After struggling with sensitive skin for years and trying countless products filled with 
                harsh chemicals, I decided to create something different. Nushka represents my journey 
                towards finding balance and harmony between nature and skincare."
              </p>
              <p className="text-lg text-sage-700 leading-relaxed mb-6">
                "Every product we create is tested on my own skin first. If it doesn't meet my standards 
                for purity, effectiveness, and gentleness, it doesn't make it to you."
              </p>
              <div>
                <div className="font-semibold text-sage-800">- Priya Sharma</div>
                <div className="text-sage-600">Founder & CEO, Nushka</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 bg-gradient-to-r from-sage-600 to-sage-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Committed to Sustainability
          </h2>
          <p className="text-xl text-sage-100 leading-relaxed mb-8">
            We are dedicated to protecting the environment that provides us with these beautiful ingredients. 
            Our packaging is recyclable, our sourcing is ethical, and our processes are designed to minimize 
            our environmental footprint.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div>Recyclable Packaging</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Zero</div>
              <div>Animal Testing</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div>Ethical Suppliers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
