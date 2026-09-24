// The photographed August 2026 content plan is a draft, not owner approval.
// Facts with a review status remain visible only in this local, noindex build.
export const business = {
  name: 'Shelly’s Indigenous Bistro',
  shortName: 'Shelly’s',
  location: 'Winnipeg, Manitoba',
  address: '1364 Main Street, Winnipeg, MB',
  addressStatus: 'Review against owner-approved current location',
  phoneDisplay: '(431) 441-0887',
  phoneHref: 'tel:+14314410887',
  phoneStatus: 'Published on current site and printed menu; confirm against conflicting logo',
  currentMenuUrl: 'https://www.skipthedishes.com/shellys-indigenous-bistro',
  cateringRequestUrl: 'https://shellys-catering-menu.vercel.app/',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=1364+Main+Street+Winnipeg+MB'
};

export const menuHighlights = [
  {
    name: 'Three Sisters Soup',
    category: 'A Shelly’s staple',
    description: 'A warm, nourishing soup made with corn, beans and squash—the Three Sisters—served as a comforting Shelly’s staple. Pair it with fresh bannock or fry bread.',
    photoKey: 'threeSistersSoup',
    source: 'Website Content Plan, pages 3, 9 and 11',
    status: 'Draft wording; recipe and cultural story need kitchen and owner approval'
  },
  {
    name: 'Fresh Bannock',
    category: 'Fresh from the kitchen',
    description: 'Prepared fresh and ready to enjoy alongside a hearty meal or with one of Shelly’s sweet or savoury toppings.',
    photoKey: 'freshBannock',
    source: 'Website Content Plan, pages 4 and 10; existing catering catalogue',
    status: 'Draft wording; current availability needs confirmation'
  },
  {
    name: 'Bannock Taco',
    category: 'A familiar favourite',
    description: 'Fresh, golden bannock layered with seasoned beef, lettuce, tomatoes, cheese, salsa, sour cream and green onions.',
    photoKey: 'bannockTaco',
    source: 'Website Content Plan, pages 4 and 9; current public catalogue',
    status: 'Draft wording; ingredients and availability need confirmation'
  },
  {
    name: 'Bannock Burger',
    category: 'Comfort food',
    description: 'A juicy burger served on fresh bannock with classic toppings—the comfort of a neighbourhood burger, made the Shelly’s way.',
    photoKey: 'bannockBurger',
    source: 'Website Content Plan, pages 4 and 10; current public catalogue',
    status: 'Draft wording; current preparation and availability need confirmation'
  }
];

export const navigation = [
  { path: '/', label: 'Home' },
  { path: '/menu/', label: 'Food highlights' },
  { path: '/catering/', label: 'Catering' },
  { path: '/our-story/', label: 'Our story' },
  { path: '/indigenous-ownership/', label: 'Indigenous ownership' },
  { path: '/community/', label: 'Community' },
  { path: '/stories/', label: 'Stories' },
  { path: '/contact/', label: 'Visit & contact' }
];

export const headerNavigation = [
  { path: '/our-story/', label: 'Our story' },
  { path: '/menu/', label: 'Our food' },
  { path: '/community/', label: 'Community' },
  { path: '/contact/', label: 'Visit' },
  { href: business.currentMenuUrl, label: 'Menu on Skip' }
];

export const communityThemes = [
  { eyebrow: 'In times of need', title: 'Feeding people', description: 'Lunch bags for evacuees, donated food, emergency meal support and partnerships that keep good food from going to waste.', photoKey: 'communityFeeding' },
  { eyebrow: 'Indigenous voices', title: 'Supporting stories', description: 'Food, catering or sponsorship for cultural, educational, youth, film and storytelling initiatives.', photoKey: 'communityVoices' },
  { eyebrow: 'Around the table', title: 'Community gatherings', description: 'Feasts, student gatherings, conferences, celebrations and local events where sharing food brings people together.', photoKey: 'communityEvents' },
  { eyebrow: 'The next generation', title: 'Employment and opportunity', description: 'Hiring partnerships, training and opportunities to gain experience in hospitality and catering.', photoKey: 'communityOpportunity' }
];

