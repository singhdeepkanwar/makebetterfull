import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCode, FaBars, FaXmark, FaArrowDown, FaLaptopCode, 
  FaMobileScreen, FaPenNib, FaServer, FaCheckDouble, FaLayerGroup, 
  FaEnvelope, FaPhone, FaLinkedinIn, FaTwitter, FaGithub, FaInstagram, 
  FaBrain, FaShieldHalved, FaRocket, FaUsers
} from 'react-icons/fa6';

// Import Admin Component
import Admin from './Admin';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

// --- DEFAULT CONTENT (Now includes editable About Section) ---
const DEFAULT_CONTENT = {
  hero: {
    badge: "Innovation Studio",
    headline_part1: "We engineer digital",
    headline_highlight: "masterpieces.",
    subheadline: "Makebetter Technologies transforms ambitious ideas into scalable, high-performance software. From enterprise platforms to mobile apps, we build what's next.",
    cta_primary: "Book Consultation",
    cta_secondary: "View Services"
  },
  about: {
    badge: "Who We Are",
    headline: "Building the Future, One Line at a Time.",
    description: "DBE, Founded in 2025, Makebetter Technologies started with a simple mission: to bridge the gap between complex enterprise requirements and intuitive user experiences.\n\nWe are a team of dreamers, engineers, and designers obsessed with quality. We don't just build software; we build digital assets that compound in value over time.",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  },
  services: [
    { title: "Web & SaaS Development", description: "High-performance web applications built with React, Next.js, and Node.js. We focus on scalability and security." },
    { title: "Mobile Solutions", description: "Native and cross-platform apps (Flutter/React Native) that provide seamless experiences across iOS and Android." },
    { title: "AI/ML Solutions", description: "Custom machine learning models, predictive analytics, and process automation to make your business smarter." },
    { title: "UI/UX Design", description: "User-centric design systems that convert visitors into loyal customers. Wireframing to high-fidelity visuals." },
    { title: "Cloud Infrastructure", description: "AWS/Azure architecture, DevOps pipelines, and serverless implementation for maximum uptime." },
    { title: "Cybersecurity", description: "Enterprise-grade security audits, penetration testing, and compliance solutions to protect your digital assets." }
  ],
  stats: [
    { value: "98%", label: "On-Time Delivery" },
    { value: "50+", label: "Projects Launched" },
    { value: "3 Years", label: "Avg. Retention" },
    { value: "24/7", label: "Support Available" }
  ],
  contact_email: "deep@makebetter.tech",
  contact_phone: "+91 98721 80369"
};

const ICONS = [FaLaptopCode, FaMobileScreen, FaBrain, FaPenNib, FaServer, FaShieldHalved];

