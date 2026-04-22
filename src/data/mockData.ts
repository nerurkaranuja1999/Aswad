// This is a placeholder for the mock data since we are not using Firebase yet
// but we will structure the app to be ready for it or use a local state for the demo.

export const initialProducts = [
  {
    id: 'p1',
    name: 'Authentic Malvani Masala',
    category: 'Specialty',
    price: 280,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800', // Authentic Malvani Fish Curry
    description: 'Hand-pounded Konkan blend with 24+ sun-dried ingredients. No pesticides, no artificial colors. Perfect for authentic fish and mutton curries.',
    tags: ['Hand-Pounded', 'Chemical-Free', 'Konkan Special']
  },
  {
    id: 'p2',
    name: 'Kanda-Lasun Masala',
    category: 'Specialty',
    price: 190,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', // Stuffed eggplant/Bharlela Vanga style
    description: 'Traditional Maharashtrian onion-garlic spice mix. Essential for making authentic Bharlela Vanga (Stuffed Eggplant) and spicy Misal.',
    tags: ['Stone-Ground', 'Spicy', 'Authentic']
  },
  {
    id: 'p3',
    name: 'Premium Chicken Masala',
    category: 'Protein',
    price: 160,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800', // Rich Chicken Curry
    description: 'A robust blend of hand-selected spices for the perfect spicy chicken curry. No harmful chemicals or additives.',
    tags: ['Non-Veg Special', 'Natural']
  },
  {
    id: 'p13',
    name: 'Egg Curry Masala',
    category: 'Protein',
    price: 130,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800', // Egg Curry with Roti look
    description: 'A specialized blend to make the perfect dhaba-style egg curry. Best enjoyed with hot rotis or bhakri.',
    tags: ['Egg Special', 'Natural']
  },
  {
    id: 'p14',
    name: 'Royal Biryani Masala',
    category: 'Protein',
    price: 220,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=800', // Biryani
    description: 'A majestic blend of aromatic whole spices for that authentic, fragrant biryani. No artificial scents or colors.',
    tags: ['Biryani Special', 'Aromatic']
  },
  {
    id: 'p15',
    name: 'Fish Curry Masala',
    category: 'Protein',
    price: 150,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800', // Coastal Fish Curry
    description: 'Coastal style fish curry masala for a tangy and spicy seafood experience. Hand-made with love.',
    tags: ['Seafood Special', 'Coastal']
  },
  {
    id: 'p9',
    name: 'Paneer Masala',
    category: 'Protein',
    price: 150,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800', // Paneer Butter Masala
    description: 'A creamy and aromatic blend for restaurant-style paneer dishes at home. 100% natural ingredients.',
    tags: ['Vegetarian', 'Aromatic']
  },
  {
    id: 'p10',
    name: 'Traditional Goda Masala',
    category: 'Maharashtrian Staples',
    price: 220,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800', // Spices
    description: 'The heart of Maharashtrian Brahmin cooking. A sweet and aromatic blend of spices, stone-ground for authentic flavor.',
    tags: ['Aromatic', 'Stone-Ground']
  },
  {
    id: 'p11',
    name: 'Kala Masala (Black Masala)',
    category: 'Maharashtrian Staples',
    price: 230,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800', // Dark spices
    description: 'Deeply roasted spices that give the characteristic dark color and smoky flavor to Maharashtrian curries.',
    tags: ['Smoky', 'Traditional']
  },
  {
    id: 'p12',
    name: 'Authentic Metkut',
    category: 'Maharashtrian Staples',
    price: 110,
    image: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=800', // Lentil powder look
    description: 'A nutritious blend of roasted lentils and spices. Perfect with hot rice and ghee. Traditional Maharashtrian comfort food.',
    tags: ['Healthy', 'Traditional']
  },
  {
    id: 'p4',
    name: 'Pure Turmeric Powder',
    category: 'Raw Ingredients',
    price: 130,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800', // Raw haldi roots and powder blend
    description: 'Made from naturally grown Selam turmeric roots. Processed using traditional hand-grinding methods to retain high curcumin levels. No pesticides used.',
    tags: ['High Curcumin', 'Pesticide-Free']
  },
  {
    id: 'p5',
    name: 'Fish Fry Masala',
    category: 'Protein',
    price: 140,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800', // Fried fish
    description: 'Special coastal blend for crispy and flavorful fish fry. Authentic homemade quality.',
    tags: ['Coastal Taste', 'Homemade']
  },
  {
    id: 'p6',
    name: 'Garam Masala (Stone Ground)',
    category: 'Daily Essentials',
    price: 210,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800', // Spices being ground
    description: 'A versatile blend of aromatic whole spices, stone-ground to perfection for daily use.',
    tags: ['Aromatic', 'Daily Use']
  },
  {
    id: 'p7',
    name: 'Tandoori Masala',
    category: 'Modern Fusion',
    price: 170,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800', // Tandoori chicken
    description: 'Smoky and vibrant blend for authentic tandoori flavors at home. No artificial red color added.',
    tags: ['No Artificial Color', 'Smoky']
  },
  {
    id: 'p8',
    name: 'Special Sabji Masala',
    category: 'Daily Essentials',
    price: 120,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', // Fresh veg curry
    description: 'Enhance your daily vegetables with this balanced blend of 12 natural spices.',
    tags: ['Vegetarian', 'Daily Essential']
  }
];

