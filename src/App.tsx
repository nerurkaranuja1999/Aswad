import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, ShoppingBag, Instagram, Facebook, 
  ChevronDown, ArrowRight, Leaf, ShieldCheck, Clock, FileText, 
  Settings, LogOut, Plus, Edit2, Trash2, Save, Eye,
  ShoppingCart, Minus, Trash, LogIn
} from 'lucide-react';
import { cn } from './lib/utils';
import SEO from './components/SEO';
import { initialProducts, initialBlogs, initialSiteConfig } from './data/mockData';

// Firebase Imports
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { auth, db, loginWithGoogle, logout } from './lib/firebase';

// --- Components ---

const InlineImageEdit = ({ 
  currentImage, 
  onUpdate, 
  isAdmin 
}: { 
  currentImage: string, 
  onUpdate: (url: string) => void, 
  isAdmin: boolean 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(currentImage);

  if (!isAdmin) return null;

  return (
    <div className="absolute top-2 right-2 z-30">
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="p-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-forest hover:text-terracotta transition-colors group"
        title="Change Image"
      >
        <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl space-y-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-forest">Change Image URL</h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <img src={newUrl || currentImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <input 
                  type="text" 
                  value={newUrl} 
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-terracotta outline-none text-sm"
                  placeholder="Paste Unsplash or direct image URL..."
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    onUpdate(newUrl);
                    setIsEditing(false);
                  }}
                  className="flex-1 bg-terracotta text-white py-3 rounded-lg font-bold hover:bg-forest transition-colors flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" /> Update Image
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setNewUrl(currentImage); // Reset
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center italic">
                Note: Don't forget to click "Save All Changes" in Admin menu to persist across sessions.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQty 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  items: any[], 
  onRemove: (id: string) => void,
  onUpdateQty: (id: string, delta: number) => void
}) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-stone-50">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="text-forest w-6 h-6" />
                <h2 className="text-2xl font-serif font-bold text-forest">Your Spice Bag</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-200" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-forest mb-2">Bag is empty</h3>
                    <p className="text-gray-400 text-sm">Looks like you haven't added any spices yet.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Shop Spices Now
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex space-x-4 animate-fade-in">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-serif font-bold text-forest uppercase text-sm tracking-tight">{item.name}</h4>
                        <span className="font-bold text-terracotta">₹{item.price * item.quantity}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3 border border-stone-200 rounded-full px-3 py-1">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="text-gray-400 hover:text-terracotta disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-forest min-w-[1rem] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="text-gray-400 hover:text-forest"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-stone-50 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-forest">₹{total}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button className="w-full bg-forest text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-800 transition-all flex items-center justify-center group">
                    Checkout Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full bg-white text-gray-500 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center"
                  >
                    Shop More
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-[0.2em]">Free delivery on orders above ₹500</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header = ({ config, onSearch, isAdmin, setIsAdmin, cartCount, onOpenCart }: { config: any, onSearch: (q: string) => void, isAdmin: boolean, setIsAdmin: (val: boolean) => void, cartCount: number, onOpenCart: () => void }) => {
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
    ...(isAdmin ? [{ name: 'Admin Dashboard', path: '/admin' }] : [])
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
            
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-500 hover:text-terracotta transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            {isAdmin ? (
              <button 
                onClick={() => {
                  setIsAdmin(false);
                  logout();
                }}
                className="hidden sm:flex items-center space-x-2 bg-stone-100 px-4 py-2 rounded-full text-sm font-bold text-red-600 hover:bg-stone-200 transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/admin" 
                className="hidden sm:flex items-center space-x-2 bg-stone-100 px-4 py-2 rounded-full text-sm font-bold text-gray-600 hover:bg-stone-200 transition-all"
                aria-label="Admin Dashboard"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            <Link to="/admin" className="sm:hidden p-2 text-gray-500 hover:text-terracotta transition-colors" aria-label="Admin Dashboard Mobile">
              {isAdmin ? <LogOut className="w-5 h-5 text-red-500" onClick={(e) => { e.preventDefault(); setIsAdmin(false); logout(); }} /> : <Settings className="w-5 h-5" />}
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

const Footer = ({ isAdmin, setIsAdmin }: { isAdmin: boolean, setIsAdmin: (val: boolean) => void }) => (
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
          {!isAdmin && (
            <Link to="/admin" className="text-[10px] text-white/20 mt-4 inline-block hover:text-white/50 transition-colors">
              Admin Login
            </Link>
          )}
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
  products,
  isAdmin,
  onUpdateConfig,
  onUpdateProduct,
  onAddToCart
}: { 
  config: any, 
  products: any[],
  isAdmin: boolean,
  onUpdateConfig: (config: any) => void,
  onUpdateProduct: (product: any) => void,
  onAddToCart: (p: any) => void
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
              <div className="relative">
                <img 
                  src={config.content.heroImages?.[0] || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400"} 
                  alt="Fresh Spices" 
                  className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
                />
                <InlineImageEdit 
                  isAdmin={isAdmin} 
                  currentImage={config.content.heroImages?.[0]} 
                  onUpdate={(url) => {
                    const newImages = [...config.content.heroImages];
                    newImages[0] = url;
                    onUpdateConfig({ ...config, content: { ...config.content, heroImages: newImages } });
                  }}
                />
              </div>
              <div className="relative">
                <img 
                  src={config.content.heroImages?.[1] || "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=400"} 
                  alt="Spice Blend" 
                  className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
                />
                <InlineImageEdit 
                  isAdmin={isAdmin} 
                  currentImage={config.content.heroImages?.[1]} 
                  onUpdate={(url) => {
                    const newImages = [...config.content.heroImages];
                    newImages[1] = url;
                    onUpdateConfig({ ...config, content: { ...config.content, heroImages: newImages } });
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={config.content.heroImages?.[2] || "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400"} 
                  alt="Malvani Spices" 
                  className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
                />
                <InlineImageEdit 
                  isAdmin={isAdmin} 
                  currentImage={config.content.heroImages?.[2]} 
                  onUpdate={(url) => {
                    const newImages = [...config.content.heroImages];
                    newImages[2] = url;
                    onUpdateConfig({ ...config, content: { ...config.content, heroImages: newImages } });
                  }}
                />
              </div>
              <div className="relative">
                <img 
                  src={config.content.heroImages?.[3] || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400"} 
                  alt="Maharashtrian Food" 
                  className="rounded-2xl shadow-2xl border-4 border-white/10 aspect-[4/5] object-cover"
                />
                <InlineImageEdit 
                  isAdmin={isAdmin} 
                  currentImage={config.content.heroImages?.[3]} 
                  onUpdate={(url) => {
                    const newImages = [...config.content.heroImages];
                    newImages[3] = url;
                    onUpdateConfig({ ...config, content: { ...config.content, heroImages: newImages } });
                  }}
                />
              </div>
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
            className="group cursor-pointer card-premium overflow-hidden"
          >
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={product.image} 
                alt={`${product.name} - Authentic Aswad Herbs Spice`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors" />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
                className="absolute top-4 right-4 p-3 bg-white text-forest rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-terracotta hover:text-white"
              >
                <Plus className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-bold text-turmeric uppercase tracking-widest mb-2 block">{product.category}</span>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-serif font-bold text-white">₹{product.price}</span>
                  <Link to="/spices" className="text-white/80 hover:text-white text-xs uppercase tracking-widest font-bold border-b border-white/20 pb-1">Details</Link>
                </div>
              </div>
            </div>
            <InlineImageEdit 
              isAdmin={isAdmin} 
              currentImage={product.image} 
              onUpdate={(url) => onUpdateProduct({ ...product, image: url })} 
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link 
          to="/spices" 
          className="inline-flex items-center space-x-3 text-forest font-bold uppercase tracking-[0.2em] hover:text-terracotta transition-all group"
        >
          <span>Shop More Spices</span>
          <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center group-hover:bg-terracotta transition-colors">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
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

const AboutPage = ({ config, isAdmin, onUpdateConfig }: { config: any, isAdmin: boolean, onUpdateConfig: (c: any) => void }) => (
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
        <InlineImageEdit 
          isAdmin={isAdmin} 
          currentImage={config.content.aboutImage} 
          onUpdate={(url) => onUpdateConfig({ ...config, content: { ...config.content, aboutImage: url } })} 
        />
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
  onSave,
  isLoggedIn,
  setIsLoggedIn,
  user
}: { 
  config: any, setConfig: any, 
  products: any[], setProducts: any, 
  blogs: any[], setBlogs: any,
  onSave: () => void,
  isLoggedIn: boolean,
  setIsLoggedIn: (val: boolean) => void,
  user: User | null | undefined
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'products' | 'blogs'>('content');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'aswadadmin123' || password === 'admin123') { 
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect admin password. Please try again.');
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
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-stone-100"
        >
          <div className="w-16 h-16 bg-forest rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Settings className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-forest text-center mb-2">Secure Access</h2>
          <p className="text-gray-400 text-center mb-8 text-sm uppercase tracking-widest font-medium">Administrator Portal</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Admin Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className={cn(
                  "w-full p-4 bg-stone-50 border rounded-xl focus:ring-2 focus:ring-terracotta outline-none transition-all",
                  error ? "border-red-500 bg-red-50" : "border-stone-200"
                )}
              />
              {error && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-forest text-white py-4 rounded-xl font-bold hover:bg-terracotta transition-all shadow-lg hover:shadow-xl active:scale-95">
              Enter Dashboard
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-stone-100">
            <p className="text-xs text-gray-400 text-center mb-4 uppercase tracking-widest">Or verify via Google</p>
            <button 
              onClick={loginWithGoogle}
              className="w-full bg-white border border-stone-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-stone-50 transition-all flex items-center justify-center shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google" className="w-4 h-4 mr-3" />
              Sign in with Google
            </button>
            {user === undefined ? (
              <p className="mt-4 text-[10px] text-center text-gray-400 animate-pulse font-bold tracking-widest">Verifying Identity...</p>
            ) : user && (
              <p className="mt-4 text-[10px] text-center text-gray-400 flex flex-col items-center">
                <span>Signed in as: <span className="font-bold text-forest">{user.email}</span></span>
                {user.email === 'nerurkaranuja1999@gmail.com' ? (
                  <span className="mt-1 text-green-500 font-bold uppercase tracking-tighter bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Owner Verified</span>
                ) : (
                  <span className="mt-1 text-red-400 font-bold uppercase tracking-tighter italic">External User - Restricted Access</span>
                )}
              </p>
            )}
          </div>
        </motion.div>
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
  const [user, setUser] = useState<User | null | undefined>(undefined);
  
  const isOwner = user?.email === 'nerurkaranuja1999@gmail.com';
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aswadAdmin') === 'true';
    }
    return false;
  });

  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aswadCart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Firebase Listeners ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email === 'nerurkaranuja1999@gmail.com') {
        setIsLoggedIn(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Sync
  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'config', 'site'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as any);
      }
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = snapshot.docs.map(d => ({ ...d.data() }));
      if (prods.length > 0) {
        setProducts(prods as any);
        setFilteredProducts(prods as any);
      }
    });

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const blgs = snapshot.docs.map(d => ({ ...d.data() }));
      if (blgs.length > 0) {
        setBlogs(blgs as any);
      }
    });

    return () => {
      unsubConfig();
      unsubProducts();
      unsubBlogs();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('aswadAdmin', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('aswadCart', JSON.stringify(cart));
  }, [cart]);

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleAddToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToast({ message: `${product.name} added to bag!`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();

  // Sync filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Initial Data Migration (if Firestore is empty)
  useEffect(() => {
    const migrateData = async () => {
      try {
        const configSnap = await getDoc(doc(db, 'config', 'site'));
        
        // If config doesn't exist AND the current user is the owner, try to migrate
        if (!configSnap.exists() && isOwner) {
          console.log("Firestore is empty. Migrating local data...");
          await setDoc(doc(db, 'config', 'site'), initialSiteConfig);
          
          const batch = writeBatch(db);
          initialProducts.forEach(p => {
            batch.set(doc(db, 'products', p.id), p);
          });
          initialBlogs.forEach(b => {
            batch.set(doc(db, 'blogs', b.id), b);
          });
          await batch.commit();
        }
      } catch (err) {
        // Only log error for the owner to avoid console noise for visitors
        if (isOwner) {
          console.error("Migration/Check failed:", err);
          setToast({ message: "Initial sync failed. Please check internet connection.", type: 'error' });
        }
      }
    };
    
    // We only run the migration once we know the auth state
    if (user !== undefined) {
      migrateData();
    }
  }, [user, isOwner]);

  const handleSave = async () => {
    if (!isLoggedIn && !isOwner) {
      setToast({ message: "You must be logged in as admin to save.", type: 'error' });
      return;
    }

    try {
      // Save to Firebase
      await setDoc(doc(db, 'config', 'site'), config);
      
      const batch = writeBatch(db);
      products.forEach(p => {
        batch.set(doc(db, 'products', p.id), p);
      });
      blogs.forEach(b => {
        batch.set(doc(db, 'blogs', b.id), b);
      });
      await batch.commit();

      setToast({ message: "Changes synced across all devices!", type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Firebase save error:", error);
      setToast({ message: "Sync failed. Check permissions.", type: 'error' });
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
      <Header 
        config={config} 
        onSearch={handleSearch} 
        isAdmin={isLoggedIn} 
        setIsAdmin={setIsLoggedIn} 
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <HomePage 
              config={config} 
              products={filteredProducts} 
              isAdmin={isLoggedIn}
              onUpdateConfig={setConfig}
              onUpdateProduct={(update) => setProducts(products.map(p => p.id === update.id ? update : p))}
              onAddToCart={handleAddToCart}
            />
          } />
          <Route path="/about" element={<AboutPage config={config} isAdmin={isLoggedIn} onUpdateConfig={setConfig} />} />
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
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                user={user}
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
                  <div key={product.id} className="relative group">
                    <div className="card-premium group h-full">
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={product.image} 
                          alt={`${product.name} - Aswad Herbs Premium Spice`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          referrerPolicy="no-referrer" 
                        />
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur text-forest rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-terracotta hover:text-white"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6">
                        <span className="text-xs font-bold text-terracotta uppercase tracking-widest mb-2 block">{product.category}</span>
                        <h3 className="text-xl font-serif font-bold text-forest mb-2">{product.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-forest">₹{product.price}</span>
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className="p-2 bg-stone-50 text-forest border border-stone-200 rounded-full hover:bg-terracotta hover:text-white transition-colors"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <InlineImageEdit 
                      isAdmin={isLoggedIn} 
                      currentImage={product.image} 
                      onUpdate={(url) => setProducts(products.map(p => p.id === product.id ? { ...p, image: url } : p))} 
                    />
                  </div>
                ))}
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer isAdmin={isLoggedIn} setIsAdmin={setIsLoggedIn} />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQty}
      />

      {/* Global Save Button for Admins */}
      {isLoggedIn && location.pathname !== '/admin' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={handleSave}
          className="fixed bottom-8 left-8 p-4 bg-terracotta text-white rounded-full shadow-2xl flex items-center justify-center group z-[90] hover:bg-forest transition-colors"
          title="Save website changes"
        >
          <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2 font-bold text-sm">
            Save All Changes
          </span>
        </motion.button>
      )}

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
