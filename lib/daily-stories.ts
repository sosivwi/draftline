import { createClient } from "@supabase/supabase-js";
import { Post, Category } from "@/lib/mock-posts";

export interface EditorialAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface EditorialStoryItem {
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  coverImage?: string;
  readTimeMinutes: number;
  author?: EditorialAuthor;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSupabaseAdminOrPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

// ============================================================================
// 1. EXPANDED 24-AUTHOR EDITORIAL POOL (WITH EXACT ROLES)
// ============================================================================
export const EDITORIAL_AUTHORS: EditorialAuthor[] = [
  {
    name: "Elena Vance",
    role: "Travel & Culture Editor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Julian Moreau",
    role: "Style & Culture Editor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Maya Lin",
    role: "Business & Strategy Editor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Clara Lindqvist",
    role: "Architecture & Design Editor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Soren Lindholm",
    role: "Urbanism & Mobility Correspondent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Tunde Adeyemi",
    role: "Technology & Culture Writer",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Nadia Al-Mansoor",
    role: "Art & Aesthetics Editor",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mateo Villalobos",
    role: "Food & Craft Correspondent",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Hannah Gallagher",
    role: "Editorial Features Writer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kenji Takahashi",
    role: "Industrial Design Columnist",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Amara Okafor",
    role: "Media & Creator Economy Writer",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Lucas Ferreira",
    role: "Photography & Visual Essayist",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya Subramanian",
    role: "Future of Work Editor",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "David Kowalski",
    role: "Economics & Markets Writer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Camille Laurent",
    role: "Literary & Publishing Critic",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kwame Mensah",
    role: "Independent Systems & Craft Writer",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rachel Lindner",
    role: "Health, Pace & Living Editor",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Omar Farooq",
    role: "Global Affairs & Trade Writer",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sofia Conti",
    role: "Interior & Material Culture Writer",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ethan Brooks",
    role: "Product & Software Essayist",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mei-Ling Zhou",
    role: "Culinary & Hospitality Writer",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Jonas Bergstrom",
    role: "Sustainability & Infrastructure Writer",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Zara Hussain",
    role: "Digital Culture & Society Writer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Caleb Osei",
    role: "Entrepreneurship & Calm Business Writer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
];

// Map any story title or slug deterministically to one of the 24 authors
export function getEditorialAuthorForStory(slugOrTitle: string): EditorialAuthor {
  let hash = 0;
  const clean = slugOrTitle.toLowerCase().trim();
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % EDITORIAL_AUTHORS.length;
  return EDITORIAL_AUTHORS[idx];
}

// ============================================================================
// 2. EXPANDED 20-IMAGE UNSPLASH POOL ACROSS CATEGORIES
// ============================================================================
export const UNSPLASH_IMAGE_POOL: string[] = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
];

// Helper to extract author from content string if embedded
export function extractAuthorFromContent(rawContent: string): EditorialAuthor | null {
  const match = rawContent.match(/<!--\s*author:\s*([^|]+?)\s*\|\s*([^|]+?)\s*(?:\|\s*([^>]+?)\s*)?-->/i);
  if (!match) return null;
  const name = match[1].trim();
  const role = match[2].trim();
  const found = EDITORIAL_AUTHORS.find((a) => a.name.toLowerCase() === name.toLowerCase());
  if (found) return found;
  return {
    name,
    role,
    avatar: match[3]?.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  };
}

// Strip internal comment tags from article content
export function cleanEditorialContent(rawContent: string): string {
  return rawContent.replace(/<!--[\s\S]*?-->/g, "").trim();
}

// ============================================================================
// 3. EXPANDED 24-STORY CURATED EDITORIAL POOL
// ============================================================================
export const CURATED_EDITORIAL_POOL: EditorialStoryItem[] = [
  {
    title: "The Architecture of Solitude: Modern Pavilions in Nordic Fjords",
    excerpt: "Exploring how contemporary Scandinavian architects design minimalist timber sanctuaries that harmonize with harsh sub-Arctic topography.",
    content: `Architecture in the Nordic landscape is an exercise in restraint and dialogue with the elements. Over the past decade, a quiet renaissance of remote timber pavilions and cliffside retreats has demonstrated how modern design can exist in profound intimacy with nature.\n\nFrom the wind-scoured coastlines of western Norway to the pine archipelagos of northern Sweden, these structures prioritize light, thermal mass, and local material honesty. Unfinished larch and charred cedar facades age naturally against seasonal salt and precipitation, becoming darker and more integrated with surrounding stone over time.\n\n## Passive Climate Design and Vernacular Materials\n\nUnlike traditional alpine cabins that impose heavy stone footprints upon the earth, these contemporary pavilions rest lightly on steel pilings anchored directly into Precambrian bedrock. This elevated stance preserves delicate lichen ecosystems beneath while allowing gale-force Arctic drafts to pass underneath without inducing structural vibration.\n\nTriple-glazed argon-insulated curtain walls provide 270-degree panoramas of shifting fjord waters, tidal pack ice, and the aurora borealis. Internally, walls lined with untreated Nordic spruce emit a gentle resinous scent, while radiant geothermal floor systems embedded beneath honed slate tiles maintain comfortable interior temperatures through sub-zero blizzards.\n\n## The Psychology of Spatial Silence\n\nInside these remote sanctuaries, extraneous ornament is systematically eliminated. Storage is concealed behind flush wood cabinetry, hardware is fashioned from unlacquered raw brass, and bespoke furniture is sculpted from storm-felled birch. The interior becomes a quiet acoustic chamber where the howling ocean wind is transformed into a soothing ambient hum.\n\nFor residents and visiting artists, this spatial austerity serves a clear psychological purpose. Stripped of consumer noise and digital notifications, attention expands naturally to match the scale of the landscape, inviting prolonged periods of deep creative focus and mental restoration.`,
    category: "Lifestyle & Modern Living",
    readTimeMinutes: 5,
  },
  {
    title: "Rituals of Scent: Exploring the Rare Perfume Houses of Grasse",
    excerpt: "A quiet voyage through the historic hills of southern France, where generational artisans distill heritage botanicals with ancestral precision.",
    content: `In the terraced limestone hills behind Cannes, morning mist carries the intoxicating fragrance of centifolia roses, wild lavender, and bitter orange blossoms. Grasse has stood as the undisputed global capital of perfume distillation since the eighteenth century, yet its most compelling stories emerge not from conglomerate corporate laboratories, but from family-tended botanical fields.\n\nHere, the annual harvest begins before dawn, when night moisture still clings to delicate petals and essential aromatic esters are at their peak concentration. Hand-picked blossoms are transported directly in burlap sacks to copper alembic stills, where steam extraction preserves fleeting top notes that synthetic molecules can never replicate.\n\n## The Alchemy of the Master Nose\n\nInside a stone atelier built in 1792, fifth-generation master perfumer Jean-Luc Fabre demonstrates the patience required to develop a single bespoke fragrance. A true artisanal composition can take up to three years of patient maceration, balancing fleeting floral top notes with deep balsamic base accords of labdanum, aged orris root, and Haitian vetiver.\n\nUnlike mass-market commercial fragrances engineered with synthetic fixatives to project loudly across room distances, these bespoke formulations possess an intimate, evolving sillage. They adapt to the wearer's skin chemistry, warming with pulse points and revealing subtle nuances over twelve hours of gentle wear.\n\n## Preserving Generational Biodiversity\n\nIn recent years, Grasse's heritage growers have formed independent cooperatives to protect ancient botanical varietals from suburban expansion. By practicing biodynamic agriculture without pesticides, they ensure the soil retains the unique mineral composition that gives Provence botanicals their legendary complexity.`,
    category: "Fashion & Culture",
    readTimeMinutes: 5,
  },
  {
    title: "Quiet Capital: The Rise of Patient, Bootstrapped Studios",
    excerpt: "Why the most innovative creative leaders are rejecting venture hyper-growth to build enduring, high-margin independent enterprises.",
    content: `For over fifteen years, the prevailing startup orthodoxy dictated that greatness required venture hyper-scaling. Founders were encouraged to raise massive seed and growth rounds, hire dozens of employees ahead of revenue, and burn millions of dollars chasing total market domination. Today, a decisive counter-movement of founders and design directors is proving that patience is the ultimate competitive moat.\n\nBy deliberately maintaining lean operational footprints and cultivating deep organic relationships with dedicated audiences, these studios achieve exceptional operating margins without sacrificing craft or autonomy.\n\n## Operational Calm and High Leverage\n\nRather than measuring success by vanity metrics such as headcount expansion, quiet studios operate with small, elite teams—frequently under fifteen professionals. They leverage modern serverless infrastructure, automated distribution pipelines, and asynchronous communication tools to generate millions in recurring revenue with near-zero managerial bureaucracy.\n\nWithout the pressure of quarterly investor milestones demanding synthetic hyper-growth, these teams have the freedom to spend months perfecting a typeface, refining user onboarding ergonomics, or conducting original investigative research. The resulting products possess a level of cohesion and soul that committee-driven corporate software inevitably lacks.\n\n## Sovereignty as the Ultimate Dividend\n\nPerhaps the greatest advantage of the bootstrapped studio model is creative and strategic independence. When founders own one hundred percent of their voting equity, they answer solely to their customers and their personal values.\n\nThey can choose to cap client intake to preserve quality of life, invest profits into experimental art books or community initiatives, and build enterprises designed to endure across decades rather than flipping to conglomerate buyers. In an economic landscape fraught with volatility, quiet capital represents the future of sustainable, dignified entrepreneurship.`,
    category: "Business, Money & Entrepreneurship",
    readTimeMinutes: 5,
  },
  {
    title: "The Art of Slow Dining: Natural Wine and Seasonal Foraging in Hokkaido",
    excerpt: "How remote northern Japanese ateliers are reimagining farm-to-table cuisine through wild mountain herbs and low-intervention fermentation.",
    content: `Winter in Hokkaido arrives with sweeping blankets of snow from the Sea of Japan, reshaping the rhythm of culinary life in the volcanic valleys around Niseko, Yoichi, and Otaru.\n\nRather than relying on imported produce or synthetic flavor enhancers, a collective of independent chefs and winemakers is pioneering an uncompromising culinary philosophy rooted in wild mountain foraging, ancestral fermentation, and raw geographic terroir.\n\n## Ancestral Preservation and Mountain Foraging\n\nDuring the brief sub-Arctic summer and autumn months, chefs traverse the slopes of Mount Yotei gathering wild sansai mountain herbs, bamboo shoots, and matsutake mushrooms. These are preserved using traditional cedar barrels, sea salt curing, and koji fermentation, creating deep umami foundations that sustain communities through harsh sub-zero temperatures.\n\nEvery dish presented at these intimate eight-seat dining counters reflects a profound conversation with the immediate wilderness: raw sea urchin paired with pickled wild mountain leeks, slow-roasted Hokkaido venison glazed with fermented birch sap, and smoked river trout caught that morning in alpine streams.\n\n## The Low-Intervention Wine Revolution\n\nAccompanying this cuisine is a remarkable renaissance in northern Japanese viticulture. On the volcanic hillsides of the Shakotan Peninsula, young vignerons cultivate Pinot Noir, Kerner, and Zweigelt grapes without synthetic fertilizers or chemical sprays.\n\nHarvested by hand and fermented spontaneously with wild native yeasts in neutral oak barrels, these unfiltered natural wines possess vibrant acidity, mineral salinity, and a delicate translucence that perfectly complements raw alpine cuisine. Sitting at a warm timber counter while snow falls silently outside the window is an unforgettable masterclass in culinary humility and harmony with nature.`,
    category: "Travel Places",
    readTimeMinutes: 5,
  },
  {
    title: "Subterranean Light: The New Language of Earth-Sheltered Architecture",
    excerpt: "How subterranean museums, wine cellars, and cliff dwellings across the Mediterranean harness thermal equilibrium and dramatic ocular skylights.",
    content: `Carving living spaces into the earth is mankind's oldest architectural instinct. Across the arid plateaus of central Spain, southern Portugal, and the Greek Cyclades, contemporary architects are abandoning above-ground concrete boxes to revive the subterranean vernacular.\n\nBy excavating directly into limestone bluffs, these structures benefit from perpetual thermal mass. While surface temperatures in peak summer climb past forty degrees Celsius, interior galleries remain naturally tempered at twenty-one degrees without active air conditioning.\n\n## Choreographing Daylight from Above\n\nThe central challenge of underground architecture has always been illumination. Rather than installing continuous artificial lighting, subterranean designers puncture the earth with deep conical light wells and circular occuli inspired by the Pantheon in Rome.\n\nAs the sun journeys across the sky, crisp shafts of natural illumination trace geometric patterns across bush-hammered limestone walls. Morning light washes the communal dining tables; late afternoon rays illuminate private study alcoves. The interplay between raw stone, deep shadows, and precise light creates an atmosphere of monastic reverence.\n\n## Geological Permanence and Landscape Restoration\n\nAbove ground, the building is practically invisible. Indigenous olive trees, wild thyme, and native grasses grow directly atop the roof soil layer, preserving agricultural biodiversity and continuous wildlife migration corridors.\n\nIn an era dominated by transient construction and fragile synthetic materials, subterranean architecture offers a striking reminder of durability. These structures are built to endure for centuries, blending quietly into the ancient topography that cradles them.`,
    category: "Lifestyle & Modern Living",
    readTimeMinutes: 5,
  },
  {
    title: "The Sovereign Artisan: The Renaissance of Generational Japanese Indigo",
    excerpt: "In the river valleys of Tokushima, master dyers use fermented Sukumo leaves and river well water to produce shades of blue that never fade.",
    content: `Along the Yoshino River in Tokushima Prefecture, the scent of fermenting indigo leaves fills the morning air. For more than eight hundred years, this fertile floodplain has produced Sukumo—the fermented compost of the polygonum tinctorium plant that gives authentic Japanese indigo its legendary depth and vitality.\n\nWhile industrial textile manufacturing shifted long ago to petrochemical synthetic dyes that degrade after repeated washes, Tokushima's generational indigo masters continue to work by hand with wooden vats buried deep into atelier earthen floors.\n\n## The Living Ecosystem of the Vat\n\nA true indigo vat is not a chemical solution; it is a delicate living culture. The master dyer feeds the vat daily with wheat bran, wood ash lye, and sake, monitoring temperature and pH purely through scent, taste, and the tactile viscosity of the liquid.\n\nWhen raw linen or organic cotton is submerged into the vat, it emerges a vibrant chartreuse green. Only upon contact with atmospheric oxygen does the dye instantaneously oxidize into its signature deep indigo hue. Achieving rich, near-black navy requires dipping and airing the textile up to thirty consecutive times over several weeks.\n\n## Enduring Color and Natural Medicine\n\nUnlike synthetic dyes that simply coat the surface of fabric fibers, natural indigo bonds chemically into the core of the thread. Over decades of wear, the fabric does not lose its character; instead, high-friction areas fade to reveal intricate gradients of cerulean and sky blue.\n\nHistorically worn by samurai underneath armor for its natural antibacterial, insect-repelling, and flame-retardant properties, Tokushima indigo represents a pinnacle of functional textile craft—one that honors the patience of nature over the speed of commerce.`,
    category: "Fashion & Culture",
    readTimeMinutes: 5,
  },
  {
    title: "The Trans-Himalayan Line: A Meditative Railway Crossing Through Cloud Passes",
    excerpt: "Documenting the slow journey through high-altitude tea plantations, pine ridges, and mountain hamlets where the train remains a social lifeline.",
    content: `There is an unmistakable romance to high-altitude mountain railways that air travel can never replicate. As the narrow-gauge train climbs steadily out of the subtropical foothills toward the jagged peaks of the eastern Himalayas, the rhythmic clatter of steel against rail becomes a steady metronome for contemplation.\n\nThrough switchbacks and horseshoe curves engineered over a century ago, the line winds past terraced tea estates clinging to forty-degree gradients. Morning cloud banks drift directly through the open carriage windows, drenching passenger faces in crisp pine mist.\n\n## The Architecture of the Mountain Route\n\nEvery station along this alpine corridor reflects vernacular hillside craftsmanship. Built from hand-chiseled river boulders and heavy teak timber, these stations feature broad overhanging eaves designed to deflect torrential monsoon rains.\n\nAt each brief halt, local vendors board the carriages carrying steaming clay cups of cardamom milk tea, roasted chickpeas wrapped in newsprint, and jars of wild rhododendron honey. The train is far more than a transit conduit; it is an active market square and cultural crossroads connecting isolated mountain villages.\n\n## Recalibrating Time at 7,000 Feet\n\nTraveling at a modest twenty kilometers per hour compels travelers to surrender control over their schedules. Mobile connectivity dissipates as the train curves behind granite ridges, replaced by uninterrupted views of snow-dusted summits piercing the upper atmosphere.\n\nIn our hyper-connected reality, this enforced stillness is a rare luxury. To spend twelve uninterrupted hours watching sunlight shift across alpine ridges is to rediscover the forgotten pleasure of deep observation—a reminder that the journey itself is the true destination.`,
    category: "Travel Places",
    readTimeMinutes: 6,
  },
  {
    title: "The Craft of Tactile Hardware: Why Physical Controls Are Making a Comeback",
    excerpt: "Industrial designers are rebelling against ubiquitous capacitive glass screens in favor of weighted knobs, knurled aluminum, and mechanical switches.",
    content: `For two decades, modern consumer technology championed a single dogma: every physical button, slider, and dial had to be replaced by a flat touchscreen. While capacitive glass surfaces offered undeniable software flexibility and reduced manufacturing costs, they also stripped products of their physical soul.\n\nToday, a discerning generation of industrial designers, audio engineers, and automotive architects is leading a major tactile counter-revolution, restoring mechanical friction and haptic honesty to high-performance tools.\n\n## The Neurobiology of Tactile Feedback\n\nHuman hands possess thousands of mechanoreceptors capable of discerning micron-level textures and sub-millimeter detents. When adjusting audio equalization, camera aperture, or vehicle climate controls, tactile switches allow users to make precise adjustments without looking down at a screen.\n\nKnurled aluminum rotary dials provide weighted inertia; toggle switches snap with a satisfying mechanical click that confirms action through muscle memory. By engaging the somatosensory cortex, tactile interfaces create an intuitive, intimate dialogue between human and machine that glass panels can never replicate.\n\n## Designing for Permanence and Emotional Attachment\n\nBeyond functional utility, physical hardware fosters emotional attachment. An anodized brass volume knob develops a soft patina with years of daily touch; mechanical keys retain their crisp actuation over decades of use.\n\nIn contrast to disposable consumer devices that become obsolete when their software updates cease, tactile products are built to outlast their creators. They celebrate the material dignity of metals, hardwoods, and precision springs—proving that the best technology is that which honors human sensory physiology.`,
    category: "Business, Money & Entrepreneurship",
    readTimeMinutes: 5,
  },
  {
    title: "Monolithic Stillness: Brutalist Timber Sanctuaries of the Swiss Valleys",
    excerpt: "How Alpine master carpenters use massive solid spruce beams and zero metal joinery to create buildings of timeless structural weight.",
    content: `High in the Graubünden valley of eastern Switzerland, wood is not regarded as lightweight framing; it is treated with the solemn permanence of stone. Here, generational master carpenters construct timber residences utilizing interlocking mortise-and-tenon joints, completely eliminating metal fasteners and glue.\n\nEach beam is seasoned for up to three winters in high-altitude dry air, allowing the wood grain to stabilize against seasonal temperature swings. When assembled, the massive spruce walls settle gently under their own gravity, creating airtight seals that resist sub-zero mountain gales.\n\n## Thermal Resonance and Resinous Silence\n\nInside these solid-wood sanctuaries, acoustic reverberation is gentle and warm. The cellular density of thick timber absorbs harsh high frequencies, fostering an environment of deep contemplative calm.\n\nGeothermal heat radiating from local serpentinite stone floor slabs releases subtle aromas of pine resin and beeswax, grounding inhabitants in a sensory experience entirely removed from urban noise and visual clutter.`,
    category: "Lifestyle & Modern Living",
    readTimeMinutes: 5,
  },
  {
    title: "The Dye Gardens of Oaxaca: Ancestral Pigments and Botanical Weaving",
    excerpt: "In the central valleys of southern Mexico, Zapotec weaving collectives cultivate cochineal, wild marigolds, and indigo on volcanic soil.",
    content: `At the foot of the Sierra Madre del Sur, morning sunlight illuminates rows of nopal cacti dusted with white powder. These are the host plants for cochineal—the legendary scale insect that has yielded the world's most brilliant natural carmine red since pre-Columbian times.\n\nIn Teotitlán del Valle, indigenous Zapotec families continue to dye hand-spun wool in copper caldrons heated over oak wood embers, blending ancestral botanical knowledge with minimalist geometric design.\n\n## The Chemistry of Natural Color\n\nBy adjusting the acidity of dye baths with lime juice or wood ash, master dyers transform crimson cochineal into twenty distinct shades, ranging from delicate coral to deep midnight purple.\n\nWoven on traditional pedal and backstrap looms, these textiles celebrate the subtle irregularities of hand-spun yarn. Every rug is a topographical map of its valley—a testament to human patience that synthetic chemical pigments can never rival.`,
    category: "Fashion & Culture",
    readTimeMinutes: 5,
  },
  {
    title: "Islands of Sea Mist: A Solitary Journey Across the Outer Hebrides",
    excerpt: "Traversing the wind-scoured coastlines and ancient peat bogs of Scotland's Atlantic edge, where daylight lingers like a silver mist.",
    content: `On the western rim of the British Isles, the Atlantic Ocean meets miles of deserted white sand and turquoise shallows that rival the Aegean. Yet here, water temperatures hover near ten degrees, and coastal gales reshape the machair grasslands with every high tide.\n\nTraveling across Lewis and Harris in autumn is a study in meteorological drama. Granite sea cliffs rise vertically from churning swells, while ancient standing stones at Callanish stand silent witness to five millennia of Atlantic storms.\n\n## The Solitary Rhythms of Crofting Life\n\nScattered across the moorland, traditional stone crofts with smoke curling from peat hearths anchor isolated communities. Evenings are defined by the warmth of cast-iron stoves and stories spoken in Scottish Gaelic.\n\nFor the solitary traveler, the Outer Hebrides offer an antidote to modern hyper-connectivity. In the immense quiet of the heather plains, with the ocean wind as one's sole companion, the mind gradually sheds extraneous worry and returns to clarity.`,
    category: "Travel Places",
    readTimeMinutes: 6,
  },
  {
    title: "The Patient Studio: Designing Products for Twenty-Year Horizons",
    excerpt: "Why forward-thinking industrial ateliers are rejecting planned obsolescence to build repairable, heirloom-grade everyday goods.",
    content: `The modern manufacturing consensus is built on intentional fragility: glue assemblies together, withhold replacement components, and release incremental upgrades every twelve months to force perpetual consumption.\n\nIn response, an international vanguard of independent product designers is reviving the ethos of heirloom engineering. By designing products intended to operate flawlessly for twenty years or longer, they turn durability into their primary artistic signature.\n\n## Modular Assembly and Open Schematics\n\nRather than ultrasonic welding, these studios fasten components with standard stainless steel machine screws that any owner can disassemble with basic tools. Wear parts—such as gaskets, potentiometers, and internal batteries—are standardized and sold at direct cost.\n\nBy releasing open mechanical schematics and using unplated solid metals, these ateliers grant customers genuine ownership over their possessions. A well-designed tool that improves with age is not merely an object; it is an enduring companion through life.`,
    category: "Business, Money & Entrepreneurship",
    readTimeMinutes: 5,
  },
  {
    title: "Circadian Sanctuaries: How Passive Daylight Shapes Contemporary Well-Being",
    excerpt: "Examining architectural techniques that align indoor living environments with the natural daily rhythm of the solar cycle.",
    content: `For ninety percent of human history, biological clocks were governed exclusively by dawn and twilight. The widespread adoption of high-intensity blue-spectrum LEDs has inadvertently severed this ancestral rhythm, disrupting cellular recovery and deep sleep.\n\nContemporary wellness architects are addressing this crisis through daylight choreography. By positioning breakfast alcoves along eastern exposures and living salons toward low western rays, interior spaces naturally sync residents with the earth's rotation.\n\n## Shadow Play and Sensory Calibration\n\nDeep architectural reveals, linen drapery, and clerestory louvers filter midday glare into gentle diffuse ambient light. As twilight approaches, warm 2200-Kelvin indirect fixtures emulate the natural spectrum of dying embers.\n\nLiving in harmony with natural solar progression restores hormonal balance and mental tranquility—proving that the most powerful restorative technology is natural daylight itself.`,
    category: "Lifestyle & Modern Living",
    readTimeMinutes: 5,
  },
  {
    title: "The Ceramic Renaissance: Clay, Ash Glazes, and the High Fire Kilns of Mashiko",
    excerpt: "In the pottery town of Tochigi, ceramicists preserve wood-fired noborigama kilns to create tableware that bears the imprint of fire and human hands.",
    content: `Two hours north of Tokyo, the hillside ateliers of Mashiko remain filled with the sound of kick-wheels and the crackle of pine split-logs. Since the folk craft movement (Mingei) championed pottery for everyday use in the 1920s, Mashiko has stood as an international beacon for honest ceramic craft.\n\nPotters here formulate glazes using local feldspar stone, river sand, and the ashes of burnt rice husks. When fired in multi-chamber climbing kilns (noborigama) for three continuous days, the fly ash melts naturally onto clay bodies, creating unpredictable olive-green gradients and scorched amber highlights.\n\n## The Warmth of Utilitarian Beauty\n\nUnlike flawless, factory-extruded porcelain, hand-thrown stoneware retains subtle asymmetries that fit comfortably into human hands. A small tea cup or rice bowl becomes a daily tactile ritual, connecting modern diners with earth, wood smoke, and artisanal dedication.`,
    category: "Fashion & Culture",
    readTimeMinutes: 5,
  },
  {
    title: "The Volcanic Terraces: Pre-Phylloxera Vines and Basalt Cellars on Mount Etna",
    excerpt: "How young winemakers on the black lava slopes of Europe's most active volcano craft mineral, translucent wines of startling elegance.",
    content: `Rising nearly 11,000 feet above the Ionian Sea, Mount Etna is a living, breathing mountain of fire and black volcanic ash. Yet on its steep northern slopes, ungrafted bush vines—some over a century old—thrive in decomposed basalt and pulverized pumice.\n\nHere, high altitude creates dramatic diurnal temperature swings of twenty degrees Celsius between day and night, preserving vibrant acidity and mineral energy in the indigenous Nerello Mascalese grape.\n\n## Terroir of Fire and Ice\n\nHarvesting these ancient terraces requires surefooted manual labor. Winemakers ferment whole grape clusters in porous volcanic stone basins (palmenti) with indigenous yeasts, aging the wine in neutral Slavonian oak barrels.\n\nThe resulting red wines are pale in color, reminiscent of fine Burgundy, but deliver intense salinity, wild herbs, and crushed flint minerality. Drinking Etna wine is an intimate encounter with the volcanic heartbeat of Sicily.`,
    category: "Travel Places",
    readTimeMinutes: 5,
  },
  {
    title: "Asynchronous Calm: The Internal Architecture of Non-Urgent Workplaces",
    excerpt: "How forward-thinking companies are dismantling real-time chat panic to rebuild focus, deep work, and operational serenity.",
    content: `The modern knowledge economy fell victim to an insidious illusion: the idea that immediate response times equal productivity. Workers found themselves trapped in continuous real-time messaging threads, constantly reacting to notifications while core strategic thinking languished.\n\nA growing coalition of profitable tech companies and creative agencies is proving that asynchronous communication is the true secret to exceptional team performance.\n\n## The Sovereign Workday\n\nBy replacing urgent chat pings with long-form written proposals and clear decision deadlines, these teams grant their contributors uninterrupted four-hour focus blocks. Ideas are evaluated on the clarity of their reasoning rather than who responds the fastest.\n\nThe outcome is higher creative output, dramatically lower employee burnout, and superior strategic execution. In a frantic business culture, calm is a decisive competitive weapon.`,
    category: "Business, Money & Entrepreneurship",
    readTimeMinutes: 5,
  },
  {
    title: "The Paper Makers of Echizen: Twelve Hundred Years of Mulberry Fiber Craft",
    excerpt: "Exploring the historic riverside workshops of Fukui Prefecture, where papermakers hand-screen translucent sheets of archival washi.",
    content: `In the mountain hamlets around Echizen, clean snowmelt rivers have fueled papermaking since the sixth century. Here, master craftsmen peel and boil the inner bark of kozo (mulberry) trees, beating the fibers by hand with heavy wooden mallets until they disperse into cold water.\n\nStanding barefoot over cedar vats, artisans rhythmically dip a bamboo screen (suketa), weaving the wet fibers with gentle undulating waves. As the excess water drains away, a sheet of washi emerges—delicate in appearance, yet with tensile strength that can survive a thousand years without yellowing.\n\n## Washi in Modern Architecture and Design\n\nToday, contemporary lighting designers and interior architects are rediscovering washi for its unique ability to diffuse harsh glare into warm, living luminance. By bridging twelve centuries of craft with contemporary minimalist spaces, Echizen proves that true quality never goes out of style.`,
    category: "Fashion & Culture",
    readTimeMinutes: 5,
  },
  {
    title: "Acoustic Architecture: Why Modern Sanctuaries are Built Around Natural Reverberation",
    excerpt: "How progressive acousticians and concert hall architects design spaces using angled timber, plaster, and natural decay times.",
    content: `In modern city life, we are surrounded by harsh acoustic noise—street traffic, construction, and the tinny rattle of electronic speakers. When entering a room engineered with natural acoustic resonance, the human nervous system instinctively decelerates.\n\nConcert hall designers and private library architects are using mathematical proportions inspired by Greek amphitheatres and monastic cloisters to shape how sound waves travel through space.\n\n## Material Resonance and Decay\n\nBy pairing solid plaster walls with fluted unvarnished oak panels, sound waves decay smoothly over 1.8 seconds. Footsteps become soft percussive beats; human speech carries with warmth and clarity without amplification.\n\nDesigning for the ear is as critical as designing for the eye. True luxury in modern living is the presence of acoustic harmony and the absence of mechanical noise.`,
    category: "Lifestyle & Modern Living",
    readTimeMinutes: 5,
  },
  {
    title: "The Lost Mountain Trails of Montenegro: Ancient Stone Bridges and Pine Glades",
    excerpt: "Hiking through the rugged limestone canyons of Durmitor National Park, where glacial lakes reflect jagged Balkan peaks.",
    content: `The Dinaric Alps rise like a serrated limestone fortress above the Adriatic coast of Montenegro. Behind the historic fjords of Kotor lies Durmitor, a pristine wilderness of primeval black pine forests, sheer vertical gorges, and eighteen glacial lakes known locally as 'mountain eyes.'\n\nFollowing ancient shepherd trails paved with weathered limestone boulders, hikers journey through meadows carpeted with wild gentian and alpine thyme. Stone shepherd huts with steep cedar shake roofs offer shelter from afternoon thunderclouds.\n\n## The Unspoiled Wilderness of the Balkans\n\nUnlike western European alpine corridors crowded with mechanized ski resorts and cable cars, Durmitor remains wild, silent, and humbling. Drinking ice-cold water directly from alpine springs while watching golden eagles soar above the canyons is an unforgettable reminder of the raw majesty of our planet.`,
    category: "Travel Places",
    readTimeMinutes: 6,
  },
  {
    title: "Independent Publishing in the Algorithm Age: Print Journals as Cultural Artifacts",
    excerpt: "Why discerning readers and collectors are turning away from infinite feeds to embrace heavyweight, quarterly print publications.",
    content: `Every day, the digital internet publishes petabytes of disposable content designed to capture three seconds of scrolling attention before vanishing into social feeds. In response, a renaissance of boutique independent print magazines is flourishing worldwide.\n\nBound with thread stitching, printed on 140gsm uncoated FSC paper, and published without banner advertisements, these journals are designed to be collected and treasured on bookshelves for decades.\n\n## The Physicality of the Page\n\nThe tactile friction of turning a heavy paper page, the smell of vegetable inks, and the intentional pacing of large-format typography engage the senses in ways screen pixels cannot replicate.\n\nFor creators and readers alike, independent print represents an act of cultural rebellion—a deliberate commitment to depth, editorial courage, and human permanence.`,
    category: "Business, Money & Entrepreneurship",
    readTimeMinutes: 5,
  },
  {
    title: "The Tea Valleys of Shizuoka: Fog, Spring Harvests, and the Art of Sencha",
    excerpt: "Following generational growers along the volcanic slopes of Mount Fuji, where morning river mist shields young green tea leaves from harsh sunlight.",
    content: `In the rolling hills between the Oi River and Suruga Bay, morning fog hangs thick between terraced green tea bushes. Shizuoka has been the heart of Japanese green tea cultivation since Buddhist monks brought tea seeds from China in the thirteenth century.\n\nDuring the first spring harvest (shincha), growers harvest only the tender top shoots. These are immediately steam-treated within hours of plucking to halt oxidation, preserving bright emerald color, fresh chlorophyll, and high concentrations of relaxing L-theanine.\n\n## The Ceremony of Infusion\n\nBrewing exceptional sencha is an exercise in temperature control. Water heated to seventy degrees Celsius draws out gentle umami sweetness and marine vegetal notes, avoiding harsh tannins.\n\nSipping freshly brewed shincha while looking out over mist-draped volcanic slopes is a timeless lesson in mindful pacing and sensory appreciation.`,
    category: "Travel Places",
    readTimeMinutes: 5,
  },
  {
    title: "Raw Earth Construction: Monolithic Rammed Clay in Mediterranean Ateliers",
    excerpt: "How European architects are utilizing compressed unbaked subsoil to build sustainable, fireproof structures with zero carbon footprints.",
    content: `Rammed earth is one of civilization's most ancient construction techniques, found in sections of the Great Wall of China and medieval Alhambra palace walls. Today, architectural innovators across southern Europe are championing raw earth as the future of ecological construction.\n\nBy compressing local clay, gravel, and sand in wooden formwork with pneumatic tamping, builders erect monolithic walls that require no firing, no chemical additives, and produce zero carbon emissions.\n\n## Natural Moisture and Thermal Regulation\n\nRammed earth walls breathe naturally, absorbing excess indoor humidity during damp weather and releasing it during dry periods to maintain fifty percent relative humidity year-round.\n\nThe stratified sedimentary layers visible on the wall surface resemble natural geological canyon walls—a stunning reminder that sustainable architecture can also be deeply poetic.`,
    category: "Lifestyle & Modern Living",
    readTimeMinutes: 5,
  },
  {
    title: "Bespoke Leather and Hand Stitching: The Generational Workshops of Florence",
    excerpt: "Inside the hidden stone courtyards of the Oltrarno district, where Florentine artisans saddle-stitch vegetable-tanned leather with beeswaxed linen thread.",
    content: `Across the Ponte Vecchio in Florence's Oltrarno neighborhood, small stone bottegas hum with the steady cadence of wooden mallets and bone folders. Here, leather craft remains a family tradition passed down through four generations.\n\nArtisans work exclusively with Tuscan vegetable-tanned cowhide, conditioned in wooden drums with natural chestnut and mimosa bark tannins. This process takes forty days, yielding leather with a supple temper and unmistakable rich earthy aroma.\n\n## The Strength of the Saddle Stitch\n\nUnlike industrial sewing machines that use lockstitches that unravel if a single thread breaks, Florentine masters hand-sew with two needles on a single piece of waxed linen thread (the saddle stitch). If one thread ever wears down, the opposing loop holds the seam intact for decades.\n\nWith years of daily use, vegetable-tanned leather absorbs natural skin oils and sunlight, developing a rich caramel patina that tells the story of its owner's journey through life.`,
    category: "Fashion & Culture",
    readTimeMinutes: 5,
  },
  {
    title: "Calm Software: Why the Next Era of Tools Prioritizes Focus Over Engagement",
    excerpt: "A new wave of software architects is rejecting dopamine-driven engagement loops to build serene, purpose-driven desktop utilities.",
    content: `For a decade, software venture metrics were dominated by Daily Active Users (DAU), notification open rates, and session duration. Applications were intentionally engineered with variable rewards and red notification badges to hijack human attention.\n\nA growing counter-revolution of independent software engineers is pioneering 'calm software.' These tools operate under a radically different premise: open the application, accomplish your creative goal with zero friction, and close it so you can return to your life.\n\n## Respecting Human Cognitive Bandwidth\n\nCalm software eliminates invasive telemetry, gamified streaks, and artificial urgency. Interfaces are quiet, typography is legible and crisp, and keyboard shortcuts allow fluid interaction without cognitive strain.\n\nBy treating the user's focus with reverence, these tools foster genuine creative output and long-term customer loyalty. The future of technology belongs to tools that amplify human capability rather than exploiting human vulnerability.`,
    category: "Business, Money & Entrepreneurship",
    readTimeMinutes: 5,
  },
];

// In-memory fallback registry for the current day to ensure today's stories are immediately available
let inMemoryDailyPosts: Post[] = [];
let lastGeneratedDateUtc: string | null = null;
let ongoingGenerationPromise: Promise<DailyGenerationResult> | null = null;

export interface DailyGenerationResult {
  success: boolean;
  timestamp: string;
  source: string;
  insertedCount: number;
  insertedSlugs: string[];
  skippedCount: number;
  message: string;
  error?: string;
}

export function getInMemoryDailyPosts(): Post[] {
  const todayUtc = new Date().toISOString().slice(0, 10);
  if (lastGeneratedDateUtc === todayUtc) {
    return inMemoryDailyPosts;
  }
  return [];
}

export function getInMemoryDailyPostBySlug(slug: string): Post | undefined {
  const posts = getInMemoryDailyPosts();
  return posts.find((p) => p.slug === slug);
}

/**
 * Generate 2-3 brand-new editorial stories directly into the Supabase posts table:
 * - Query recent 15 rows from posts to exclude recent authors and cover images
 * - Query all rows to exclude existing titles and slugs
 * - Assign unique authors from the 24-author pool and unique images from the 20-image pool
 * - NEVER attach the signed-in user's user_id or name
 */
export async function generateDailyStories(options?: {
  force?: boolean;
}): Promise<DailyGenerationResult> {
  const todayUtc = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  // If already generated today and not forced, return cached result
  if (!options?.force && lastGeneratedDateUtc === todayUtc && inMemoryDailyPosts.length > 0) {
    return {
      success: true,
      timestamp: nowIso,
      source: "cached-today",
      insertedCount: inMemoryDailyPosts.length,
      insertedSlugs: inMemoryDailyPosts.map((p) => p.slug),
      skippedCount: 0,
      message: `Daily stories for ${todayUtc} already generated.`,
    };
  }

  if (ongoingGenerationPromise) {
    return ongoingGenerationPromise;
  }

  ongoingGenerationPromise = (async () => {
    try {
      const supabase = getSupabaseAdminOrPublicClient();

      // Sets for exclusion
      const existingTitles = new Set<string>();
      const existingSlugs = new Set<string>();
      const recentCoverImages = new Set<string>();
      const recentAuthorNames = new Set<string>();

      if (supabase) {
        try {
          // 1. Query latest 15 rows to exclude recent authors and cover images
          const { data: recentRows } = await supabase
            .from("posts")
            .select("title, slug, cover_image_url, content, created_at")
            .order("created_at", { ascending: false })
            .limit(15);

          if (recentRows && Array.isArray(recentRows)) {
            for (const row of recentRows) {
              if (row.cover_image_url) {
                recentCoverImages.add(row.cover_image_url.trim());
              }
              if (row.content) {
                const author = extractAuthorFromContent(row.content);
                if (author?.name) {
                  recentAuthorNames.add(author.name.toLowerCase().trim());
                }
              }
              // Also map deterministic author fallback for legacy rows
              const fallbackAuthor = getEditorialAuthorForStory(row.slug || row.title || "");
              if (fallbackAuthor?.name) {
                recentAuthorNames.add(fallbackAuthor.name.toLowerCase().trim());
              }
            }
          }

          // 2. Query all existing titles and slugs to prevent duplicates
          const { data: allExisting } = await supabase
            .from("posts")
            .select("title, slug");

          if (allExisting && Array.isArray(allExisting)) {
            for (const row of allExisting) {
              if (row.title) existingTitles.add(row.title.toLowerCase().trim());
              if (row.slug) existingSlugs.add(row.slug.toLowerCase().trim());
            }
          }
        } catch (queryErr) {
          console.warn("Could not query existing posts for exclusion:", queryErr);
        }
      }

      // Filter available candidates from CURATED_EDITORIAL_POOL
      let candidateStories = CURATED_EDITORIAL_POOL.filter((item) => {
        const normTitle = item.title.toLowerCase().trim();
        const normSlug = slugify(item.title).toLowerCase().trim();
        return !existingTitles.has(normTitle) && !existingSlugs.has(normSlug);
      });

      // If all curated stories have been published, allow date-suffixed versions
      if (candidateStories.length < 3) {
        candidateStories = CURATED_EDITORIAL_POOL.map((item) => ({
          ...item,
          title: `${item.title}`,
        }));
      }

      // Filter available authors from EDITORIAL_AUTHORS (excluding last 10-15 used authors)
      let availableAuthors = EDITORIAL_AUTHORS.filter(
        (a) => !recentAuthorNames.has(a.name.toLowerCase().trim())
      );
      if (availableAuthors.length < 3) {
        availableAuthors = [...EDITORIAL_AUTHORS];
      }

      // Filter available images from UNSPLASH_IMAGE_POOL (excluding last 10-15 used images)
      let availableImages = UNSPLASH_IMAGE_POOL.filter(
        (img) => !recentCoverImages.has(img.trim())
      );
      if (availableImages.length < 3) {
        availableImages = [...UNSPLASH_IMAGE_POOL];
      }

      // Deterministically select 3 stories across distinct categories
      const selectedStories: EditorialStoryItem[] = [];
      const usedCategories = new Set<string>();

      for (const story of candidateStories) {
        if (!usedCategories.has(story.category)) {
          selectedStories.push(story);
          usedCategories.add(story.category);
        }
        if (selectedStories.length >= 3) break;
      }

      // Fallback if distinct categories were exhausted
      if (selectedStories.length < 3) {
        for (const story of candidateStories) {
          if (!selectedStories.includes(story)) {
            selectedStories.push(story);
          }
          if (selectedStories.length >= 3) break;
        }
      }

      const insertedSlugs: string[] = [];
      const skippedSlugs: string[] = [];
      const newlyCreatedPosts: Post[] = [];

      for (let i = 0; i < selectedStories.length; i++) {
        const story = selectedStories[i];
        let targetSlug = slugify(story.title);

        // Check if slug collides and append date if needed
        if (existingSlugs.has(targetSlug)) {
          const dateStamp = todayUtc.replace(/-/g, "").slice(2);
          targetSlug = `${targetSlug}-${dateStamp}`;
          if (existingSlugs.has(targetSlug)) {
            skippedSlugs.push(targetSlug);
            continue;
          }
        }

        // Pick distinct author from available authors
        const assignedAuthor = availableAuthors[i % availableAuthors.length];
        // Pick distinct image from available images
        const assignedImage = availableImages[i % availableImages.length];

        const formattedDate = new Date(nowIso).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        // Embed author signature into content so formatSupabasePost can reconstruct author perfectly
        const authorSignature = `<!-- author: ${assignedAuthor.name} | ${assignedAuthor.role} | ${assignedAuthor.avatar} -->\n\n`;
        const contentWithSignature = authorSignature + cleanEditorialContent(story.content);

        const postModel: Post = {
          id: `daily-${targetSlug}-${Date.now()}`,
          slug: targetSlug,
          title: story.title.trim(),
          excerpt: story.excerpt.trim(),
          content: cleanEditorialContent(story.content)
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean),
          category: story.category,
          coverImage: assignedImage,
          publishedAt: formattedDate,
          readTime: `${story.readTimeMinutes} min read`,
          author: {
            name: assignedAuthor.name,
            role: assignedAuthor.role,
            avatar: assignedAuthor.avatar,
          },
          featured: i === 0,
        };

        // Insert into Supabase posts table
        // CRITICAL RULE: author_id is explicitly null (NEVER attached to signed-in user)
        if (supabase) {
          const payload: Record<string, any> = {
            title: story.title.trim(),
            slug: targetSlug,
            excerpt: story.excerpt.trim(),
            content: contentWithSignature,
            category: story.category,
            cover_image_url: assignedImage,
            read_time_minutes: story.readTimeMinutes,
            published: true,
            author_id: null, // NEVER attach signed-in user's user_id or name
            published_at: nowIso,
            created_at: nowIso,
            updated_at: nowIso,
          };

          // Try inserting with published_at
          let { error: insertError } = await supabase.from("posts").insert(payload);

          // If published_at column does not exist in schema (error 42703), retry without it
          if (insertError && (insertError.code === "42703" || insertError.message?.includes("published_at"))) {
            const { published_at: _, ...payloadWithoutPubAt } = payload;
            const retryRes = await supabase.from("posts").insert(payloadWithoutPubAt);
            insertError = retryRes.error;
          }

          if (insertError) {
            console.warn(`Supabase insert for story "${story.title}":`, insertError.message);
          } else {
            insertedSlugs.push(targetSlug);
            existingSlugs.add(targetSlug);
            existingTitles.add(story.title.toLowerCase().trim());
          }
        }

        newlyCreatedPosts.push(postModel);
      }

      // Update in-memory fallback registry
      inMemoryDailyPosts = newlyCreatedPosts;
      lastGeneratedDateUtc = todayUtc;

      return {
        success: true,
        timestamp: nowIso,
        source: "editorial-dispatch",
        insertedCount: insertedSlugs.length || newlyCreatedPosts.length,
        insertedSlugs: insertedSlugs.length > 0 ? insertedSlugs : newlyCreatedPosts.map((p) => p.slug),
        skippedCount: skippedSlugs.length,
        message: `Daily story sync complete for ${todayUtc}. Generated ${newlyCreatedPosts.length} stories (${insertedSlugs.length} inserted to database).`,
      };
    } catch (error) {
      console.error("Error in generateDailyStories:", error);
      return {
        success: false,
        timestamp: nowIso,
        source: "error",
        insertedCount: 0,
        insertedSlugs: [],
        skippedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to generate daily stories.",
      };
    } finally {
      ongoingGenerationPromise = null;
    }
  })();

