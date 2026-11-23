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

export function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");
}

export function isCategoryMatch(
  postCategory?: string | null,
  targetCategory?: string | null
): boolean {
  if (!targetCategory || targetCategory.toLowerCase() === "all") return true;
  if (!postCategory) return false;

  const pLower = postCategory.toLowerCase().trim();
  const tLower = targetCategory.toLowerCase().trim();
  if (pLower === tLower) return true;

  const pSlug = slugifyCategory(postCategory);
  const tSlug = slugifyCategory(targetCategory);
  if (pSlug === tSlug) return true;

  // Substring or prefix matches
  if (pSlug.includes(tSlug) || tSlug.includes(pSlug)) return true;

  // Common editorial aliases
  const aliases: Record<string, string[]> = {
    "travel-places": ["travel", "travel-places", "travel-and-places", "journeys", "destinations"],
    "fashion-culture": [
      "fashion",
      "culture",
      "fashion-culture",
      "fashion-and-culture",
      "style",
      "art",
    ],
    "lifestyle-modern-living": [
      "lifestyle",
      "living",
      "lifestyle-modern-living",
      "wellness",
      "architecture",
    ],
    "business-money-entrepreneurship": [
      "business",
      "money",
      "entrepreneurship",
      "ventures",
      "strategy",
      "business-money-entrepreneurship",
    ],
  };

  for (const [key, list] of Object.entries(aliases)) {
    const targetMatches = tSlug === key || list.includes(tSlug);
    const postMatches = pSlug === key || list.includes(pSlug);
    if (targetMatches && postMatches) return true;
  }

  return false;
}

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    slug: "the-quiet-luxury-of-kyoto-hidden-alleys-and-ancient-tea-houses",
    title:
      "The Quiet Luxury of Kyoto: Wandering Hidden Alleys, Cedar Forests, and Ancient Tea Houses",
    excerpt:
      "Beyond the crowded temples lies an intimate Kyoto where fifth-generation artisans hand-carve bamboo whisks, morning mist rolls over Mount Hiei, and silence is treated as the ultimate modern luxury.",
    content: [
      "Beyond the crowded shrines and tour itineraries lies an intimate Kyoto known primarily to residents and discerning travelers. In early dawn, along the moss-covered pathways of Sagano, the only sound is the rhythmic creaking of towering bamboo stalks swayed by morning breezes. For centuries, this imperial capital has cultivated an aesthetic of restraint—a cultural intuition that the most profound experiences are found not in loud ornamentation, but in the quiet margins of everyday life.",
      "## The Living Architecture of the Machiya",
      "To truly understand Kyoto is to step inside a traditional machiya townhouse. These long, narrow wooden residences, once the dwelling places of merchants and craftsmen, are masterpieces of passive climate control and shadow play. Behind modest cedar lattices (koshi) lies an unexpected sanctuary: a tiny interior courtyard garden (tsuboniwa) designed to catch rain, filter autumn breeze, and frame seasonal maple leaves against damp river stones.",
      "In recent years, an alliance of young architects and preservationists has quietly restored dozens of these historic structures into minimalist ryokans and private salons. Rather than modernizing with synthetic materials, they have preserved centuries-old clay walls, charred timber posts, and woven tatami matting. Waking up in a machiya as dawn light filters through paper shoji screens offers an immediate physical sense of recalibration.",
      "## Rituals of the Morning Bowl",
      "In the winding residential lanes behind Daitoku-ji temple, the morning begins with the whisking of ceremonial matcha. Here, fifth-generation artisans continue the lineage of Sen no Rikyu, the 16th-century tea master who codified wabi-scha—the beauty of imperfection and simplicity. The tools themselves are objects of profound contemplation: hand-split bamboo whisks carved from single nodes, unglazed raku tea bowls shaped by human palms, and kettle water heated over white binchotan charcoal.",
      "Sipping freshly whisked green tea in this setting reveals why Kyoto has become the modern antidote to digital distraction. The ceremony demands complete presence: listening to the hiss of water in the iron kettle, observing the jade green froth, and feeling the warmth of ceramic against cold fingers. Nothing is rushed; every gesture has been refined over four hundred years to eliminate excess motion.",
      "## The Cedar Hills and Riverbanks",
      "As late afternoon approaches, the city's rhythms shift toward the Kamogawa River. Locals sit along the stone banks watching egrets wade through clear alpine waters flowing down from Mount Hiei. Further north, in the cedar forests of Kitayama, towering trees harvested with sustainable coppicing techniques provide the fragrant timber that has built Kyoto's sacred architecture for over a millennium.",
      "The true luxury of Kyoto is ultimately not expensive goods or exclusive bookings; it is the gift of intentionality. In a global culture increasingly obsessed with rapid consumption, Kyoto stands as living proof that true elegance requires patience, reverence for natural materials, and the courage to embrace stillness.",
    ],
    category: "Travel Places",
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    publishedAt: "Nov 19, 2026",
    readTime: "6 min read",
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
      "Social media algorithms have accelerated the trend cycle to an unsustainable blur. Concepts that once took years to evolve through subcultures are now packaged, monetized, and discarded within a fortnight under algorithmic micro-trend labels. In response to this aesthetic exhaustion, a quiet counter-revolution has taken root among cultural tastemakers: the revival of the considered, lifelong wardrobe.",
      "## Beyond Sterile Minimalism",
      "When the concept of the capsule wardrobe first gained mainstream popularity a decade ago, it was frequently conflated with austere deprivation—a rigid collection of thirty-three monochrome items devoid of personality. Today's approach is markedly different. It is not about ascetic rules or wearing identical gray t-shirts every morning; it is about emotional resonance, textural depth, and uncompromising garment provenance.",
      "Discerning dressers are seeking out textiles that age with distinction rather than degrade after three wash cycles. Consider heavy Scottish Shetland wools spun from hardy island sheep, undyed Irish linens woven on historic shuttle looms, and Japanese selvedge denim dyed with natural indigo. These fabrics carry an inherent tactile poetry, softening over decades of wear and molding to the unique posture and movement of their owners.",
      "## The Architecture of Silhouette",
      "Central to this philosophy is an appreciation for structural tailoring over transient fits. Rather than buying multiple trend-driven pieces each season, the modern dresser invests in a single, impeccably drafted double-breasted overcoat or high-rise pleated trouser crafted from robust wool twill. The silhouette provides a dependable canvas that functions effortlessly across casual mornings and formal evenings.",
      "Furthermore, the economics of garment longevity are proving irresistible. While an ethically manufactured, bench-made chore jacket might carry a higher initial investment, its cost-per-wear over ten or fifteen years reduces fast-fashion alternatives to expensive disposable novelties. When clothing is constructed with generous seam allowances and durable natural horn buttons, repair becomes an act of affection rather than inconvenience.",
      "## Cultivating Personal Style Immunity",
      "Ultimately, stepping away from the seasonal trend conveyor belt requires developing what designers call 'aesthetic immunity.' It means identifying the silhouettes, proportions, and color palettes that complement your life and refusing to be swayed by algorithmic marketing. In doing so, getting dressed ceases to be a performance of consumption and returns to what it was always meant to be: an intimate expression of self-respect and timeless craft.",
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
      "For the past fifteen years, the prevailing startup orthodoxy dictated that greatness required venture hyper-scaling. Founders were encouraged to raise massive seed and growth rounds, hire dozens of employees ahead of revenue, and burn millions of dollars chasing total market domination. Today, a decisive paradigm shift is underway as founders embrace the principles of the 'calm company.'",
      "## Unit Economics Over Vanity Valuations",
      "Calm companies reject the vanity metrics of headcount growth and valuation markups in favor of fundamental business health: gross margins exceeding 80%, net profit margins north of 40%, and positive cash flows from day one. By deliberately keeping teams small—often under twenty-five people—these enterprises avoid the corrosive communication overhead and bureaucratic inertia that plague traditional corporate hierarchies.",
      "Consider the financial resilience this model provides. When economic headwinds arrive and venture markets freeze, bootstrapped enterprises continue operating without layoffs or distressed down-rounds. Their customer relationships are based on genuine utility and fair pricing rather than subsidized venture coupons designed to pump vanity engagement charts.",
      "## Asynchronous Culture and Deep Work",
      "Operationally, calm companies treat employee attention as their most sacred resource. Real-time chat platforms and calendar-choking video standups are replaced with thoughtful, long-form written proposals. When decisions are made asynchronously through well-crafted memos, every team member gains uninterrupted blocks of four to six hours each day for deep creative engineering and product design.",
      "This structural tranquility has profound consequences for employee retention. Where high-burn tech startups churn through talent every eighteen months due to chronic exhaustion, calm companies report tenures measured in decades. Staff members are trusted as autonomous professionals who manage their own schedules, allowing them to balance demanding intellectual work with family, athletics, and cultural pursuits.",
      "## The Long Horizon of Independence",
      "Perhaps the most compelling aspect of the calm company movement is governance autonomy. Without board seats allocated to institutional investors with ticking ten-year fund cycles, founders are free to optimize for the multi-decade horizon. They can reject lucrative acquisition offers that would compromise product integrity and instead build enduring, generational enterprises that serve both their customers and their communities with quiet dignity.",
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
      "Our physical surroundings exert an undeniable, continuous influence on human psychology and emotional equilibrium. In an era dominated by relentless sensory overstimulation, digital alerts, and chaotic urban noise, domestic architecture is undergoing a profound philosophical renaissance: the home as a secular sanctuary of quietude.",
      "## The Emotional Geometry of Daylight",
      "Great architecture does not merely enclose space; it sculpts illumination. When designing spaces intended for deep living, master architects prioritize solar orientation above all else. Morning light should gently awaken private sleeping quarters, while warm late-afternoon rays graze living areas where family and friends gather.",
      "In a cliffside residence in Mallorca crafted by local stone masons, deep window embrasures and hand-troweled lime plaster walls diffuse intense Mediterranean glare into soft, velvety luminescence. Rather than flooding every corner with harsh recessed LED fixtures, the home embraces the poetic philosophy of Jun'ichirō Tanizaki's *In Praise of Shadows*. Shadows are not seen as absences of light, but as essential design elements that grant texture, mystery, and rest to weary eyes.",
      "## Honoring Tactile Materiality",
      "True architectural serenity requires an authentic relationship with natural materials. When a home is built using honest stone, unlacquered brass, charred timber, and rough linen, the human nervous system responds with instinctive relaxation. These materials possess visual weight and tactile warmth that synthetic laminates and painted drywall can never replicate.",
      "Over years of daily domestic rituals, unpolished limestone stairs develop smooth indentations, brass doorknobs gain rich golden patinas, and oak dining tables bear the subtle rings of shared morning espresso cups. This natural patina tells the story of human life unfolding over time, grounding residents in the beauty of transience and organic permanence.",
      "## The Discipline of Negative Space",
      "Equally critical to peaceful spatial design is what is left out. The modern tendency to fill every wall with shelving or decorate every tabletop creates cognitive static. In contrast, intentional negative space gives the mind room to wander and breathe.",
      "By paring back possessions to items of genuine beauty and utility, a room transforms into an open horizon. A single branch of blossoming quince in a ceramic vase against an empty plaster wall holds far greater emotional resonance than a dozen decorative knick-knacks. In crafting our sanctuaries with restraint, we give ourselves permission to inhabit stillness.",
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
      "While Mykonos and Santorini continue to dominate international travel feeds, the wider Aegean archipelago holds dozens of tranquil, wind-sculpted islands where traditional maritime life remains vibrantly intact. In late summer, when the fierce northern Meltemi winds begin to soften into warm Mediterranean breezes, we charted a classic wooden caique through the lesser-known southern Cyclades.",
      "## Navigating the Meltemi Passages",
      "Sailing these ancient waterways requires patience, navigation discipline, and a profound respect for sea conditions. Leaving the bustling marina of Lavrio at sunrise, the vessel cuts through deep sapphire water toward the uninhabited island of Polyaigos. Here, sheer limestone cliffs plunge vertically into translucent turquoise bays accessible solely by sea.",
      "Anchoring in twenty fathoms over white sand, the stillness is absolute. No beach clubs, no jet ski drone—only the rhythmic lapping of swells against the wooden hull and the distant cries of peregrine falcons nesting in volcanic crevices. Swimming in these pristine waters feels like stepping back into an elemental Homeric seascape untouched by mass tourism.",
      "## Culinary Alchemy in Sifnos",
      "As evening descends, we steer toward the sheltered harbor of Kamares on the island of Sifnos. Long revered as the gastronomic cradle of the Aegean, Sifnos is the birthplace of Nicholas Tselementes, the pioneer who codified modern Greek culinary tradition. Yet its true magic lies not in fine dining salons, but in family-run pottery ateliers and clay-oven tavernas.",
      "In the hillside village of Artemonas, earthen casseroles called *tsikali* are filled with chickpeas, sweet onions, local olive oil, and bay leaves, then placed into wood-fired communal ovens to simmer gently for fifteen hours overnight. The resulting *revithada* is sublime: velvety, rich with aromatic mountain herbs, and paired with dry white wine fermented in clay amphorae. Eating here under grape arbors while church bells chime across the valley is an unforgettable lesson in slow hospitality.",
      "## The Anchor of Memory",
      "Sailing between these secluded outposts reminds us that the purpose of voyage is not to collect stamps or photo backdrops, but to adapt our internal tempo to the rhythms of tides and winds. When you navigate by compass and stars, sleep on deck beneath the Milky Way, and converse with island elders whose families have tended olive groves for eight centuries, the noise of modern life recedes into healthy proportion.",
    ],
    category: "Travel Places",
    coverImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 14, 2026",
    readTime: "6 min read",
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
      "There is an unmistakable, grounding romance in winding a manual mechanical watch each morning. As the knurled crown turns between your thumb and index finger, you can feel the subtle click of the ratchet wheel coiling the mainspring inside its barrel. Beneath the domed crystal, a balance wheel begins to oscillate twenty-eight thousand times per hour—powered not by lithium battery chemistry, proprietary charging cables, or cloud servers, but by pure micro-mechanical kinetic tension.",
      "## The Anti-Notification Device",
      "In an era where consumer electronics companies strive to tether our attention to wrist-mounted notification hubs that buzz every time a marketing email arrives, mechanical horology represents a radical act of rebellion. A mechanical watch does not track your heart rate, buzz with Slack updates, or demand firmware upgrades every six months. It does one thing with uncompromising mechanical poetry: it bears witness to the passage of time.",
      "Furthermore, smart wearables suffer from built-in obsolescence. A digital watch purchased today will likely be rendered electronic waste within four years as battery degradation and operating system deprecations take their toll. In contrast, a mid-century stainless steel chronograph manufactured in Le Locle or Glashütte in 1965 remains just as functional, elegant, and serviceable today as it was sixty years ago.",
      "## Craftsmanship at the Micron Level",
      "To inspect the movement of a fine mechanical timepiece under a watchmaker's loupe is to enter a cathedral of miniaturized human ingenuity. Bridges decorated with Côtes de Genève stripes, steel bevels polished by hand using elderberry pith, and synthetic ruby jewels serving as frictionless pivot bearings—every component reflects hundreds of hours of artisanal patience.",
      "Independent watchmakers spend months finishing surfaces that will remain hidden inside solid casebacks, seen only by the master craftsman who services the piece decades later. This commitment to unseen excellence is the antithesis of modern mass-production shortcuts, honoring an ethical standard where integrity is maintained for its own sake.",
      "## Heirlooms Across Generations",
      "When you wear a vintage timepiece, you are acutely aware that you are merely its temporary guardian. It has ticked through wars, economic upheavals, transatlantic voyages, and family milestones on the wrists of previous owners, and with proper lubrication and care, it will tick just as reliably on the wrists of your grandchildren. In a disposable culture, owning something truly permanent is the ultimate luxury.",
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
      "How we spend the first sixty minutes of each morning establishes the neurological and emotional baseline for the remainder of our waking hours. When we stumble from bed straight into algorithmic headline anxiety while gulping bitter, automated pod coffee, we forfeit our mental serenity before the day has even commenced.",
      "## The Architecture of the Morning Ritual",
      "The practice of slow coffee—specifically manual pour-over brewing using conical drippers and precision kettle flow—is far more than a beverage preparation technique. It is a secular morning meditation of sensory grounding. It asks you to step away from screens, stand balanced on your feet, and engage with thermodynamics, aromatic chemistry, and physical dexterity.",
      "The process begins with selecting single-origin beans. Today's specialty coffee movement has moved light-years beyond dark Italian roasts. We now celebrate terroir: high-altitude Ethiopian Yirgacheffe varietals featuring notes of bergamot and jasmine, anaerobic-fermented Colombian Geishas with vibrant tropical acidity, and honey-processed Costa Rican lots that yield silky cacao finishes.",
      "## The Precision of Extraction",
      "Grinding eighteen grams of whole beans using precision steel burrs releases a burst of volatile aromatic compounds that immediately alerts the senses. Heating filtered spring water to ninety-three degrees Celsius ensures optimal solubility without scorching delicate floral notes.",
      "When the first fifty grams of water touch the freshly ground bed, the 'bloom' begins. As trapped carbon dioxide releases in miniature effervescent bubbles, the coffee bed rises and perfumes the kitchen. Pouring water in steady concentric spirals with a gooseneck kettle requires steady hands and unbroken focus. For three minutes, your entire consciousness is engaged in this quiet, circular dance.",
      "## Savoring Without Distraction",
      "Pouring the clarified amber liquid into a warm ceramic cup, the first sip is sweet, complex, and soothing. Drinking this coffee in silence while watching dawn light spread across the garden wall is a sacred daily pause. It reminds us that quality of life is determined not by the speed at which we cross tasks off our lists, but by our capacity to inhabit the present moment with gratitude.",
    ],
    category: "Lifestyle & Modern Living",
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 10, 2026",
    readTime: "5 min read",
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
      "The largest intergenerational wealth transfer in human history is presently underway. Over the next two decades, an estimated eighty-four trillion dollars in assets will pass from baby boomers to millennial and Gen-Z beneficiaries. This colossal transition is initiating a profound reallocation of global capital, fundamentally altering how modern family offices approach investment horizons, risk management, and ethical stewardship.",
      "## Dismantling the 60/40 Paradigm",
      "For over forty years, institutional wealth preservation leaned heavily on the classic 60/40 allocation between public equities and sovereign fixed income. However, in an era marked by persistent inflation risks, geopolitical deglobalization, and sovereign debt expansions, next-generation chief investment officers are declaring the traditional model obsolete.",
      "Modern family offices are aggressively allocating capital toward tangible, real-world assets with built-in inflation hedging: timberland, productive regenerative farmland, freshwater rights, and localized battery storage infrastructure. These investments provide durable, contracted cash flows while remaining largely insulated from public equity volatility and algorithmic sentiment swings.",
      "## Direct Venture and Operator Partnerships",
      "Another pronounced shift is the migration away from generic blind-pool private equity funds toward direct co-investments with independent operators. Rather than paying standard '2 and 20' management fees to massive private equity houses, modern stewards prefer partnering directly with niche software founders, clean biotechnology startups, and specialized manufacturing studios.",
      "This direct ownership structure provides family offices with unparalleled visibility into operations, while offering founders patient, non-dilutive capital unconstrained by artificial five-year fund liquidation cycles. Next-gen investors view their capital not as speculative paper chips, but as catalytic fuel for long-term industrial and cultural infrastructure.",
      "## Values as Alpha, Not Concession",
      "Crucially, the younger generation of wealth stewards has rejected the false dichotomy between competitive financial returns and societal impact. They view environmental resilience, supply chain transparency, and ethical governance not as regulatory burdens, but as genuine sources of structural alpha.",
      "By directing substantial balances toward companies pioneering closed-loop circular manufacturing, decentralized computing protocols, and soil biome restoration, forward-thinking family offices are positioning their balance sheets to thrive in the resource-conscious economic landscape of 2030 and beyond.",
    ],
    category: "Business, Money & Entrepreneurship",
    coverImage:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 08, 2026",
    readTime: "6 min read",
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
      "Come late October, the high mountain passes of the South Tyrol undergo a magical, quiet metamorphosis. The bustling summer caravans of tour buses and peak-season hikers have long departed, returning the towering limestone towers of the Pale di San Martino and Tre Cime to peaceful solitude. Morning frost coats the alpine pastures, and the dense forests of mountain larches burst into brilliant tapestries of fiery amber and spun gold.",
      "## The Architecture of Alpine Refuges",
      "Trekking along the high-altitude trails connecting Val Badia with the Cortina d'Ampezzo basin, the landscape feels elemental and sacred. Here, traditional mountain huts (*rifugi*) have sheltered travelers for over a century. Constructed from heavy local dolomite limestone and weather-silvered larch timber, these refuges are models of vernacular mountain architecture, engineered to withstand ferocious sub-zero winter blizzards while exuding warmth within.",
      "Entering a family-operated rifugio after an arduous seven-hour traverse over rocky scree is an incomparable sensory pleasure. The scent of burning pine logs fills the wood-paneled *stube*. Guests sit at communal pine benches, peeling off wool gloves to cradle steaming bowls of South Tyrolean canederli dumplings swimming in rich beef broth flavored with alpine herbs.",
      "## The Golden Hour of Enrosadira",
      "The defining spectacle of autumn in the Dolomites is the phenomenon the Ladin-speaking locals call *enrosadira*. Because the mineral composition of dolomite rock contains magnesium and calcium carbonate, the sheer cliff faces do not simply reflect sunlight—they absorb and transform it.",
      "At dusk, as the sun dips beneath the western horizon, the pale gray spires ignite into glowing shades of apricot, coral, and deep violet. Standing on a windswept plateau at 2,500 meters watching this silent chromatic performance is an experience that defies photographic reproduction. It demands patient presence, reminding travelers of the vast geologic timescales that dwarf our human anxieties.",
      "## Solitude as Renewal",
      "Autumn mountain travel teaches us the value of seasonal transition. In nature, trees do not cling stubbornly to their foliage; they gracefully surrender what is no longer needed in preparation for deep winter rest. Walking through silent larch forests with golden needles drifting quietly onto the trail, we are reminded to welcome our own seasons of reflection, rest, and renewal.",
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
      "In a sun-drenched atelier overlooking the Arno River in Florence, the air carries the rich, intoxicating scent of beeswax, pine pitch, and oak-bark-tanned calfskin. Master cordwainer Stefano Bemer works seated on a low wooden stool, deftly smoothing a carved beechwood last that replicates the millimeter dimensions, arch support, and contours of a client's foot. It will take more than sixty-five hours of focused hand labor to craft a single pair of bespoke oxford shoes.",
      "## The Anatomy of the Hand-Welt",
      "While ninety-nine percent of modern footwear relies on chemical cementing—gluing synthetic soles to molded uppers in automated overseas factories—traditional bespoke shoemaking remains an unbroken lineage of medieval masterwork. Central to this craft is the hand-welted construction.",
      "Using a curved awl and heavy linen thread saturated with natural pitch, the shoemaker manually stitches the upper leather, insole, and welt together without a single droplet of synthetic adhesive. Between the insole and outsole, a layer of granulated natural cork is packed to provide breathable thermal insulation. Over months of walking, this cork layer compresses and molds into a custom anatomical orthotic unique to the wearer's gait.",
      "## The Alchemy of Vegetable Tannins",
      "Equally critical is the selection of leather. Industrial tanneries utilize toxic chromium salts to rapidly process hides within hours, producing stiff leathers that crack and peel over time. In stark contrast, heritage tanneries in Tuscany and England's Northamptonshire rely on months-long steeping in vats of natural oak and chestnut bark extracts.",
      "This gentle, organic vegetable tanning preserves the natural breathability and grain structure of French calfskin. When conditioned with natural tallow and bone oils, the leather does not deteriorate with age—it matures, acquiring a glowing, deep amber patina that tells the personal journey of its owner over decades of faithful wear.",
      "## Why the Next Generation Cares",
      "Remarkably, the fastest-growing demographic seeking bespoke footwear today is not octogenarian aristocrats, but design-conscious professionals in their late twenties and thirties. Exhausted by fast fashion's planned obsolescence and plastic sneaker drops, young consumers view bespoke shoemaking as the ultimate intersection of functional sculpture, environmental responsibility, and personal identity. Investing in footwear that can be resoled indefinitely is both an economic triumph and an aesthetic declaration.",
    ],
    category: "Fashion & Culture",
    coverImage:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Nov 04, 2026",
    readTime: "5 min read",
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
      "The human brain did not evolve to process thousands of algorithmic notifications, breaking news alerts, and hyper-reactive group messages every waking day. Modern cognitive scientists estimate that the average knowledge worker checks their smartphone every four minutes, fracturing deep attention into fleeting, dopamine-addled fragments and inducing a permanent state of low-grade neurological fight-or-flight.",
      "## The Ritual of the Analog Shabbat",
      "In response to this chronic sensory exhaustion, writers, founders, and cultural thinkers are adopting a disciplined practice known as 'digital monasticism': completely disconnecting from all digital screens, wireless internet, and cellular data from Friday evening at sunset until Monday morning at dawn.",
      "The transition is initially disorienting. During the first few hours of analog quiet, the brain experiences phantom vibration syndrome—a compulsive urge to reach into one's pocket to refresh phantom feeds. But by Saturday morning, something remarkable occurs. The baseline cognitive noise subsides, resting heart rates decline, and the nervous system settles into a state of profound physiological restoration.",
      "## Rediscovering Tactile Presence",
      "Without the frictionless distraction of digital screens, the physical world rushes back in with vivid clarity. Cooking a leisurely dinner becomes an immersive sensory act rather than an interrupted chore. Reading heavy cloth-bound books without backlighting allows the mind to follow complex literary arguments across sixty unbroken pages.",
      "Handwriting thoughts with a fountain pen in a notebook unlocks different neural pathways than typing on glass screens. The resistance of the nib against fibrous paper forces measured pacing and deliberate reflection. Conversations with loved ones stretch across hours without the ambient threat of an incoming notification buzzer.",
      "## Returning to the World with Agency",
      "When digital monastics turn their devices back on come Monday morning, they consistently report that virtually zero 'urgent' weekend notifications actually required immediate response. More crucially, their relationship to technology has shifted from compulsive subservience to conscious utility.",
      "By deliberately stepping out of the digital panopticon for forty-eight hours every week, we reclaim ownership over our most precious finite resource: our conscious attention. In doing so, we rediscover that true life is not lived through glowing pixels, but in the physical, breathing spaces between them.",
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
      "Never in economic history has a single creator possessed the organizational leverage of a mid-sized twentieth-century publishing conglomerate. Two decades ago, distributing a weekly cultural magazine to fifty thousand dedicated subscribers required printing presses, distribution fleets, advertising sales teams, and substantial working capital.",
      "Today, a solitary operator armed with high-taste editorial curation, headless publishing infrastructure, and thoughtful automation can orchestrate an eight-hundred-thousand-dollar annual recurring media business from a kitchen table—all while maintaining an astonishing ninety-two percent net profit margin.",
      "## High-Signal Curation as the Ultimate Moat",
      "In an internet flooded with commoditized algorithmic content and generic AI filler, the scarcity has inverted. Information is abundant and cheap; discernment, curation, and voice are rare and exceptionally valuable. Readers are not seeking more volume; they are eagerly paying premium annual memberships for someone to act as a trusted cultural filter.",
      "Successful modern solopreneurs understand that their competitive moat is their uncompromising editorial taste. By focusing on deep-dive research, original photography, and rigorous narrative essays, they build deep trust with an audience that gladly pays ten to twenty dollars per month for a publication that respects their intelligence.",
      "## The Architecture of the Lean Tech Stack",
      "Behind the polished editorial facade lies an elegant, highly automated production engine. Modern solopreneurs do not spend their days managing manual spreadsheets or sending repetitive emails. Instead, they string together modular, best-in-class developer tools:",
      "Headless content management systems dispatch automated daily digests, edge-hosted serverless functions handle subscription lifecycle events, and automated image processing pipelines generate responsive multi-format assets within seconds. By automating the mechanical logistics of media publishing, the founder protects eighty percent of their working calendar for what truly moves the needle: researching, writing, and cultivating genuine reader relationships.",
      "## The Freedom of the One-Person Empire",
      "Ultimately, the goal of the solopreneur media model is not to build a bloated empire with hundreds of employees and endless investor meetings. It is the pursuit of sovereignty. When you own your audience relationships directly via email, operate with near-zero overhead, and generate healthy cash flows, you attain a level of creative and personal freedom that no corporate executive can match. You build an enduring business designed around your ideal life, rather than sacrificing your life to serve a business.",
    ],
    category: "Business, Money & Entrepreneurship",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "Oct 30, 2026",
    readTime: "6 min read",
    author: {
      name: "Maya Lin",
      role: "Ventures & Economics",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  },
];

export function getDailyFeaturedPost(posts: Post[] = MOCK_POSTS): Post {
  if (!posts || posts.length === 0) return MOCK_POSTS[0];
  const todayUtc = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < todayUtc.length; i++) {
    hash = (hash << 5) - hash + todayUtc.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % posts.length;
  return posts[index];
}

export function getFeaturedPost(): Post {
  return getDailyFeaturedPost();
}

export function getGridPosts(): Post[] {
  return MOCK_POSTS.filter((p) => !p.featured);
}

export function getPostBySlug(slug: string): Post | undefined {
  return MOCK_POSTS.find((p) => p.slug === slug);
}
