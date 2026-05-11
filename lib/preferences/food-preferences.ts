export type FoodPreferenceGroupId =
  | "cuisines"
  | "casualMeals"
  | "proteins"
  | "lighterOptions"
  | "cafeEasy"
  | "desserts"
  | "iceCreamFlavours"
  | "snacks"
  | "nonAlcoholicDrinks"
  | "alcoholicDrinks"
  | "alcoholComfort"
  | "dietaryNeeds"
  | "avoidances";

export type FoodBeveragePreference = {
  id: string;
  label: string;
  group: FoodPreferenceGroupId;
  aliases?: string[];
  eventKeywords?: string[];
  ageSensitive?: boolean;
  icon?: string;
};

export type FoodPreferenceGroup = {
  id: FoodPreferenceGroupId;
  title: string;
  copy: string;
  defaultOpen?: boolean;
  defaultVisible?: number;
  ageSensitive?: boolean;
  icon?: string;
};

export const foodPreferenceGroups: FoodPreferenceGroup[] = [
  {
    id: "cuisines",
    title: "Favourite cuisines",
    icon: "🌏",
    copy: "Choose familiar or enjoyable cuisines for low-pressure meetup ideas.",
    defaultOpen: true,
    defaultVisible: 9,
  },
  {
    id: "casualMeals",
    title: "Casual meals",
    icon: "🍔",
    copy: "Easy, familiar foods that work well around simple local meetups.",
    defaultVisible: 8,
  },
  {
    id: "proteins",
    title: "Proteins",
    icon: "🍳",
    copy: "Helpful for food comfort, dietary matching, and event planning notes.",
    defaultVisible: 8,
  },
  {
    id: "lighterOptions",
    title: "Lighter options",
    icon: "🥗",
    copy: "Lower-pressure meals for quick chats, park meetups, and quieter days.",
    defaultVisible: 7,
  },
  {
    id: "cafeEasy",
    title: "Cafe and easy meetup foods",
    icon: "☕",
    copy: "Cafe-friendly choices that make first meetups feel simple.",
    defaultOpen: true,
    defaultVisible: 8,
  },
  {
    id: "desserts",
    title: "Desserts",
    icon: "🍰",
    copy: "Sweet options for casual plans, markets, and dessert walks.",
    defaultVisible: 8,
  },
  {
    id: "iceCreamFlavours",
    title: "Ice cream and dessert flavours",
    icon: "🍦",
    copy: "Flavours that can help suggest relaxed dessert-style meetups.",
    defaultVisible: 8,
  },
  {
    id: "snacks",
    title: "Snacks",
    icon: "🥨",
    copy: "Simple snacks for picnics, movie nights, games, or quiet catchups.",
    defaultVisible: 8,
  },
  {
    id: "nonAlcoholicDrinks",
    title: "Non-alcoholic drinks",
    icon: "🥤",
    copy: "Drinks that keep cafe, park, and daytime meetups easy.",
    defaultOpen: true,
    defaultVisible: 9,
  },
  {
    id: "alcoholicDrinks",
    title: "Alcoholic drinks",
    icon: "🍷",
    copy: "Optional and only relevant for age-appropriate events.",
    defaultVisible: 5,
    ageSensitive: true,
  },
  {
    id: "alcoholComfort",
    title: "Alcohol comfort",
    icon: "⚠️",
    copy: "Set whether alcohol-serving venues feel comfortable for you.",
    defaultVisible: 3,
    ageSensitive: true,
  },
  {
    id: "dietaryNeeds",
    title: "Dietary needs and safety",
    icon: "⚠️",
    copy: "Dietary preferences help with meetup suggestions, but users should still confirm ingredients with venues.",
    defaultOpen: true,
    defaultVisible: 10,
  },
  {
    id: "avoidances",
    title: "Dislikes and avoidances",
    icon: "🧭",
    copy: "Mark food or venue situations you would rather avoid.",
    defaultVisible: 7,
  },
];