export const initialBlogs = [
  {
    id: 'b1',
    title: 'The Art of Stone-Grinding: Why We Refuse to Use Industrial Mills',
    excerpt: 'Discover how our traditional stone-grinding process preserves the volatile oils and soul of every spice.',
    content: 'In the heart of our kitchen, you won\'t hear the roar of industrial machinery. Instead, you\'ll hear the rhythmic, steady sound of stone against stone. Industrial mills generate high heat that literally "burns" the delicate essential oils in spices like Turmeric and Garam Masala. At Aswad Herbs, we use slow-speed stone grinders. It takes longer, but it ensures that the flavor, aroma, and medicinal properties remain exactly as nature intended.',
    author: 'Aswad Kitchen',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    title: 'From Farm to Jar: Our Zero-Pesticide Journey',
    excerpt: 'How we partnered with local farmers to ensure every root of Turmeric is grown without a single drop of chemical spray.',
    content: 'Purity isn\'t just a marketing word for us; it\'s a commitment. Three years ago, we realized that even the best grinding couldn\'t fix spices grown with heavy pesticides. We spent months traveling through Maharashtra, meeting farmers who still believed in natural growth. Today, every Aswad Herbs product starts in soil that hasn\'t seen a chemical fertilizer in years. We personally inspect the farms to ensure that what reaches your table is 100% safe for your family.',
    author: 'Organic Farmer',
    date: '2024-03-20',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    title: 'The Secret to a Perfect Malvani Curry',
    excerpt: 'My grandmother\'s secret tip for using Malvani Masala to get that authentic Konkan depth.',
    content: 'A true Malvani curry isn\'t just about heat; it\'s about depth. The secret lies in how you "bloom" the masala. Never add our Malvani Masala directly to water. Instead, lightly sauté it in a little oil with fresh coconut paste for exactly 45 seconds. This releases the sun-dried flavors of the 24 ingredients we use. Whether it\'s a Fish Fry or a Stuffed Eggplant, this small step makes the difference between a good meal and a memory.',
    author: 'Aaji (Grandmother)',
    date: '2024-04-05',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b4',
    title: 'Turmeric: More Than Just a Color',
    excerpt: 'Why our Selam Turmeric has 3x more Curcumin than standard store-bought powders.',
    content: 'Most people buy turmeric for the yellow color, but we grow it for the health. Our Selam variety is harvested only when the Curcumin levels are at their peak. Standard turmeric is often boiled and polished with lead chromate for shine. We skip the polish and keep the purity. When you use Aswad Turmeric, you aren\'t just coloring your food; you\'re adding a powerful natural anti-inflammatory to your daily diet.',
    author: 'Health Specialist',
    date: '2024-04-10',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b5',
    title: 'The Story of Our Kanda-Lasun Masala',
    excerpt: 'Why this specific blend takes 3 days of preparation before it even hits the grinder.',
    content: 'Kanda-Lasun (Onion-Garlic) Masala is the backbone of Maharashtrian cuisine. But at Aswad Herbs, we don\'t just throw ingredients together. We slow-roast the onions until they are perfectly caramelized and sun-dry the garlic to remove every trace of moisture. This "dry-roast" method is what gives our masala its signature deep red color and shelf life of over a year without any preservatives. It\'s a labor of love that we\'ve perfected over three generations.',
    author: 'Aswad Kitchen',
    date: '2024-04-15',
    image: 'https://images.unsplash.com/photo-1590594460041-996453cf1385?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b6',
    title: 'How to Store Your Spices for Maximum Freshness',
    excerpt: 'Stop keeping your masalas near the stove! Here is how to keep them aromatic for months.',
    content: 'Heat, light, and moisture are the enemies of ground spices. If you keep your spice jar right next to your cooking range, the heat will quickly dissipate the essential oils. We recommend storing Aswad Herbs masalas in airtight glass jars in a cool, dark cupboard. And here is a pro-tip: for our premium blends like Garam Masala, you can even store the jar in the refrigerator to keep the aroma "locked in" for even longer.',
    author: 'Storage Expert',
    date: '2024-04-20',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800'
  }
];

export const initialSiteConfig = {
  theme: {
    primary: '#8B4513', // Terracotta
    secondary: '#2D5A27', // Forest Green
    accent: '#FFBF00', // Turmeric Yellow
    fontHeading: 'Playfair Display',
    fontBody: 'Inter'
  },
  content: {
    heroTitle: 'Authentic Hand-Made Spices',
    heroSubtitle: 'Naturally grown, stone-ground, and 100% free from pesticides and harmful chemicals. Pure taste of tradition.',
    aboutStory: 'Aswad Herbs started with a simple mission: to bring the purity of nature back to Indian kitchens. We source directly from natural farms and use traditional hand-pounding and stone-grinding methods to ensure you get the healthiest spices possible.',
    footerText: '© 2024 Aswad Herbs. All rights reserved.',
    contactNumber: '7499585453',
    aboutImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200',
    heroImages: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
    ]
  }
};
