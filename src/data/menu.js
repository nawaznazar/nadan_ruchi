export const CATEGORIES = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner']

// Comprehensive Kerala & Malayali traditional specials from all regions
export const MENU = [
  // ========== BREAKFAST ==========
  { id: 'puttu-kadala', name: 'Puttu & Kadala Curry', category: 'Breakfast', veg: true, spicy: 1, price: 8.00, img: '/img/puttu.jpg', desc: 'Steamed rice flour cylinders with black chickpea curry. A classic.' },
  { id: 'appam-stew', name: 'Appam & Ishtu (Veg/Chicken)', category: 'Breakfast', veg: false, spicy: 0, price: 12.00, img: '/img/appam-stew.jpg', desc: 'Lace hoppers with a mild, creamy coconut stew. (Specify veg or chicken)' },
  { id: 'idiyappam-egg', name: 'Idiyappam & Egg Curry', category: 'Breakfast', veg: false, spicy: 1, price: 9.00, img: '/img/idiyappam-egg.jpg', desc: 'String hoppers served with a rich, spicy egg curry.' },
  { id: 'malabar-parotta-beef', name: 'Malabar Parotta & Beef Ularthiyathu', category: 'Breakfast', veg: false, spicy: 2, price: 11.00, img: '/img/parotta-beef.jpg', desc: 'Flaky, layered parotta with dry roasted beef fry. A Malabar staple.' },
  { id: 'palappam-paya', name: 'Palappam & Mutton Paya', category: 'Breakfast', veg: false, spicy: 2, price: 13.00, img: '/img/palappam-paya.jpg', desc: 'Soft appam with a rich, slow-cooked trotters soup.' },
  { id: 'dosa-kerala-sambar', name: 'Ghee Roast Dosa & Kerala Sambar', category: 'Breakfast', veg: true, spicy: 1, price: 10.00, img: '/img/dosa-sambar.jpg', desc: 'Crispy dosa with ghee, served with tangy sambar and chutney.' },
  { id: 'kadala-curry-bhatura', name: 'Kadala Curry & Bhatura', category: 'Breakfast', veg: true, spicy: 1, price: 9.50, img: '/img/kadala-bhatura.jpg', desc: 'Fluffy bhatura with spicy black chickpea curry, a popular combo.' },
  { id: 'kumbil-appam', name: 'Kumbil Appam', category: 'Breakfast', veg: true, spicy: 0, price: 7.00, img: '/img/kumbil-appam.jpg', desc: 'Sweet dumplings made with rice flour, jaggery, and coconut, steamed in bay leaves.' },
  { id: 'ariya-patha', name: 'Ariya Patha & Sweetened Milk', category: 'Breakfast', veg: true, spicy: 0, price: 6.50, img: '/img/ariya-patha.jpg', desc: 'Rice flakes with coconut, often served with banana and sweetened milk.' },
  { id: 'kerala-style-upma', name: 'Kerala Style Upma', category: 'Breakfast', veg: true, spicy: 1, price: 7.50, img: '/img/upma.jpg', desc: 'Semolina cooked with mustard seeds, curry leaves, and vegetables.' },

  // ========== LUNCH ==========
  { id: 'kerala-sadya', name: 'Kerala Sadya (Onam Special)', category: 'Lunch', veg: true, spicy: 1, price: 25.00, img: '/img/sadya.jpg', desc: 'The grand feast: rice, sambar, rasam, avial, thoran, pulissery, pickles, pappadam, and payasam.' },
  { id: 'meen-curry-rice', name: 'Kottayam Meen Curry & Red Rice', category: 'Lunch', veg: false, spicy: 2, price: 16.00, img: '/img/meen-curry-rice.jpg', desc: 'Spicy, tangy fish curry with kokum, best with Kerala red rice.' },
  { id: 'malabar-biriyani', name: 'Thalassery Chicken Biryani', category: 'Lunch', veg: false, spicy: 1, price: 22.00, img: '/img/malabar-biriyani.jpg', desc: 'Famous Malabar biryani with soft chicken chunks, fried onions, and mild spices.' },
  { id: 'karimeen-pollichathu', name: 'Karimeen Pollichathu (Alleppey Style)', category: 'Lunch', veg: false, spicy: 2, price: 24.00, img: '/img/karimeen-pollichathu.jpg', desc: 'Pearl spot fish marinated in spices, wrapped in banana leaf, and grilled.' },
  { id: 'avial', name: 'Avial (Combo Side)', category: 'Lunch', veg: true, spicy: 0, price: 9.00, img: '/img/avial.jpg', desc: 'Mixed vegetables in a coconut-yogurt gravy. A must-have with sadya.' },
  { id: 'chemeen-moilee', name: 'Chemmeen Moilee (Cochin Style)', category: 'Lunch', veg: false, spicy: 1, price: 20.00, img: '/img/chemeen-moilee.jpg', desc: 'Prawns cooked in a mild, fragrant coconut milk gravy with curry leaves.' },
  { id: 'mutton-chapati', name: 'Travancore Mutton Curry & Chapati', category: 'Lunch', veg: false, spicy: 2, price: 18.00, img: '/img/mutton-chapati.jpg', desc: 'Spicy and flavorful mutton curry from South Kerala, perfect with chapatis.' },
  { id: 'erachi-varutharacha-curry', name: 'Erachi Varutharacha Curry (Beef)', category: 'Lunch', veg: false, spicy: 2, price: 19.00, img: '/img/erachi-varutharacha.jpg', desc: 'Beef cooked in a thick, roasted coconut gravy. A Syrian Christian specialty.' },
  { id: 'kappa-vevichathu', name: 'Kappa Vevichathu & Meen Curry', category: 'Lunch', veg: false, spicy: 2, price: 17.00, img: '/img/kappa-meen.jpg', desc: 'Mashed tapioca with a spicy fish curry. A beloved combo from Central Kerala.' },
  { id: 'vegetable-biriyani', name: 'Malabar Vegetable Dum Biryani', category: 'Lunch', veg: true, spicy: 1, price: 16.00, img: '/img/veg-biriyani.jpg', desc: 'Fragrant basmati rice cooked with mixed vegetables and spices in the dum style.' },
  { id: 'nadan-kozhi-curry', name: 'Nadan Kozhi Curry (Country Chicken)', category: 'Lunch', veg: false, spicy: 2, price: 21.00, img: '/img/nadan-kozhi-curry.jpg', desc: 'Free-range chicken cooked in a traditional, spicy gravy with coconut.' },
  { id: 'pappadavada-kerala-sambar', name: 'Pappadavada & Kerala Sambar', category: 'Lunch', veg: true, spicy: 1, price: 14.00, img: '/img/pappadavada-sambar.jpg', desc: 'Crispy rice wafers served with a tangy and spicy sambar.' },

  // ========== EVENING SNACKS ==========
  { id: 'pazham-pori', name: 'Pazham Pori & Chaya', category: 'Evening Snacks', veg: true, spicy: 0, price: 6.00, img: '/img/pazham-pori.jpg', desc: 'Crispy fried banana fritters, the ultimate Kerala tea-time snack.' },
  { id: 'beef-puff', name: 'Erachi (Beef) Puff', category: 'Evening Snacks', veg: false, spicy: 1, price: 7.00, img: '/img/beef-puff.jpg', desc: 'Flaky, buttery pastry puff stuffed with spicy beef filling.' },
  { id: 'kappa-vevichathu-snack', name: 'Kappa Vevichathu & Meen Curry (Snack)', category: 'Evening Snacks', veg: false, spicy: 2, price: 15.00, img: '/img/kappa-meen-snack.jpg', desc: 'Mashed tapioca with a spicy fish curry. A beloved combo.' },
  { id: 'unniyappam', name: 'Unniyappam', category: 'Evening Snacks', veg: true, spicy: 0, price: 6.50, img: '/img/unniyappam.jpg', desc: 'Sweet, deep-fried rice and banana dumplings with jaggery.' },
  { id: 'kozhi-porichathu', name: 'Kozhi Porichathu (Chicken Fry)', category: 'Evening Snacks', veg: false, spicy: 2, price: 11.00, img: '/img/kozhi-porichathu.jpg', desc: 'Crispy and succulent spicy fried chicken pieces.' },
  { id: 'vada-sambar', name: 'Uzhunnu Vada & Sambar', category: 'Evening Snacks', veg: true, spicy: 1, price: 8.00, img: '/img/vada-sambar.jpg', desc: 'Savory lentil donuts dunked in hot and tangy sambar.' },
  { id: 'neyyappam', name: 'Neyyappam', category: 'Evening Snacks', veg: true, spicy: 0, price: 7.00, img: '/img/neyyappam.jpg', desc: 'Sweet, deep-fried appam made with rice flour, jaggery, and ghee.' },
  { id: 'mutta-mala', name: 'Mutta Mala & Paal Payasam', category: 'Evening Snacks', veg: true, spicy: 0, price: 9.00, img: '/img/mutta-mala.jpg', desc: 'Sweet "egg garlands" served with reduced milk pudding. A festive treat.' },
  { id: 'chatti-pathiri', name: 'Chatti Pathiri (Sweet)', category: 'Evening Snacks', veg: true, spicy: 0, price: 10.00, img: '/img/chatti-pathiri.jpg', desc: 'A layered pastry dessert from Malabar, similar to a sweet lasagna.' },
  { id: 'bhajji', name: 'Bhajji & Chutney', category: 'Evening Snacks', veg: true, spicy: 1, price: 6.00, img: '/img/bhajji.jpg', desc: 'Assorted vegetable fritters served with coconut chutney.' },

  // ========== DINNER ==========
  { id: 'kerala-porotta-beef', name: 'Kerala Porotta & Beef Ularthiyathu', category: 'Dinner', veg: false, spicy: 2, price: 17.00, img: '/img/porotta-beef.jpg', desc: 'The king of Kerala dinners. Flaky parotta with dry, spicy beef fry.' },
  { id: 'kuzhimanthi-bucket', name: 'Malabar Kuzhimanthi Bucket', category: 'Dinner', veg: false, spicy: 1, price: 28.00, img: '/img/kuzhimanthi.jpg', desc: 'Dum-cooked rice and chicken with authentic Malabari spices. Serves 2.' },
  { id: 'duck-roast', name: 'Kuttanad Duck Roast & Appam', category: 'Dinner', veg: false, spicy: 2, price: 26.00, img: '/img/duck-roast.jpg', desc: 'Duck cooked in a rich, roasted masala gravy, best with appam.' },
  { id: 'veg-thali', name: 'North Kerala Veg Thali', category: 'Dinner', veg: true, spicy: 1, price: 16.00, img: '/img/veg-thali.jpg', desc: 'Rice, chapati, seasonal thoran, sambar, dal, pachadi, and pickle.' },
  { id: 'kadala-varattiyathu', name: 'Kadala Varattiyathu & Porotta', category: 'Dinner', veg: true, spicy: 2, price: 14.00, img: '/img/kadala-varattiyathu.jpg', desc: 'Black chickpeas stir-fried in a spicy masala, a great veg alternative.' },
  { id: 'kerala-fish-molly', name: 'Kerala Fish Molly & Appam', category: 'Dinner', veg: false, spicy: 0, price: 19.00, img: '/img/fish-molly.jpg', desc: 'Mild, creamy fish curry with coconut milk, perfect with appam.' },
  { id: 'kothu-porotta', name: 'Kothu Porotta (Chicken/Beef)', category: 'Dinner', veg: false, spicy: 2, price: 15.00, img: '/img/kothu-porotta.jpg', desc: 'Chopped parotta stir-fried with meat, eggs, and spices on a hot griddle.' },
  { id: 'nadan-kozhi-biriyani', name: 'Nadan Kozhi Biryani (Country Chicken)', category: 'Dinner', veg: false, spicy: 2, price: 23.00, img: '/img/nadan-kozhi-biryani.jpg', desc: 'Biryani made with flavorful country chicken for a richer taste.' },
  { id: 'kerala-style-fried-rice', name: 'Kerala Style Fried Rice & Manjurian', category: 'Dinner', veg: true, spicy: 1, price: 13.00, img: '/img/kerala-fried-rice.jpg', desc: 'Indo-Chinese influence: spicy fried rice with vegetable manchurian.' },
  { id: 'meen-vevichathu', name: 'Meen Vevichathu (Fish Curry) & Rice', category: 'Dinner', veg: false, spicy: 3, price: 18.00, img: '/img/meen-vevichathu.jpg', desc: 'Extremely spicy and tangy traditional fish curry, a true Kerala experience.' },
  { id: 'kerala-chicken-roast', name: 'Kerala Chicken Roast & Malabar Parotta', category: 'Dinner', veg: false, spicy: 2, price: 20.00, img: '/img/kerala-chicken-roast.jpg', desc: 'Succulent chicken pieces roasted in a masala with caramelized onions.' },
  { id: 'kalan', name: 'Kalan (Combo Side)', category: 'Dinner', veg: true, spicy: 0, price: 8.00, img: '/img/kalan.jpg', desc: 'A thick yogurt-based curry with yam and plantains, from the Sadya.' },
]

// Fallback images note: provide your own images in /public/img with matching names.