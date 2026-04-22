import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, ShoppingBag, Instagram, Facebook, 
  ChevronDown, ArrowRight, Leaf, ShieldCheck, Clock, FileText, 
  Settings, LogOut, Plus, Edit2, Trash2, Save, Eye
} from 'lucide-react';
import { cn } from './lib/utils';
import SEO from './components/SEO';
import { initialProducts, initialBlogs, initialSiteConfig } from './data/mockData';

// --- Components ---

const Header = ({ config, onSearch }: { config: any, onSearch: (q: string) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Spices', path: '/spices', mega: true },
    { name: 'Blog', path: '/blog' },
    { name: 'Transparency', path: '/transparency' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-serif font-bold text-terracotta tracking-tight">Aswad Herbs</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-terracotta",
                  location.pathname === link.path ? "text-terracotta" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex flex-col items-end mr-4">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Call Us</span>
              <a href="tel:7499585453" className="text-sm font-bold text-forest hover:text-terracotta transition-colors">7499585453</a>
            </div>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-terracotta transition-colors"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link 
              to="/admin" 
              className="hidden sm:flex items-center space-x-2 bg-stone-100 px-4 py-2 rounded-full text-sm font-bold text-gray-600 hover:bg-stone-200 transition-all"
              aria-label="Admin Dashboard"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <Link to="/admin" className="sm:hidden p-2 text-gray-500 hover:text-terracotta transition-colors" aria-label="Admin Dashboard Mobile">
              <Settings className="w-5 h-5" />
            </Link>
            <button 
              className="md:hidden p-2 text-gray-500" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-lg"
          >
            <div className="max-w-3xl mx-auto flex items-center">
              <input
                type="text"
                placeholder="Search for spices, recipes, or articles..."
                className="w-full p-3 border-none focus:ring-0 text-lg"
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              <button onClick={() => setIsSearchOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-terracotta"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-forest text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 mb-6">
            <Leaf className="text-turmeric w-6 h-6" />
            <span className="text-xl font-serif font-bold tracking-tight">Aswad Herbs</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Authentic, naturally grown, homemade spices. Bringing the true essence of nature to your kitchen.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-6 text-turmeric">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/spices" className="hover:text-white transition-colors">Spice Catalog</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Recipes & Blog</Link></li>
            <li><Link to="/transparency" className="hover:text-white transition-colors">Transparency</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-6 text-turmeric">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li>Email: info@aswadherbs.com</li>
            <li>Phone: <a href="tel:7499585453" className="hover:text-white transition-colors">7499585453</a></li>
            <li>Location: Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-gray-400 mb-4 md:mb-0">© 2024 Aswad Herbs. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram Profile"><Instagram className="w-5 h-5" /></a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook Profile"><Facebook className="w-5 h-5" /></a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = ({ 
  config, 
  products 
}: { 
  config: any, 
  products: any[]
}) => (
  <div className="space-y-24 pb-24">
    <SEO 
      title="Home" 
      description="Authentic homemade spices from Aswad Herbs. Naturally grown, stone-ground, and 100% pesticide-free."
    />
    {/* Hero Section with Video Background */}
    <section className="relative h-[85vh] flex items-center overflow-hidden animate-fade-in">
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover brightness-[0.4]"
          poster="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1920"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-sunlight-shining-through-the-leaves-of-a-tree-41235-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <span className="inline-block px-4 py-1 bg-turmeric text-forest font-bold text-xs uppercase tracking-widest rounded-full mb-6">
              100% Pesticide & Chemical Free
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              {config.content.heroTitle}
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              {config.content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/spices" className="btn-primary group">
                Shop Authentic Spices <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all text-center">
                Our Traditional Process
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            <div className="space-y-4 pt-12">
              <img 
                src={config.content.heroImages?.[0] || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400"} 
                alt="Fresh Spices" 
                className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
              />
              <img 
                src={config.content.heroImages?.[1] || "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=400"} 
                alt="Spice Blend" 
                className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
              />
            </div>
            <div className="space-y-4">
              <img 
                src={config.content.heroImages?.[2] || "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400"} 
                alt="Malvani Spices" 
                className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
              />
              <img 
                src={config.content.heroImages?.[3] || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400"} 
                alt="Maharashtrian Food" 
                className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Featured Categories */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-4">Our Specialty Blends</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Hand-ground and naturally processed to preserve the essential oils and authentic flavor.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.slice(0, 3).map((product, idx) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer card-premium"
          >
            <Link to="/spices" className="block h-full">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={`${product.name} - Authentic Aswad Herbs Spice`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs font-bold text-turmeric uppercase tracking-widest mb-2 block">{product.category}</span>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{product.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Values / Features */}
    <section className="bg-forest py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="text-turmeric w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl mb-3">No Pesticides</h4>
            <p className="text-gray-400 text-sm">Grown in a natural environment without any harmful chemical pesticides.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-turmeric w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl mb-3">No Chemicals</h4>
            <p className="text-gray-400 text-sm">100% natural processing. No artificial colors, preservatives, or additives.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-turmeric w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl mb-3">Hand-Made</h4>
            <p className="text-gray-400 text-sm">Traditional hand-pounding and stone-grinding to preserve natural oils.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-turmeric w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl mb-3">Trust & Purity</h4>
            <p className="text-gray-400 text-sm">Complete transparency in our sourcing and traditional production methods.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials / Reviews Section */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-4">Customer Reviews</h2>
        <p className="text-gray-600">Real stories from families who trust Aswad Herbs for their daily meals.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Sunita Deshmukh",
            location: "Ratnagiri",
            review: "The Malvani Masala is truly authentic. I can smell the sun-dried spices the moment I open the pack. No other brand comes close to this hand-made quality.",
            rating: 5
          },
          {
            name: "Anjali Kulkarni",
            location: "Pune",
            review: "I was worried about pesticides in store-bought turmeric. Aswad Herbs' turmeric is so pure and vibrant. Knowing it's chemical-free gives me peace of mind.",
            rating: 5
          },
          {
            name: "Vikram Patil",
            location: "Kolhapur",
            review: "The Kanda-Lasun masala is a game changer for my mutton curries. The stone-ground texture makes a huge difference in the final taste. Highly recommended!",
            rating: 5
          }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
          >
            <div className="flex text-turmeric mb-4">
              {[...Array(item.rating)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-gray-600 italic mb-6">"{item.review}"</p>
            <div>
              <p className="font-bold text-forest">{item.name}</p>
              <p className="text-xs text-gray-400">{item.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

const AboutPage = ({ config }: { config: any }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <SEO 
      title="Our Story" 
      description="Learn about Aswad Herbs' commitment to traditional spice-making, natural farming, and authentic Indian flavors."
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <span className="text-terracotta font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-8">Rooted in Tradition, Grown with Love</h1>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>{config.content.aboutStory}</p>
          <p>
            At Aswad Herbs, we believe that the best flavors come from patience and respect for nature. 
            Our spices are not just ingredients; they are a legacy of authentic Indian culinary heritage.
          </p>
          <div className="pt-8 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-3xl font-serif font-bold text-terracotta mb-2">100%</h4>
              <p className="text-sm">Natural Ingredients</p>
            </div>
            <div>
              <h4 className="text-3xl font-serif font-bold text-terracotta mb-2">24+</h4>
              <p className="text-sm">Unique Blends</p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={config.content.aboutImage || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200"} 
            alt="Traditional Spice Grinding Process at Aswad Herbs" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-8 -left-8 bg-turmeric p-8 rounded-2xl shadow-xl hidden md:block max-w-xs">
          <p className="text-forest font-serif font-bold text-lg italic">"Flavor is the heart of every home, and purity is the soul of every flavor."</p>
        </div>
      </div>
    </div>
  </div>
);

const BlogPage = ({ blogs }: { blogs: any[] }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <SEO 
      title="Recipes & Blog" 
      description="Explore traditional recipes, medicinal benefits of spices, and stories from our natural farms in our herbal wisdom blog."
    />
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-4">Recipes & Herbal Wisdom</h1>
      <p className="text-gray-600">Explore the world of spices, their health benefits, and traditional recipes.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {blogs.map((blog) => (
        <article key={blog.id} className="group">
          <div className="aspect-video rounded-2xl overflow-hidden mb-6 shadow-md">
            <img 
              src={blog.image} 
              alt={`${blog.title} - Aswad Herbs Blog`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center text-xs text-terracotta font-bold uppercase tracking-widest mb-3">
            <span>{blog.date}</span>
            <span className="mx-2">•</span>
            <span>{blog.author}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-forest mb-4 group-hover:text-terracotta transition-colors">{blog.title}</h2>
          <p className="text-gray-600 mb-6 line-clamp-3">{blog.excerpt}</p>
          <Link to={`/blog/${blog.id}`} className="text-forest font-bold flex items-center group-hover:translate-x-2 transition-transform">
            Read More <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </article>
      ))}
    </div>
  </div>
);

const BlogPostDetailPage = ({ blogs }: { blogs: any[] }) => {
  const { id } = useParams();
  const blog = blogs.find(b => b.id === id);

  if (!blog) return <div className="py-24 text-center">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <SEO 
        title={blog.title} 
        description={blog.excerpt} 
        image={blog.image}
        article={true}
      />
      <Link to="/blog" className="inline-flex items-center text-terracotta font-bold mb-8 hover:-translate-x-2 transition-transform">
        <ArrowRight className="mr-2 w-4 h-4 rotate-180" /> Back to Blog
      </Link>
      <article className="animate-fade-in">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full aspect-video object-cover rounded-3xl shadow-xl mb-12" 
          referrerPolicy="no-referrer"
        />
        <div className="flex items-center text-sm text-terracotta font-bold uppercase tracking-widest mb-6">
          <span>{blog.date}</span>
          <span className="mx-2">•</span>
          <span>{blog.author}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-forest mb-8 leading-tight">{blog.title}</h1>
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
          {blog.content.split('\n').map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </div>
  );
};

const TransparencyPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <SEO 
      title="Transparency & Organic Standards" 
      description="Review our organic certifications, quality control documents, and B2B transparency standards."
    />
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-4">Meetings & Documents</h1>
      <p className="text-gray-600">Our commitment to organic standards and B2B transparency.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-6">
        <div className="p-4 bg-forest/10 rounded-xl">
          <FileText className="text-forest w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-forest mb-2">Organic Certification 2024</h3>
          <p className="text-gray-500 text-sm mb-4">Verified organic farming practices and soil health reports.</p>
          <button className="text-terracotta font-bold text-sm hover:underline">Download PDF</button>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-6">
        <div className="p-4 bg-forest/10 rounded-xl">
          <ShieldCheck className="text-forest w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-forest mb-2">Quality Control Standards</h3>
          <p className="text-gray-500 text-sm mb-4">Detailed breakdown of our grinding and packaging protocols.</p>
          <button className="text-terracotta font-bold text-sm hover:underline">Download PDF</button>
        </div>
      </div>
    </div>
  </div>
);

// --- Admin Dashboard ---

const AdminDashboard = ({ 
  config, setConfig, 
  products, setProducts, 
  blogs, setBlogs,
  onSave
}: { 
  config: any, setConfig: any, 
  products: any[], setProducts: any, 
  blogs: any[], setBlogs: any,
  onSave: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'products' | 'blogs'>('content');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple demo password
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    if (products.find(p => p.id === updatedProduct.id)) {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } else {
      setProducts([...products, updatedProduct]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct({
      id: 'p' + Date.now(),
      name: '',
      category: 'Specialty',
      price: 0,
      image: '',
      description: '',
      tags: []
    });
  };

  const handleUpdateBlog = (updatedBlog: any) => {
    if (blogs.find(b => b.id === updatedBlog.id)) {
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b));
    } else {
      setBlogs([...blogs, updatedBlog]);
    }
    setEditingBlog(null);
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  const handleAddBlog = () => {
    setEditingBlog({
      id: 'b' + Date.now(),
      title: '',
      excerpt: '',
      content: '',
      author: 'Aswad Kitchen',
      date: new Date().toISOString().split('T')[0],
      image: ''
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
          <h2 className="text-2xl font-serif font-bold text-forest mb-6 text-center">Admin Access</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-terracotta focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>
            <button type="submit" className="w-full bg-terracotta text-white py-3 rounded-md font-bold hover:bg-red-800 transition-colors">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage your spices, content, and blog posts.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="flex items-center text-sm font-bold text-gray-500 hover:text-forest bg-gray-100 px-4 py-2 rounded-md transition-all">
            View Site
          </Link>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-sm font-bold text-gray-500 hover:text-terracotta bg-gray-100 px-4 py-2 rounded-md transition-all">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </div>

      <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
        {(['content', 'products', 'blogs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-2 text-sm font-bold uppercase tracking-widest transition-all rounded-lg",
              activeTab === tab ? "bg-white text-terracotta shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {activeTab === 'content' && (
          <div className="space-y-8">
            <h3 className="text-xl font-serif font-bold mb-6">Site Content & Theme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hero Title</label>
                <input 
                  type="text" 
                  value={config.content.heroTitle}
                  onChange={(e) => setConfig({ ...config, content: { ...config.content, heroTitle: e.target.value } })}
                  className="w-full p-3 border border-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hero Subtitle</label>
                <textarea 
                  value={config.content.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, content: { ...config.content, heroSubtitle: e.target.value } })}
                  className="w-full p-3 border border-gray-200 rounded-md h-24"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-gray-700 mb-2">About Story</label>
                <textarea 
                  value={config.content.aboutStory}
                  onChange={(e) => setConfig({ ...config, content: { ...config.content, aboutStory: e.target.value } })}
                  className="w-full p-3 border border-gray-200 rounded-md h-48"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-gray-700 mb-2">About Page Image URL</label>
                <input 
                  type="text" 
                  value={config.content.aboutImage}
                  onChange={(e) => setConfig({ ...config, content: { ...config.content, aboutImage: e.target.value } })}
                  className="w-full p-3 border border-gray-200 rounded-md mb-4"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-bold text-gray-700 mb-4">Hero Section Images (4 URLs)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(config.content.heroImages || []).map((url: string, idx: number) => (
                    <div key={idx}>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Image {idx + 1}</label>
                      <input 
                        type="text" 
                        value={url}
                        onChange={(e) => {
                          const newImages = [...config.content.heroImages];
                          newImages[idx] = e.target.value;
                          setConfig({ ...config, content: { ...config.content, heroImages: newImages } });
                        }}
                        className="w-full p-2 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold">Manage Products</h3>
              <button 
                onClick={handleAddProduct}
                className="bg-forest text-white px-4 py-2 rounded-md flex items-center text-sm font-bold hover:bg-green-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </button>
            </div>

            {editingProduct && (
              <div className="bg-stone-50 p-6 rounded-xl border border-gray-200 mb-8">
                <h4 className="font-serif font-bold mb-4">
                  {products.find(p => p.id === editingProduct.id) ? 'Edit Product' : 'Add New Product'}: {editingProduct.name || 'New Spice'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Product Name</label>
                    <input 
                      type="text" 
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                      placeholder="e.g. Malvani Masala"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Image URL (Icon/Photo)</label>
                    <input 
                      type="text" 
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                    <select 
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    >
                      <option value="Specialty">Specialty</option>
                      <option value="Protein">Protein</option>
                      <option value="Maharashtrian Staples">Maharashtrian Staples</option>
                      <option value="Daily Essentials">Daily Essentials</option>
                      <option value="Raw Ingredients">Raw Ingredients</option>
                      <option value="Modern Fusion">Modern Fusion</option>
                    </select>
                  </div>
                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                    <textarea 
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm h-20"
                      placeholder="Describe the spice blend..."
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleUpdateProduct(editingProduct)}
                    className="bg-forest text-white px-4 py-2 rounded-md text-sm font-bold"
                  >
                    {products.find(p => p.id === editingProduct.id) ? 'Update Product' : 'Add Product'}
                  </button>
                  <button 
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="group">
                      <td className="py-4">
                        <div className="flex items-center">
                          <img src={product.image} className="w-10 h-10 rounded-md object-cover mr-4" />
                          <span className="font-medium text-gray-700">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-500">{product.category}</td>
                      <td className="py-4 text-sm font-bold text-terracotta">₹{product.price}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link to="/spices" className="p-2 text-gray-400 hover:text-forest" title="View on Spices Page">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-gray-400 hover:text-forest"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold">Manage Blog Posts</h3>
              <button 
                onClick={handleAddBlog}
                className="bg-forest text-white px-4 py-2 rounded-md flex items-center text-sm font-bold hover:bg-green-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> New Post
              </button>
            </div>

            {editingBlog && (
              <div className="bg-stone-50 p-6 rounded-xl border border-gray-200 mb-8">
                <h4 className="font-serif font-bold mb-4">
                  {blogs.find(b => b.id === editingBlog.id) ? 'Edit Post' : 'New Blog Post'}: {editingBlog.title || 'Untitled'}
                </h4>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={editingBlog.title}
                      onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                    <input 
                      type="text" 
                      value={editingBlog.image}
                      onChange={(e) => setEditingBlog({...editingBlog, image: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Excerpt</label>
                    <textarea 
                      value={editingBlog.excerpt}
                      onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm h-16"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Full Content</label>
                    <textarea 
                      value={editingBlog.content}
                      onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm h-40"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleUpdateBlog(editingBlog)}
                    className="bg-forest text-white px-4 py-2 rounded-md text-sm font-bold"
                  >
                    {blogs.find(b => b.id === editingBlog.id) ? 'Update Post' : 'Add Post'}
                  </button>
                  <button 
                    onClick={() => setEditingBlog(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <img src={blog.image} className="w-16 h-12 rounded-md object-cover mr-6" />
                    <div>
                      <h4 className="font-bold text-gray-700">{blog.title}</h4>
                      <p className="text-xs text-gray-400">{blog.date} • {blog.author}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/blog`} className="p-2 text-gray-400 hover:text-forest" title="View Blog">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => setEditingBlog(blog)}
                      className="p-2 text-gray-400 hover:text-forest"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className={cn(
              "flex-1 bg-terracotta text-white px-8 py-3 rounded-md font-bold flex items-center justify-center shadow-lg transition-all",
              isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-red-800"
            )}
          >
            <Save className="w-5 h-5 mr-2" /> 
            {isSaving ? "Saving..." : "Save All Changes"}
          </button>
          <button 
            onClick={async () => {
              await handleSaveAll();
              window.location.href = '/';
            }}
            disabled={isSaving}
            className={cn(
              "flex-1 bg-forest text-white px-8 py-3 rounded-md font-bold flex items-center justify-center shadow-lg transition-all",
              isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-green-800"
            )}
          >
            <ArrowRight className="w-5 h-5 mr-2" /> 
            {isSaving ? "Saving..." : "Save & View Site"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [config, setConfig] = useState(initialSiteConfig);
  const [products, setProducts] = useState(initialProducts);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const location = useLocation();

  // Sync filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // --- Data Persistence ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          if (data.config && Object.keys(data.config).length > 0) setConfig(data.config);
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
            setFilteredProducts(data.products);
          }
          if (data.blogs && data.blogs.length > 0) setBlogs(data.blogs);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, products, blogs })
      });
      if (response.ok) {
        setToast({ message: "Changes saved successfully!", type: 'success' });
        setTimeout(() => setToast(null), 3000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      setToast({ message: "Failed to save changes.", type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header config={config} onSearch={handleSearch} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <HomePage 
              config={config} 
              products={filteredProducts} 
            />
          } />
          <Route path="/about" element={<AboutPage config={config} />} />
          <Route path="/blog" element={<BlogPage blogs={blogs} />} />
          <Route path="/blog/:id" element={<BlogPostDetailPage blogs={blogs} />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/admin" element={
            <>
              <SEO title="Admin Dashboard" description="Secure management portal for Aswad Herbs content and products." />
              <AdminDashboard 
                config={config} setConfig={setConfig} 
                products={products} setProducts={setProducts} 
                blogs={blogs} setBlogs={setBlogs} 
                onSave={handleSave}
              />
            </>
          } />
          <Route path="/spices" element={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <SEO 
                title="Our Spice Collection" 
                description="Browse our premium selection of homemade spices and specialty blends, including Malvani Masala, Turmeric, and more."
              />
              <h1 className="text-4xl font-serif font-bold text-forest mb-12">Our Spice Collection</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} to="/" onClick={(e) => {
                    // Prevent default to stay on same page or scroll to top if needed
                    // But maybe redirect to home is better? 
                    // Let's just make it a link to home for now as "website itself"
                  }}>
                    <div className="card-premium group h-full">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={`${product.name} - Aswad Herbs Premium Spice`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-xs font-bold text-terracotta uppercase tracking-widest mb-2 block">{product.category}</span>
                        <h3 className="text-xl font-serif font-bold text-forest mb-2">{product.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-forest">₹{product.price}</span>
                          <button className="p-2 bg-forest text-white rounded-full hover:bg-terracotta transition-colors shadow-md">
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-2xl z-[100] font-bold text-white",
              toast.type === 'success' ? "bg-forest" : "bg-terracotta"
            )}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
