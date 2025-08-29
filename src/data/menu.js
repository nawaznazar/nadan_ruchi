export const CATEGORIES = ['Breakfast','Lunch','Evening Snacks','Dinner']

// Kerala & Malayali traditional specials
export const MENU = [
  // Breakfast
  { id:'puttu-kadala', name:'Puttu & Kadala Curry', category:'Breakfast', veg:true, spicy:1, price:8.00, img:'/img/puttu.jpg', desc:'Steamed rice flour cylinders with black chickpea curry.' },
  { id:'appam-stew', name:'Appam & Veg Stew', category:'Breakfast', veg:true, spicy:0, price:10.00, img:'/img/appam.jpg', desc:'Lace hoppers with coconut vegetable stew.' },
  { id:'idiyappam-egg-curry', name:'Idiyappam & Egg Curry', category:'Breakfast', veg:false, spicy:1, price:9.00, img:'/img/idiyappam.jpg', desc:'String hoppers served with rich egg curry.' },
  // Lunch
  { id:'kerala-meals', name:'Kerala Meals (Veg)', category:'Lunch', veg:true, spicy:1, price:14.00, img:'/img/meals.jpg', desc:'Par boiled rice, sambar, thoran, avial, pickle, pappadam.' },
  { id:'fish-curry-meals', name:'Fish Curry Meals', category:'Lunch', veg:false, spicy:2, price:18.00, img:'/img/fishcurry.jpg', desc:'Meals with Kottayam style spicy fish curry.' },
  { id:'biriyani-malabar-chicken', name:'Malabar Chicken Biryani', category:'Lunch', veg:false, spicy:1, price:20.00, img:'/img/biryani.jpg', desc:'Classic Thalassery-style biryani.' },
  // Evening Snacks
  { id:'pazham-pori', name:'Pazham Pori', category:'Evening Snacks', veg:true, spicy:0, price:5.00, img:'/img/pazham.jpg', desc:'Fried ripe banana fritters.' },
  { id:'unniyappam', name:'Unniyappam', category:'Evening Snacks', veg:true, spicy:0, price:6.00, img:'/img/unniyappam.jpg', desc:'Sweet rice-banana dumplings.' },
  { id:'erachi-puff', name:'Erachi (Beef) Puff', category:'Evening Snacks', veg:false, spicy:1, price:7.00, img:'/img/puff.jpg', desc:'Flaky pastry stuffed with spiced meat.' },
  // Dinner
  { id:'porotta-beef', name:'Kerala Porotta & Beef Curry', category:'Dinner', veg:false, spicy:2, price:16.00, img:'/img/porotta.jpg', desc:'Layered flatbread with rich beef curry.' },
  { id:'kappa-meen', name:'Kappa & Meen Curry', category:'Dinner', veg:false, spicy:2, price:17.00, img:'/img/kappa.jpg', desc:'Tapioca with fiery fish curry.' },
  { id:'vegetable-kurma-porotta', name:'Veg Kurma & Porotta', category:'Dinner', veg:true, spicy:1, price:12.00, img:'/img/kurma.jpg', desc:'Coconut-based veg kurma with porotta.' },
]

// Fallback images note: provide your own images in /public/img with matching names.