export const foodBeveragePreferenceOptions: FoodBeveragePreference[] = [
  { id: "australian", label: "Australian", group: "cuisines", eventKeywords: ["australian", "pub", "picnic"] },
  { id: "italian", label: "Italian", group: "cuisines", eventKeywords: ["italian", "pizza", "pasta"] },
  { id: "japanese", label: "Japanese", group: "cuisines", icon: "🍣", eventKeywords: ["japanese", "ramen", "sushi", "noodles"] },
  { id: "korean", label: "Korean", group: "cuisines", eventKeywords: ["korean", "bbq"] },
  { id: "chinese", label: "Chinese", group: "cuisines", eventKeywords: ["chinese", "dumplings", "noodles"] },
  { id: "thai", label: "Thai", group: "cuisines", eventKeywords: ["thai", "noodles", "spice"] },
  { id: "vietnamese", label: "Vietnamese", group: "cuisines", aliases: ["pho", "banh mi"], eventKeywords: ["vietnamese", "pho", "banh mi"] },
  { id: "indian", label: "Indian", group: "cuisines", eventKeywords: ["indian", "curry"] },
  { id: "malaysian", label: "Malaysian", group: "cuisines", eventKeywords: ["malaysian", "laksa"] },
  { id: "indonesian", label: "Indonesian", group: "cuisines", eventKeywords: ["indonesian", "satay"] },
  { id: "filipino", label: "Filipino", group: "cuisines", eventKeywords: ["filipino"] },
  { id: "lebanese", label: "Lebanese", group: "cuisines", eventKeywords: ["lebanese", "middle eastern"] },
  { id: "greek", label: "Greek", group: "cuisines", eventKeywords: ["greek", "salad"] },
  { id: "turkish", label: "Turkish", group: "cuisines", eventKeywords: ["turkish"] },
  { id: "mexican", label: "Mexican", group: "cuisines", eventKeywords: ["mexican", "tacos"] },
  { id: "american", label: "American", group: "cuisines", eventKeywords: ["american", "burgers"] },
  { id: "french", label: "French", group: "cuisines", eventKeywords: ["french", "pastries"] },
  { id: "mediterranean", label: "Mediterranean", group: "cuisines", eventKeywords: ["mediterranean", "greek", "lebanese"] },
  { id: "middle-eastern", label: "Middle Eastern", group: "cuisines", eventKeywords: ["middle eastern", "lebanese", "halal"] },
  { id: "ethiopian", label: "Ethiopian", group: "cuisines", eventKeywords: ["ethiopian"] },
  { id: "vegetarian-friendly", label: "Vegetarian-friendly", group: "cuisines", icon: "🥗", aliases: ["vegetarian"], eventKeywords: ["vegetarian", "veggie"] },
  { id: "vegan-friendly", label: "Vegan-friendly", group: "cuisines", aliases: ["vegan"], eventKeywords: ["vegan"] },
  { id: "fusion", label: "Fusion", group: "cuisines", eventKeywords: ["fusion"] },

  { id: "burgers", label: "Burgers", group: "casualMeals", eventKeywords: ["burger", "burgers"] },
  { id: "sandwiches", label: "Sandwiches", group: "casualMeals", eventKeywords: ["sandwich", "sandwiches"] },
  { id: "wraps", label: "Wraps", group: "casualMeals", eventKeywords: ["wrap", "wraps"] },
  { id: "schnitzels", label: "Schnitzels", group: "casualMeals", eventKeywords: ["schnitzel"] },
  { id: "pies", label: "Pies", group: "casualMeals", eventKeywords: ["pie", "pies"] },
  { id: "sausages", label: "Sausages", group: "casualMeals", eventKeywords: ["sausage", "sausages"] },
  { id: "chips", label: "Chips", group: "casualMeals", aliases: ["fries"], eventKeywords: ["chips", "fries"] },
  { id: "pizza", label: "Pizza", group: "casualMeals", icon: "🍕", eventKeywords: ["pizza", "italian"] },
  { id: "pasta", label: "Pasta", group: "casualMeals", eventKeywords: ["pasta", "italian"] },
  { id: "rice-dishes", label: "Rice dishes", group: "casualMeals", aliases: ["rice"], eventKeywords: ["rice"] },
  { id: "noodles", label: "Noodles", group: "casualMeals", aliases: ["ramen", "pho"], eventKeywords: ["noodles", "ramen", "pho", "laksa"] },

  { id: "chicken", label: "Chicken", group: "proteins", eventKeywords: ["chicken"] },
  { id: "beef", label: "Beef", group: "proteins", eventKeywords: ["beef", "burger"] },
  { id: "lamb", label: "Lamb", group: "proteins", eventKeywords: ["lamb"] },
  { id: "pork", label: "Pork", group: "proteins", eventKeywords: ["pork"] },
  { id: "fish", label: "Fish", group: "proteins", eventKeywords: ["fish"] },
  { id: "seafood", label: "Seafood", group: "proteins", eventKeywords: ["seafood", "fish"] },
  { id: "tofu", label: "Tofu", group: "proteins", eventKeywords: ["tofu", "vegetarian", "vegan"] },
  { id: "eggs", label: "Eggs", group: "proteins", eventKeywords: ["egg", "eggs"] },

  { id: "salads", label: "Salads", group: "lighterOptions", eventKeywords: ["salad", "salads"] },
  { id: "garden-salad", label: "Garden salad", group: "lighterOptions", eventKeywords: ["garden salad", "salad"] },
  { id: "caesar-salad", label: "Caesar salad", group: "lighterOptions", eventKeywords: ["caesar", "salad"] },
  { id: "greek-salad", label: "Greek salad", group: "lighterOptions", eventKeywords: ["greek salad", "salad"] },
  { id: "chicken-salad", label: "Chicken salad", group: "lighterOptions", eventKeywords: ["chicken salad", "salad"] },
  { id: "rice-bowls", label: "Rice bowls", group: "lighterOptions", aliases: ["bowls"], eventKeywords: ["rice bowl", "bowl"] },
  { id: "poke-bowls", label: "Poke bowls", group: "lighterOptions", aliases: ["poke"], eventKeywords: ["poke", "bowl"] },
  { id: "soups", label: "Soups", group: "lighterOptions", eventKeywords: ["soup", "ramen"] },

  { id: "coffee-food", label: "Coffee", group: "cafeEasy", icon: "☕", aliases: ["cafe", "cafe coffee"], eventKeywords: ["coffee", "cafe", "cafe", "espresso"] },
  { id: "tea-food", label: "Tea", group: "cafeEasy", eventKeywords: ["tea", "cafe"] },
  { id: "bubble-tea-food", label: "Bubble tea", group: "cafeEasy", aliases: ["boba"], eventKeywords: ["bubble tea", "boba"] },
  { id: "juices-food", label: "Juices", group: "cafeEasy", eventKeywords: ["juice", "juices"] },
  { id: "smoothies-food", label: "Smoothies", group: "cafeEasy", eventKeywords: ["smoothie", "smoothies"] },
  { id: "pastries", label: "Pastries", group: "cafeEasy", eventKeywords: ["pastry", "pastries", "bakery"] },
  { id: "toasties", label: "Toasties", group: "cafeEasy", eventKeywords: ["toastie", "toasties", "cafe"] },
  { id: "cakes-cafe", label: "Cakes", group: "cafeEasy", eventKeywords: ["cake", "cakes", "cafe"] },

  { id: "cakes-dessert", label: "Cakes", group: "desserts", eventKeywords: ["cake", "cakes", "dessert"] },
  { id: "ice-cream", label: "Ice cream", group: "desserts", aliases: ["icecream"], eventKeywords: ["ice cream", "gelato", "dessert"] },
  { id: "gelato", label: "Gelato", group: "desserts", eventKeywords: ["gelato", "ice cream"] },
  { id: "sorbet", label: "Sorbet", group: "desserts", eventKeywords: ["sorbet", "dessert"] },
  { id: "chocolate-desserts", label: "Chocolate desserts", group: "desserts", eventKeywords: ["chocolate", "dessert"] },
  { id: "fruit-desserts", label: "Fruit desserts", group: "desserts", eventKeywords: ["fruit", "dessert"] },
  { id: "donuts", label: "Donuts", group: "desserts", aliases: ["doughnuts"], eventKeywords: ["donut", "doughnut"] },
  { id: "cookies", label: "Cookies", group: "desserts", aliases: ["biscuits"], eventKeywords: ["cookie", "cookies", "biscuits"] },

  { id: "flavour-chocolate", label: "Chocolate", group: "iceCreamFlavours", eventKeywords: ["chocolate"] },
  { id: "flavour-vanilla", label: "Vanilla", group: "iceCreamFlavours", eventKeywords: ["vanilla"] },
  { id: "flavour-strawberry", label: "Strawberry", group: "iceCreamFlavours", eventKeywords: ["strawberry"] },
  { id: "flavour-pistachio", label: "Pistachio", group: "iceCreamFlavours", eventKeywords: ["pistachio"] },
  { id: "flavour-mint", label: "Mint", group: "iceCreamFlavours", eventKeywords: ["mint"] },
  { id: "flavour-mango-sorbet", label: "Mango sorbet", group: "iceCreamFlavours", eventKeywords: ["mango", "sorbet"] },
  { id: "flavour-blueberry", label: "Blueberry", group: "iceCreamFlavours", eventKeywords: ["blueberry"] },
  { id: "flavour-taro", label: "Taro", group: "iceCreamFlavours", eventKeywords: ["taro"] },
  { id: "flavour-black-sesame", label: "Black sesame", group: "iceCreamFlavours", eventKeywords: ["black sesame", "sesame"] },
  { id: "flavour-coconut", label: "Coconut", group: "iceCreamFlavours", eventKeywords: ["coconut"] },
  { id: "flavour-coffee", label: "Coffee", group: "iceCreamFlavours", eventKeywords: ["coffee"] },
  { id: "flavour-salted-caramel", label: "Salted caramel", group: "iceCreamFlavours", eventKeywords: ["salted caramel", "caramel"] },

  { id: "popcorn", label: "Popcorn", group: "snacks", eventKeywords: ["popcorn", "movie", "cinema"] },
  { id: "crackers", label: "Crackers", group: "snacks", eventKeywords: ["crackers", "picnic"] },
  { id: "fruit", label: "Fruit", group: "snacks", eventKeywords: ["fruit", "picnic"] },
  { id: "nuts", label: "Nuts", group: "snacks", eventKeywords: ["nuts", "trail mix"] },
  { id: "chips-crisps", label: "Chips/crisps", group: "snacks", aliases: ["crisps"], eventKeywords: ["chips", "crisps", "movie"] },
  { id: "pretzels", label: "Pretzels", group: "snacks", eventKeywords: ["pretzel", "pretzels"] },
  { id: "snack-chocolate", label: "Chocolate", group: "snacks", eventKeywords: ["chocolate", "movie"] },
  { id: "biscuits", label: "Biscuits", group: "snacks", aliases: ["cookies"], eventKeywords: ["biscuits", "cookies"] },
  { id: "trail-mix", label: "Trail mix", group: "snacks", eventKeywords: ["trail mix", "nuts", "picnic"] },

  { id: "water", label: "Water", group: "nonAlcoholicDrinks", eventKeywords: ["water", "walk", "beach"] },
  { id: "sparkling-water", label: "Sparkling water", group: "nonAlcoholicDrinks", eventKeywords: ["sparkling water"] },
  { id: "coffee-drink", label: "Coffee", group: "nonAlcoholicDrinks", icon: "☕", aliases: ["cafe"], eventKeywords: ["coffee", "cafe", "espresso"] },
  { id: "tea-drink", label: "Tea", group: "nonAlcoholicDrinks", eventKeywords: ["tea", "cafe"] },
  { id: "bubble-tea-drink", label: "Bubble tea", group: "nonAlcoholicDrinks", aliases: ["boba"], eventKeywords: ["bubble tea", "boba"] },
  { id: "juice-drink", label: "Juice", group: "nonAlcoholicDrinks", eventKeywords: ["juice", "juices"] },
  { id: "smoothies-drink", label: "Smoothies", group: "nonAlcoholicDrinks", eventKeywords: ["smoothie", "smoothies"] },
  { id: "soft-drinks", label: "Soft drinks", group: "nonAlcoholicDrinks", aliases: ["soda"], eventKeywords: ["soft drink", "soda"] },
  { id: "mocktails", label: "Mocktails", group: "nonAlcoholicDrinks", eventKeywords: ["mocktail", "mocktails", "alcohol-free"] },

  { id: "beer", label: "Beer", group: "alcoholicDrinks", ageSensitive: true, eventKeywords: ["beer", "pub", "bar"] },
  { id: "wine", label: "Wine", group: "alcoholicDrinks", ageSensitive: true, eventKeywords: ["wine", "bar"] },
  { id: "cocktails", label: "Cocktails", group: "alcoholicDrinks", ageSensitive: true, eventKeywords: ["cocktail", "cocktails", "bar"] },
  { id: "cider", label: "Cider", group: "alcoholicDrinks", ageSensitive: true, eventKeywords: ["cider", "bar"] },
  { id: "spirits", label: "Spirits", group: "alcoholicDrinks", ageSensitive: true, eventKeywords: ["spirits", "bar"] },

  { id: "prefer-alcohol-free-venues", label: "Prefer alcohol-free venues", group: "alcoholComfort", aliases: ["alcohol-free", "no alcohol"], ageSensitive: true, eventKeywords: ["alcohol-free", "library", "park", "cafe", "coffee"] },
  { id: "comfortable-alcohol-venues", label: "Comfortable with venues that serve alcohol", group: "alcoholComfort", aliases: ["alcohol venues"], ageSensitive: true, eventKeywords: ["bar", "pub", "restaurant"] },
  { id: "not-interested-alcohol-meetups", label: "Not interested in alcohol-related meetups", group: "alcoholComfort", aliases: ["avoid alcohol", "no alcohol"], ageSensitive: true, eventKeywords: ["alcohol-free", "cafe", "library"] },

  { id: "vegetarian", label: "Vegetarian", group: "dietaryNeeds", icon: "🥗", eventKeywords: ["vegetarian", "veggie"] },
  { id: "vegan", label: "Vegan", group: "dietaryNeeds", eventKeywords: ["vegan"] },
  { id: "gluten-free", label: "Gluten-free", group: "dietaryNeeds", aliases: ["gluten free"], eventKeywords: ["gluten-free", "gluten free"] },
  { id: "dairy-free", label: "Dairy-free", group: "dietaryNeeds", aliases: ["dairy free"], eventKeywords: ["dairy-free", "dairy free"] },
  { id: "nut-free", label: "Nut-free", group: "dietaryNeeds", aliases: ["nut allergy", "nuts"], eventKeywords: ["nut-free", "nut allergy"] },
  { id: "halal", label: "Halal", group: "dietaryNeeds", eventKeywords: ["halal", "middle eastern"] },
  { id: "kosher", label: "Kosher", group: "dietaryNeeds", eventKeywords: ["kosher"] },
  { id: "low-spice", label: "Low spice", group: "dietaryNeeds", aliases: ["not spicy"], eventKeywords: ["low spice", "mild"] },
  { id: "no-seafood", label: "No seafood", group: "dietaryNeeds", eventKeywords: ["no seafood"] },
  { id: "no-pork", label: "No pork", group: "dietaryNeeds", eventKeywords: ["no pork"] },
  { id: "low-sugar", label: "Low sugar", group: "dietaryNeeds", eventKeywords: ["low sugar"] },
  { id: "allergy-aware-venues", label: "Allergy-aware venues", group: "dietaryNeeds", aliases: ["allergy", "allergies"], eventKeywords: ["allergy", "allergy-aware"] },

  { id: "avoid-spicy-food", label: "Avoid spicy food", group: "avoidances", aliases: ["no spice", "not spicy"], eventKeywords: ["mild", "low spice"] },
  { id: "avoid-seafood", label: "Avoid seafood", group: "avoidances", eventKeywords: ["no seafood"] },
  { id: "avoid-alcohol-venues", label: "Avoid alcohol venues", group: "avoidances", aliases: ["alcohol-free"], eventKeywords: ["alcohol-free", "library", "park", "cafe"] },
  { id: "avoid-loud-bars", label: "Avoid loud bars", group: "avoidances", eventKeywords: ["quiet", "low chat", "library", "cafe"] },
  { id: "avoid-crowded-restaurants", label: "Avoid crowded restaurants", group: "avoidances", eventKeywords: ["small group", "quiet"] },
  { id: "avoid-messy-foods", label: "Avoid messy foods", group: "avoidances", eventKeywords: ["simple food", "easy"] },
  { id: "prefer-familiar-simple-food", label: "Prefer familiar/simple food", group: "avoidances", aliases: ["simple food"], eventKeywords: ["simple", "cafe", "coffee", "picnic"] },
];

