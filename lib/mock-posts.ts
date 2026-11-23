export type Category =
  | "Travel Places"
  | "Fashion & Culture"
  | "Lifestyle & Modern Living"
  | "Business, Money & Entrepreneurship";

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: Category;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: Author;
  featured?: boolean;
}

export const CATEGORIES: Category[] = [
  "Travel Places",
  "Fashion & Culture",
  "Lifestyle & Modern Living",
  "Business, Money & Entrepreneurship",
];

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    slug: "the-quiet-luxury-of-kyoto-hidden-alleys-and-ancient-tea-houses",
    title:
      "The Quiet Luxury of Kyoto: Wandering Hidden Alleys, Cedar Forests, and Ancient Tea Houses",
    excerpt:
      "Beyond the crowded temples lies an intimate Kyoto where fifth-generation artisans hand-carve bamboo whisks, morning mist rolls over Mount Hiei, and silence is treated as the ultimate modern luxury.",
    content: [
      "Beyond the crowded shrines and tour itineraries lies an intimate Kyoto known primarily to residents and discerning travelers. In early dawn, along the moss-covered pathways of Sagano, the only sound is the rhythmic creaking of towering bamboo stalks swayed by morning breezes.",
      "In this travel dispatch, we explore the quiet corners of the ancient imperial capital—from discreet machiya townhouses converted into minimalist ryokans to three-seat matcha counters tucked inside unassuming Gion lanes.",
      "The true luxury of Kyoto is not opulence; it is time and intentionality. Here, a bowl of seasonal dashi broth is simmered for hours using century-old kelp curing techniques, and gardens are raked with meditative geometry that invites prolonged contemplation.",
      "Whether you are savoring roasted hojicha by the Kamogawa River or bicycling through artisan neighborhoods where lacquerware is polished with deer horn powder, Kyoto offers a masterclass in living deeply rather than hurriedly.",
    ],
    category: "Travel Places",
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "Nov 19, 2026",
    readTime: "7 min read",
    author: {
      name: "Elena Vance",
      role: "Travel & Culture Editor",
      avatar:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80",
    },
    featured: true,
  },
  {
    id: "post-2",
    slug: "rethinking-the-capsule-wardrobe-in-an-era-of-algorithmic-trends",
    title:
      "Rethinking the Capsule Wardrobe in an Era of Algorithmic Micro-Trends",
    excerpt:
      "How quiet silhouette tailoring, heirloom wools, and intentional garment provenance are dismantling fast-fashion cycles for discerning dressers.",
    content: [
      "Social media algorithms have accelerated the trend cycle to an unsustainable blur, churning through aesthetic labels every fortnight. In response, a quiet counter-revolution has taken root among cultural tastemakers.",
      "Rather than chasing synthetic micro-trends, mindful dressers are investing in heirloom textiles—heavy Scottish wool coats, unbleached Irish linen shirts, and Goodyear-welted leather oxfords designed to age with graceful character.",
      "Building a timeless personal uniform is not about strict minimalism or monochrome austerity. It is about emotional connection to craftsmanship, understanding garment provenance, and curating pieces you will still wear twenty years from today.",
    ],
    category: "Fashion & Culture",
    coverImage:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 18, 2026",
    readTime: "5 min read",
    author: {
      name: "Julian Moreau",
      role: "Culture Critic",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-3",
    slug: "the-rise-of-calm-companies-bootstrapping-to-eight-figures",
    title:
      "The Rise of Calm Companies: Bootstrapping to Eight Figures Without Venture Debt",
    excerpt:
      "A new generation of founders is rejecting hyper-growth burn rates in favor of sustainable 40% margins, lean teams, and autonomous operations.",
    content: [
      "The Silicon Valley mythos of blitzscaling at all costs is finally giving way to a more durable business philosophy: the calm company. These businesses prioritize profitability from day one, customer delight, and founder sanity over vanity valuation rounds.",
      "By leveraging asynchronous communication and high-leverage modern software stacks, a team of twenty can now generate the kind of recurring revenue that once required hundreds of employees.",
      "In this breakdown, we examine the unit economics, pricing power, and operational discipline behind three bootstrapped software and media houses generating over $15M annually with zero outside investors.",
    ],
    category: "Business, Money & Entrepreneurship",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 16, 2026",
    readTime: "6 min read",
    author: {
      name: "Maya Lin",
      role: "Ventures & Economics",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-4",
    slug: "architectural-serenity-designing-homes-around-natural-light-and-stone",
    title:
      "Architectural Serenity: Designing Living Spaces Around Natural Light, Raw Stone, and Stillness",
    excerpt:
      "Inside three Scandinavian and Mediterranean sanctuaries where raw materials, shadow play, and intentional negative space shape everyday living.",
    content: [
      "Our physical surroundings exert an undeniable psychological influence on how we think, rest, and create. In an era dominated by relentless sensory overstimulation, home architecture is shifting toward meditative sanctuary.",
      "We step inside three breathtaking residences—a cliffside pavilion in Mallorca built from local limestone, an archipelago timber retreat in Stockholm, and a converted loft in Kyoto—to discover how natural daylight, unvarnished cedar, and tactile plaster cultivate serenity.",
      "By deliberately eliminating visual clutter and honoring natural textures, these spaces allow inhabitants to slow down their breathing and reconnect with natural circadian rhythms.",
    ],
    category: "Lifestyle & Modern Living",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 15, 2026",
    readTime: "6 min read",
    author: {
      name: "Arthur Pendelton",
      role: "Design & Spatial Living",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-5",
    slug: "sailing-the-cyclades-secret-coves-and-sun-drenched-villages",
    title:
      "Sailing the Cyclades: Discovering Untouched Coves and Whitewashed Harbor Villages",
    excerpt:
      "Leaving the superyacht crowds behind to navigate Aegean sea passages, cliffside monasteries, and olive oil tastings in secluded Sifnos.",
    content: [
      "While Mykonos and Santorini capture headlines, the Aegean archipelago holds dozens of tranquil islands where fishing skiffs still outnumber private speedboats. We charted a classic wooden caique through the lesser Cyclades.",
      "From secluded turquoise anchorages in Polyaigos to candlelit tavernas perched high above the cliffs of Folegandros, this journey celebrates the ancient rhythm of sea travel and slow Mediterranean dining.",
      "Locals greet sailors not with commercial fanfare, but with fresh goat cheese drizzled in wild thyme honey and pitchers of cold mineral wine harvested from volcanic terraced vineyards.",
    ],
    category: "Travel Places",
    coverImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 14, 2026",
    readTime: "8 min read",
    author: {
      name: "Elena Vance",
      role: "Travel & Culture Editor",
      avatar:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-6",
    slug: "vintage-horology-why-mechanical-watches-are-the-ultimate-analog-rebellion",
    title:
      "Vintage Horology: Why Mechanical Watches Are the Ultimate Analog Rebellion",
    excerpt:
      "In a world of vibrating notifications and disposable hardware, mechanical balance wheels represent timeless human engineering and personal style.",
    content: [
      "There is an unmistakable romance in winding a mechanical watch. Underneath the sapphire crystal, a miniature escapement oscillates twenty-eight thousand times per hour—powered not by lithium or software updates, but by tension stored in a coiled mainspring.",
      "As smart wearables commoditize our attention with haptic interruptions, collectors and thinkers are finding deep solace in mechanical horology. A vintage chronograph is both a physical artifact of mid-century industrial art and an heirloom destined to outlive its owner.",
    ],
    category: "Fashion & Culture",
    coverImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 12, 2026",
    readTime: "5 min read",
    author: {
      name: "Julian Moreau",
      role: "Culture Critic",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-7",
    slug: "the-art-of-slow-coffee-rituals-roasts-and-morning-intentionality",
    title:
      "The Art of Slow Coffee: Single-Origin Rituals, Fermentation, and Morning Stillness",
    excerpt:
      "Why dialing in grind consistency and pour-over blooming is less about caffeine and more about reclaiming our earliest waking hours.",
    content: [
      "The morning routine sets the tonal baseline for everything that follows. When we rush through automated pod machines while checking urgent notifications, we surrender our morning peace before the day has truly begun.",
      "The practice of slow coffee—measuring whole beans from Ethiopian heirloom varietals, hand-grinding with steel burrs, and patiently spiraling ninety-three-degree water over paper filters—is a secular morning ritual of pure sensory focus.",
    ],
    category: "Lifestyle & Modern Living",
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 10, 2026",
    readTime: "4 min read",
    author: {
      name: "Chloe Beaulieu",
      role: "Living Editor",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-8",
    slug: "generational-wealth-transfer-how-family-offices-are-allocating-for-2030",
    title:
      "The Modern Wealth Blueprint: How Family Offices and Next-Gen Investors Allocate for 2030",
    excerpt:
      "Analyzing shifting portfolios from legacy equities toward private infrastructure, decentralized finance, and regenerative agriculture.",
    content: [
      "The largest intergenerational transfer of wealth in recorded human history is unfolding right now, moving an estimated eighty trillion dollars into the hands of millennial and Gen-Z stewards.",
      "With that transition comes a radical philosophical overhaul in capital deployment. Modern family offices are abandoning conventional 60/40 index allocations in favor of direct investments in clean transition infrastructure, water rights, and mission-aligned software founders.",
    ],
    category: "Business, Money & Entrepreneurship",
    coverImage:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 08, 2026",
    readTime: "7 min read",
    author: {
      name: "Maya Lin",
      role: "Ventures & Economics",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-9",
    slug: "the-dolomites-in-autumn-alpine-refuges-golden-larches-and-solitude",
    title:
      "The Dolomites in Autumn: Alpine Refuges, Golden Larches, and Mountain Solitude",
    excerpt:
      "Hikes through the jagged limestone spires of northern Italy after the summer crowds leave and morning frost blankets the valleys.",
    content: [
      "Come late October, the high mountain passes of the South Tyrol undergo a magical metamorphosis. The summer climbing caravans depart, leaving the jagged pale peaks of Tre Cime bathed in amber sunlight amidst forests of golden larches.",
      "Trekking between family-run rifugios offering warm bowls of canederli dumplings and wood-fired sauna huts, travelers experience the raw grandeur of the Alps at its most contemplative and majestic.",
    ],
    category: "Travel Places",
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 06, 2026",
    readTime: "6 min read",
    author: {
      name: "Elena Vance",
      role: "Travel & Culture Editor",
      avatar:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-10",
    slug: "the-revival-of-bespoke-shoemaking-in-florence-and-northampton",
    title:
      "Lasting Leather: The Revival of Bespoke Shoemaking in Florence and Northampton",
    excerpt:
      "Tracing how hand-stitched Goodyear welts and vegetable-tanned French calfskins are capturing a younger audience hungry for lasting quality.",
    content: [
      "In a sunlit Florentine atelier smelling of beeswax and aged leather, a master cordwainer carves a wooden last shaped exactly to the millimeter contours of a client's foot. It takes over sixty hours of focused handwork to finish a single pair of bespoke boots.",
      "While industrial fashion prioritizes planned obsolescence, bespoke shoemaking proves that true luxury is reparable, enduring, and deeply personal.",
    ],
    category: "Fashion & Culture",
    coverImage:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 04, 2026",
    readTime: "6 min read",
    author: {
      name: "Julian Moreau",
      role: "Culture Critic",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-11",
    slug: "digital-monasticism-the-subtle-power-of-unplugging-for-48-hours",
    title:
      "Digital Monasticism: The Subtle Power of Scheduled Analog Weekends",
    excerpt:
      "What happens to cognitive clarity, deep conversation, and creativity when you trade push alerts for paper books and handwritten journals.",
    content: [
      "Our brains were never evolved to process six thousand push notifications, algorithmic outrage feeds, and instantaneous message pings every waking day.",
      "A rising practice among knowledge workers and writers is what neuroscientists call 'digital monasticism': shutting down all screens from Friday evening until Monday morning. Within thirty-six hours, attention spans lengthen, resting heart rates decline, and the quiet pleasure of reading unbroken pages returns.",
    ],
    category: "Lifestyle & Modern Living",
    coverImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 02, 2026",
    readTime: "5 min read",
    author: {
      name: "Chloe Beaulieu",
      role: "Living Editor",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "post-12",
    slug: "the-solopreneur-stack-building-a-seven-figure-media-engine-with-ai",
    title:
      "The Solopreneur Engine: Building a Seven-Figure Media Company with Lean Automation",
    excerpt:
      "A transparent look at revenue breakdowns, automated production pipelines, and newsletter subscriber economics for one-person operations.",
    content: [
      "Never before has an individual creator possessed the operational leverage of a mid-sized 1990s magazine publishing company. By combining high-signal editorial curation, automated distribution workflows, and recurring premium membership tiers, independent thinkers are building remarkable media businesses.",
      "Here is an unvarnished audit of audience acquisition costs, churn rates, sponsorship models, and toolchains for scaling a modern one-person publication without burning out.",
    ],
    category: "Business, Money & Entrepreneurship",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Oct 30, 2026",
    readTime: "7 min read",
    author: {
      name: "Maya Lin",
      role: "Ventures & Economics",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  },
];

export function getFeaturedPost(): Post {
  return MOCK_POSTS.find((p) => p.featured) || MOCK_POSTS[0];
}

export function getGridPosts(): Post[] {
  return MOCK_POSTS.filter((p) => !p.featured);
}

export function getPostBySlug(slug: string): Post | undefined {
  return MOCK_POSTS.find((p) => p.slug === slug);
}