export const communityExamples = [
  { eyebrow: 'Food in difficult moments', title: 'Meals in difficult moments', description: 'Lunch-bag programs for evacuees and other emergency meal support.', photoKey: 'exampleMeals' },
  { eyebrow: 'Local partnerships', title: 'Less food wasted', description: 'Good food can go further when local organizations work together to share it with neighbours.', photoKey: 'exampleFoodWaste' },
  { eyebrow: 'Indigenous storytelling', title: 'Indigenous storytelling', description: 'Food brings people together to listen, share stories and celebrate Indigenous creative voices.', photoKey: 'exampleStorytelling' },
  { eyebrow: 'Food for learning', title: 'Food for learning and gathering', description: 'Bannock and a welcoming meal can make gatherings and learning events feel more connected.', photoKey: 'exampleLearning' }
];

// Owner-provided thresholds, not a count of unique people. Keep the two measures
// separate: donated meals may already be included in the number of people fed.
export const impactFigures = {
  peopleFedAnnualFloor: 1_200_000,
  donatedMealsMonthlyFloor: 10_000
};

// Add only owner-approved originals. Set src and a photo-specific alt description
// together; the layout renders a labelled placeholder until both are supplied.
export const photoSlots = {
  homeFood: { title: 'A Shelly’s shared table', brief: 'Three Sisters Soup with bannock and other Shelly’s favourites.', file: 'home-food.webp', shape: 'wide', src: null, alt: null },
  threeSistersSoup: { title: 'Three Sisters Soup', brief: 'A warm bowl of soup served with fresh bannock.', file: 'three-sisters-soup.webp', shape: 'landscape', src: null, alt: null },
  freshBannock: { title: 'Fresh bannock & fry bread', brief: 'Fresh bannock from the kitchen or ready to share.', file: 'fresh-bannock.webp', shape: 'landscape', src: null, alt: null },
  bannockTaco: { title: 'Bannock taco', brief: 'A Shelly’s bannock taco, ready to enjoy.', file: 'bannock-taco.webp', shape: 'landscape', src: null, alt: null },
  bannockBurger: { title: 'Bannock burger', brief: 'A Shelly’s burger on fresh bannock.', file: 'bannock-burger.webp', shape: 'landscape', src: null, alt: null },
  vincePortrait: { title: 'Vince Bignell', brief: 'Owner Vince at Shelly’s.', file: 'vince-portrait.webp', shape: 'portrait', src: null, alt: null },
  shellyPortrait: { title: 'Shelly Kanfer', brief: 'Remembering the Shelly behind our name.', file: 'shelly-portrait.webp', shape: 'portrait', src: null, alt: null },
  cateringSpread: { title: 'Catering at a gathering', brief: 'Shelly’s food prepared for a gathering.', file: 'catering-spread.webp', shape: 'wide', src: null, alt: null },
  communityGathering: { title: 'Shelly’s in community', brief: 'Sharing food around a community table.', file: 'community-gathering.webp', shape: 'wide', src: null, alt: null },
  communityFeeding: { title: 'Feeding people', brief: 'Meals made to be shared.', file: 'community-feeding.webp', shape: 'landscape', src: null, alt: null },
  communityVoices: { title: 'Supporting stories', brief: 'Food and conversation at a community event.', file: 'community-voices.webp', shape: 'landscape', src: null, alt: null },
  communityEvents: { title: 'Community gatherings', brief: 'People gathered around Shelly’s food.', file: 'community-events.webp', shape: 'landscape', src: null, alt: null },
  communityOpportunity: { title: 'Employment and opportunity', brief: 'Shelly’s team working together.', file: 'community-opportunity.webp', shape: 'landscape', src: null, alt: null },
  exampleMeals: { title: 'Meals in difficult moments', brief: 'Meals ready to bring comfort and care.', file: 'example-meals.webp', shape: 'landscape', src: null, alt: null },
  exampleFoodWaste: { title: 'Less food wasted', brief: 'Good food ready to go further.', file: 'example-food-waste.webp', shape: 'landscape', src: null, alt: null },
  exampleStorytelling: { title: 'Indigenous storytelling', brief: 'A gathering where stories are shared.', file: 'example-storytelling.webp', shape: 'landscape', src: null, alt: null },
  exampleLearning: { title: 'Food for learning and gathering', brief: 'Bannock shared at a gathering.', file: 'example-learning.webp', shape: 'landscape', src: null, alt: null },
  teamAtWork: { title: 'The Shelly’s team', brief: 'The team preparing food together.', file: 'team-at-work.webp', shape: 'landscape', src: null, alt: null },
  bistroExterior: { title: 'Find Shelly’s', brief: 'The bistro from the street.', file: 'bistro-exterior.webp', shape: 'landscape', src: null, alt: null }
};