export const defaultFoodBeveragePreferenceIds = [
  "coffee-food",
  "japanese",
  "vegetarian-friendly",
  "allergy-aware-venues",
  "prefer-alcohol-free-venues",
];

const normalizeSearchValue = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

export const foodBeveragePreferenceById = new Map(foodBeveragePreferenceOptions.map((option) => [option.id, option]));
export const validFoodBeveragePreferenceIds = new Set(foodBeveragePreferenceOptions.map((option) => option.id));

export function normalizeFoodBeveragePreferenceIds(value?: string[] | null) {
  const uniqueIds: string[] = [];

  (value ?? []).forEach((id) => {
    if (validFoodBeveragePreferenceIds.has(id) && !uniqueIds.includes(id)) {
      uniqueIds.push(id);
    }
  });

  return uniqueIds.length ? uniqueIds : defaultFoodBeveragePreferenceIds;
}

export function getFoodBeveragePreference(id: string) {
  return foodBeveragePreferenceById.get(id);
}

export function getFoodBeverageOptionsByGroup(group: FoodPreferenceGroupId) {
  return foodBeveragePreferenceOptions.filter((option) => option.group === group);
}

export function getSelectedFoodPreferenceLabels(ids: string[], limit = 6) {
  const labels = ids.map((id) => foodBeveragePreferenceById.get(id)?.label).filter((label): label is string => Boolean(label));
  return labels.slice(0, limit);
}