function Home() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  // Fetch Content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/content`);
        // Check if the backend response has the new structure (about section)
        if (res.data && res.data.about) {
            setContent(res.data);
        } else if (res.data) {
            // If DB has old data (no about section), merge it with defaults
            setContent({ ...DEFAULT_CONTENT, ...res.data, about: DEFAULT_CONTENT.about });
        }
      } catch (err) {
        console.warn("Backend offline or empty. Using default content.");
      }
    };
    fetchContent();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Sending...');
    try {
      await axios.post(`${API_URL}/api/content`, formData);
      setFormStatus('Message Sent!');
      setFormData({ name: '', company: '', email: '', message: '' });
    } catch (err) {
      setFormStatus('Error sending message.');
    }
  };

  return (
    <div className="relative w-full overflow-hidden text-slate-100 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[90px] opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600 rounded-full blur-[90px] opacity-30" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 top-0 border-b ${isScrolled ? 'bg-[#020617]/80 backdrop-blur-md border-white/10 py-3 shadow-lg' : 'bg-transparent border-white/0 py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 z-50">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg"><FaCode /></div>
            <span>Makebetter<span className="text-primary">Tech</span></span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            {['Services', 'About', 'Advantage'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-textMuted hover:text-white transition-colors">{item}</a>
            ))}
            <a href="#contact" className="px-6 py-2.5 bg-primary hover:bg-primaryDark text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/50">Start Project</a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white text-xl z-50">
            {isMenuOpen ? <FaXmark /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-[#020617] z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-10'}`}>
          {['Services', 'About', 'Advantage'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-2xl font-medium text-white">{item}</a>
          ))}
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-primary">Let's Talk</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 text-center">
        <div className="container mx-auto px-6 z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-surfaceHighlight border border-white/10 text-primary text-xs font-bold uppercase mb-8 shadow-lg animate-pulse">
            {content.hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            {content.hero.headline_part1} <br className="hidden md:block" />
            <span className="text-gradient-primary">{content.hero.headline_highlight}</span>
          </h1>
          <p className="text-xl text-textMuted mb-10 max-w-2xl mx-auto leading-relaxed">
            {content.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition shadow-xl">
              {content.hero.cta_primary}
            </a>
            <a href="#services" className="px-8 py-4 glass-card text-white rounded-full flex items-center justify-center gap-2 hover:bg-white/10 border border-white/10">
              {content.hero.cta_secondary} <FaArrowDown className="text-xs" />
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Expertise</h2>
              <p className="text-textMuted text-lg">Digital solutions engineered for growth and scalability.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((s, i) => {
              const Icon = ICONS[i] || FaCode;
              return (
                <div key={i} className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform h-full flex flex-col items-start">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-primary mb-6 border border-blue-500/20">
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{s.title}</h3>
                  <p className="text-textMuted text-sm leading-relaxed">{s.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* EDITABLE ABOUT SECTION */}
      <section id="about" className="py-24 relative overflow-hidden">
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
               
               {/* Visual Side (Editable Image) */}
               <div className="w-full md:w-1/2 relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                     <img 
                       src={content.about.image_url} 
                       alt="About Us" 
                       className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105"
                     />
                  </div>
               </div>

               {/* Content Side (Editable Text) */}
               <div className="w-full md:w-1/2">
                  <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">{content.about.badge}</span>
                  {/* Allow HTML line breaks if saved in JSON, or just handle string */}
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{content.about.headline}</h2>
                  <p className="text-textMuted text-lg mb-8 leading-relaxed whitespace-pre-line">
                     {content.about.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mt-1"><FaRocket /></div>
                        <div>
                           <h4 className="font-bold text-white">Innovation First</h4>
                           <p className="text-sm text-textMuted mt-1">Always using the latest tech.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mt-1"><FaUsers /></div>
                        <div>
                           <h4 className="font-bold text-white">Client Centric</h4>
                           <p className="text-sm text-textMuted mt-1">Your vision is our blueprint.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ADVANTAGE SECTION */}
      <section id="advantage" className="py-24 bg-surfaceHighlight/20 border-y border-white/5 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Makebetter Advantage</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-12">
               <div className="flex gap-6 group">
                  <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-surface border border-white/10 rounded-2xl flex items-center justify-center text-xl font-bold text-primary shadow-lg">01</div>
                      <div className="h-full w-0.5 bg-white/10 mx-auto mt-4"></div>
                  </div>
                  <div className="pb-10">
                      <h3 className="text-xl font-bold text-white mb-3">Strategic Discovery</h3>
                      <p className="text-textMuted">We dive deep into your business model to create a technical roadmap aligned with financial goals.</p>
                  </div>
              </div>
              <div className="flex gap-6 group">
                  <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-surface border border-white/10 rounded-2xl flex items-center justify-center text-xl font-bold text-primary shadow-lg">02</div>
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white mb-3">Agile Development</h3>
                      <p className="text-textMuted">Two-week sprints with clickable demos ensuring the product evolves exactly as envisioned.</p>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="glass-card p-8 rounded-2xl hover:bg-surfaceHighlight/50 transition-colors">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 mb-6"><FaCheckDouble className="text-xl" /></div>
                    <h4 className="text-xl font-bold mb-3">Transparent Communication</h4>
                    <p className="text-textMuted">Real-time updates via Slack and Jira. No hidden fees.</p>
                </div>
                <div className="glass-card p-8 rounded-2xl hover:bg-surfaceHighlight/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-6"><FaLayerGroup className="text-xl" /></div>
                    <h4 className="text-xl font-bold mb-3">Future-Proof Architecture</h4>
                    <p className="text-textMuted">Modular microservices capable of handling 10x growth.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-6">
          <div className="glass-card rounded-3xl p-8 md:p-16 border border-primary/20 bg-gradient-to-br from-surface to-surfaceHighlight flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Let's Talk</h2>
              <p className="text-lg text-textMuted mb-6">Ready to upgrade your technology? Fill out the form below.</p>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FaEnvelope /></div>
                    <span className="text-lg font-medium">{content.contact_email}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FaPhone /></div>
                    <span className="text-lg font-medium">{content.contact_phone}</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 bg-black/20 p-8 rounded-2xl border border-white/5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="Name" className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required type="text" placeholder="Company" className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <input required type="email" placeholder="Email" className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <textarea required rows={4} placeholder="Message" className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                <button className="w-full py-4 bg-primary font-bold rounded-lg hover:bg-primaryDark transition-all shadow-lg shadow-blue-500/20">{formStatus || "Send Message"}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/5 bg-black/40 text-center">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-6 mb-6">
            {[FaLinkedinIn, FaTwitter, FaGithub, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-surfaceHighlight border border-white/5 flex items-center justify-center text-textMuted hover:bg-primary hover:text-white transition-all"><Icon /></a>
            ))}
          </div>
          <p className="text-textMuted mb-4">&copy; 2025 Makebetter Technologies. All rights reserved.</p>
          <Link to="/admin" className="text-xs text-gray-700 hover:text-gray-500 transition">Admin Login</Link>
        </div>
      </footer>
    </div>
  );
}

// --- APP ROUTER ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}