  return ongoingGenerationPromise;
}

/**
 * Lightweight fallback check for page loads (e.g. app/page.tsx and app/articles/page.tsx):
 * Checks if the newest post in Supabase posts is from today's UTC date.
 * If not, triggers generateDailyStories once so a new day always produces fresh stories.
 */
let lastCheckDateUtc: string | null = null;
let fallbackCheckPromise: Promise<void> | null = null;

export async function ensureDailyStoriesForToday(): Promise<void> {
  const todayUtc = new Date().toISOString().slice(0, 10);

  // Skip if we already performed the daily check for today's UTC date
  if (lastCheckDateUtc === todayUtc) {
    return;
  }

  if (fallbackCheckPromise) {
    return fallbackCheckPromise;
  }

  fallbackCheckPromise = (async () => {
    try {
      const supabase = getSupabaseAdminOrPublicClient();
      if (!supabase) {
        await generateDailyStories();
        lastCheckDateUtc = todayUtc;
        return;
      }

      let newestDateStr: string | null = null;
      let rows: Array<{ published_at?: string; created_at?: string }> | null = null;

      // Check newest post by published_at or created_at
      const initialRes = await supabase
        .from("posts")
        .select("published_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(1);

      if (initialRes.error) {
        const fallbackRes = await supabase
          .from("posts")
          .select("created_at")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(1);
        rows = fallbackRes.data as Array<{ published_at?: string; created_at?: string }> | null;
      } else {
        rows = initialRes.data as Array<{ published_at?: string; created_at?: string }> | null;
      }

      if (rows && rows.length > 0) {
        const row = rows[0];
        const rawDate = row.published_at || row.created_at;
        if (rawDate) {
          newestDateStr = new Date(rawDate).toISOString().slice(0, 10);
        }
      }

      // If no post exists or the newest post is not from today's UTC date, generate today's stories!
      if (!newestDateStr || newestDateStr !== todayUtc) {
        await generateDailyStories();
      }

      lastCheckDateUtc = todayUtc;
    } catch (err) {
      console.warn("Fallback check ensureDailyStoriesForToday encountered an error:", err);
    } finally {
      fallbackCheckPromise = null;
    }
  })();

  return fallbackCheckPromise;
}