export function searchFoodBeveragePreferences(query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return [];

  return foodBeveragePreferenceOptions.filter((option) => {
    const searchable = normalizeSearchValue([option.label, option.id, option.group, ...(option.aliases ?? [])].join(" "));
    return searchable.includes(normalizedQuery);
  });
}

export function getFoodPreferenceGroupSelectedCount(ids: string[], group: FoodPreferenceGroupId) {
  return ids.filter((id) => foodBeveragePreferenceById.get(id)?.group === group).length;
}

export function getEventFoodPreferenceMatches(
  event: { title: string; category: string; venue: string; description: string; tags: string[] },
  selectedIds: string[],
  limit = 2
) {
  const searchableEvent = normalizeSearchValue([event.title, event.category, event.venue, event.description, ...event.tags].join(" "));
  const matches: string[] = [];

  selectedIds.forEach((id) => {
    const option = foodBeveragePreferenceById.get(id);
    if (!option || matches.includes(option.label)) return;

    const candidateTerms = [option.label, ...(option.aliases ?? []), ...(option.eventKeywords ?? [])];
    const isMatch = candidateTerms.some((term) => {
      const normalizedTerm = normalizeSearchValue(term);
      return normalizedTerm.length > 1 && searchableEvent.includes(normalizedTerm);
    });

    if (isMatch) matches.push(option.label);
  });

  return matches.slice(0, limit);
}
