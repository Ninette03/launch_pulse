"use client";

import React from "react";

const MainComponent = () => {
  const content = {
    hero: {
      title: "Empowering Rwanda's Young Entrepreneurs",
      subtitle:
        "Turn your business dreams into reality with expert guidance, market insights, and a supportive community",
      cta: "Start Your Journey",
    },
    features: {
      title: "What We Offer",
      items: [
        {
          title: "Business Evaluation",
          desc: "Test and validate your business ideas",
        },
        {
          title: "Market Analysis",
          desc: "Understand your target market and competition",
        },
        {
          title: "Learning Resources",
          desc: "Access guides and training materials",
        },
      ],
    },
    success: {
      title: "Success Stories",
      stories: [
        {
          name: "Marie",
          business: "Tech Solutions",
          story: "Launched a successful mobile app development company",
        },
        {
          name: "Jean",
          business: "Eco Fashion",
          story: "Created a sustainable clothing brand",
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#2C3E50] font-montserrat">
            LaunchPulse
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              <i className="fas fa-user-circle text-[#2C3E50] text-xl"></i>
              <span className="text-[#2C3E50] font-roboto">
                Ready to start?
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/Account/signin"
                className="px-6 py-2.5 bg-white border-2 border-[#2C3E50] text-[#2C3E50] rounded-lg hover:bg-[#2C3E50] hover:text-white transition-colors font-roboto font-medium"
              >
                Sign In
              </a>
              <a
                href="/Account/signup"
                className="px-6 py-2.5 bg-[#2C3E50] text-white rounded-lg hover:bg-[#1a252f] transition-colors font-roboto font-medium shadow-md"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2C3E50] font-montserrat mb-6">
            {content.hero.title}
          </h1>
          <p className="text-xl text-[#6C757D] max-w-3xl mx-auto mb-8 font-roboto">
            {content.hero.subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/Account/signup"
              className="px-8 py-3 bg-[#2C3E50] text-white rounded-lg hover:bg-[#1a252f] transition-colors font-medium"
            >
              {content.hero.cta}
            </a>
            
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C3E50] mb-16 font-montserrat">
            {content.features.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.features.items.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-[#F8F9FA] hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-[#2C3E50] mb-4 font-montserrat">
                  {feature.title}
                </h3>
                <p className="text-[#6C757D] font-roboto">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C3E50] mb-16 font-montserrat">
            {content.success.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {content.success.stories.map((story, i) => (
              <div
                key={i}
                className="p-8 rounded-xl bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#2C3E50] flex items-center justify-center text-white text-xl font-bold">
                    {story.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2C3E50] font-montserrat">
                      {story.name}
                    </h3>
                    <p className="text-[#6C757D] font-roboto">
                      {story.business}
                    </p>
                  </div>
                </div>
                <p className="text-[#6C757D] font-roboto">{story.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-[#2C3E50] text-white">
        <div className="max-w-7xl mx-auto text-center font-roboto">
          <p>© 2025 LaunchPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainComponent;