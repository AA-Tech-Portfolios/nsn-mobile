export type InterestCategoryId =
  | "moviesTv"
  | "reading"
  | "comicsAnimeManga"
  | "games"
  | "artCreativity"
  | "music"
  | "outdoorsLocal"
  | "wellnessRelaxation"
  | "foodDrinksVenues"
  | "movementSport"
  | "learningIdeas"
  | "animalsPets"
  | "travelCulture"
  | "communityVolunteering";

export type InterestComfortTagId =
  | "love-this"
  | "open-to-this"
  | "beginner-friendly-only"
  | "small-groups-only"
  | "quiet-setting-preferred"
  | "daytime-preferred"
  | "evening-preferred"
  | "observing-okay"
  | "not-for-me";

export type InterestPreference = {
  id: string;
  label: string;
  category: InterestCategoryId;
  aliases?: string[];
  genres?: string[];
  comfortTags?: InterestComfortTagId[];
  eventKeywords?: string[];
};

export type InterestCategory = {
  id: InterestCategoryId;
  title: string;
  copy: string;
  defaultOpen?: boolean;
  defaultVisible?: number;
};

export const interestComfortTags: Array<{ id: InterestComfortTagId; label: string; copy: string }> = [
  { id: "love-this", label: "Love this", copy: "Prioritise this when it fits." },
  { id: "open-to-this", label: "Open to this", copy: "Comfortable trying it." },
  { id: "beginner-friendly-only", label: "Beginner-friendly only", copy: "Keep it easy to join." },
  { id: "small-groups-only", label: "Small groups only", copy: "Best with fewer people." },
  { id: "quiet-setting-preferred", label: "Quiet setting preferred", copy: "Lower noise is better." },
  { id: "daytime-preferred", label: "Daytime preferred", copy: "Prefer this before evening." },
  { id: "evening-preferred", label: "Evening preferred", copy: "Prefer this later in the day." },
  { id: "observing-okay", label: "Just observing is okay", copy: "Watching first is fine." },
  { id: "not-for-me", label: "Not for me", copy: "Avoid recommending this." },
];

export const interestCategories: InterestCategory[] = [
  { id: "moviesTv", title: "Movies, TV & streaming", copy: "Low-pressure watching, chatting, and shared media interests.", defaultOpen: true, defaultVisible: 12 },
  { id: "reading", title: "Reading", copy: "Books, book clubs, audiobooks, and quieter conversation starters.", defaultOpen: true, defaultVisible: 10 },
  { id: "comicsAnimeManga", title: "Comics, anime & manga", copy: "Visual stories, fan-friendly chats, and calm watch/read ideas.", defaultVisible: 10 },
  { id: "games", title: "Games", copy: "Games that can work as easy conversation starters.", defaultOpen: true, defaultVisible: 12 },
  { id: "artCreativity", title: "Art & creativity", copy: "Creative interests for workshops, galleries, and gentle making sessions.", defaultVisible: 10 },
  { id: "music", title: "Music", copy: "Listening, gigs, open mics, and shared playlists.", defaultVisible: 12 },
  { id: "outdoorsLocal", title: "Outdoors & local exploring", copy: "North Shore-friendly places and simple outside activities.", defaultOpen: true, defaultVisible: 12 },
  { id: "wellnessRelaxation", title: "Wellness & relaxation", copy: "Calm interests for decompressing without pressure.", defaultVisible: 9 },
  { id: "foodDrinksVenues", title: "Food, drinks & venues", copy: "Activity-style venue interests that pair with food preferences.", defaultVisible: 9 },
  { id: "movementSport", title: "Movement & sport", copy: "Casual, social, and easy-paced movement options.", defaultVisible: 11 },
  { id: "learningIdeas", title: "Learning & ideas", copy: "Conversation-friendly topics, workshops, and study interests.", defaultVisible: 12 },
  { id: "animalsPets", title: "Animals & pets", copy: "Pet-friendly and animal-related comfort interests.", defaultVisible: 7 },
  { id: "travelCulture", title: "Travel & culture", copy: "Places, cultures, language exchange, and local discovery.", defaultVisible: 8 },
  { id: "communityVolunteering", title: "Community & volunteering", copy: "Helpful, supportive, and local community activities.", defaultVisible: 8 },
];

const mediaGenres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Mystery",
  "Crime",
  "Romance",
  "Sci-fi",
  "Fantasy",
  "Supernatural",
  "Historical",
  "Documentary",
  "Slice of life",
  "Feel-good",
  "Indie",
  "Classics",
  "Animated",
];

const mediaGenreInterests: InterestPreference[] = mediaGenres.map((genre) => ({
  id: `genre-${genre.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  label: genre,
  category: "moviesTv",
  aliases: [`${genre} movies`, `${genre} TV`, `${genre} books`, `${genre} comics`, `${genre} anime`, `${genre} manga`, `${genre} games`],
  genres: [genre],
  eventKeywords: [genre.toLocaleLowerCase(), genre === "Sci-fi" ? "science fiction" : genre.toLocaleLowerCase()],
}));

export const interestPreferenceOptions: InterestPreference[] = [
  { id: "movies", label: "Movies", category: "moviesTv", genres: mediaGenres, eventKeywords: ["movie", "movies", "cinema", "film"] },
  { id: "tv-shows", label: "TV shows", category: "moviesTv", genres: mediaGenres, aliases: ["television", "streaming"], eventKeywords: ["tv", "streaming"] },
  { id: "documentaries", label: "Documentaries", category: "moviesTv", genres: ["Documentary"], eventKeywords: ["documentary", "documentaries"] },
  { id: "reality-tv", label: "Reality TV", category: "moviesTv", aliases: ["reality shows"], eventKeywords: ["reality"] },
  { id: "sitcoms", label: "Sitcoms", category: "moviesTv", genres: ["Comedy"], eventKeywords: ["sitcom", "comedy"] },
  { id: "k-dramas", label: "K-dramas", category: "moviesTv", aliases: ["kdrama", "korean drama"], genres: ["Drama", "Romance"], eventKeywords: ["k-drama", "korean drama"] },
  { id: "true-crime", label: "True crime", category: "moviesTv", genres: ["Crime", "Mystery"], eventKeywords: ["true crime", "crime"] },
  { id: "stand-up-comedy", label: "Stand-up comedy", category: "moviesTv", genres: ["Comedy"], eventKeywords: ["stand-up", "comedy"] },
  { id: "cinema-outings", label: "Cinema outings", category: "moviesTv", aliases: ["cinema", "movies out"], eventKeywords: ["cinema", "event cinemas", "movie night"] },
  { id: "movie-nights", label: "Movie nights", category: "moviesTv", aliases: ["watch party"], eventKeywords: ["movie night", "watch"] },
  ...mediaGenreInterests,

  { id: "books", label: "Books", category: "reading", genres: mediaGenres, eventKeywords: ["book", "books", "library", "reading"] },
  { id: "audiobooks", label: "Audiobooks", category: "reading", aliases: ["audio books"], genres: mediaGenres, eventKeywords: ["audiobook"] },
  { id: "comics", label: "Comics", category: "reading", genres: mediaGenres, eventKeywords: ["comic", "comics"] },
  { id: "graphic-novels", label: "Graphic novels", category: "reading", genres: mediaGenres, eventKeywords: ["graphic novel", "comics"] },
  { id: "manga-reading", label: "Manga", category: "reading", genres: mediaGenres, eventKeywords: ["manga"] },
  { id: "webtoons-reading", label: "Webtoons", category: "reading", aliases: ["web comics"], genres: mediaGenres, eventKeywords: ["webtoon"] },
  { id: "poetry", label: "Poetry", category: "reading", eventKeywords: ["poetry", "poems"] },
  { id: "non-fiction", label: "Non-fiction", category: "reading", aliases: ["nonfiction"], genres: ["Documentary", "Historical"], eventKeywords: ["non-fiction", "history", "science"] },
  { id: "book-clubs", label: "Book clubs", category: "reading", aliases: ["book club"], eventKeywords: ["book club", "library"] },

  { id: "anime", label: "Anime", category: "comicsAnimeManga", genres: mediaGenres, eventKeywords: ["anime"] },
  { id: "manga", label: "Manga", category: "comicsAnimeManga", genres: mediaGenres, eventKeywords: ["manga"] },
  { id: "webtoons", label: "Webtoons", category: "comicsAnimeManga", genres: mediaGenres, eventKeywords: ["webtoon"] },
  { id: "comic-cons", label: "Comic cons", category: "comicsAnimeManga", aliases: ["conventions"], eventKeywords: ["comic con", "anime"] },
  { id: "cosplay", label: "Cosplay", category: "comicsAnimeManga", eventKeywords: ["cosplay"] },

  { id: "video-games", label: "Video games", category: "games", genres: mediaGenres, aliases: ["gaming"], eventKeywords: ["video games", "gaming", "games"] },
  { id: "board-games", label: "Board games", category: "games", aliases: ["boardgames"], eventKeywords: ["board games", "games"] },
  { id: "card-games", label: "Card games", category: "games", eventKeywords: ["card games", "cards"] },
  { id: "chess", label: "Chess", category: "games", eventKeywords: ["chess"] },
  { id: "trivia", label: "Trivia", category: "games", aliases: ["quiz"], eventKeywords: ["trivia", "quiz"] },
  { id: "dungeons-dragons", label: "Dungeons & Dragons", category: "games", aliases: ["dnd", "d&d"], genres: ["Fantasy"], eventKeywords: ["dungeons", "dragons", "tabletop"] },
  { id: "tabletop-rpgs", label: "Tabletop RPGs", category: "games", aliases: ["ttrpg"], genres: ["Fantasy", "Adventure"], eventKeywords: ["tabletop", "rpg"] },
  { id: "cozy-games", label: "Cozy games", category: "games", genres: ["Feel-good", "Slice of life"], eventKeywords: ["cozy games", "easy games"] },
  { id: "retro-games", label: "Retro games", category: "games", genres: ["Classics"], eventKeywords: ["retro games", "classic games"] },
  { id: "puzzle-games", label: "Puzzle games", category: "games", genres: ["Mystery"], eventKeywords: ["puzzle"] },
  { id: "strategy-games", label: "Strategy games", category: "games", eventKeywords: ["strategy", "chess"] },
  { id: "cooperative-games", label: "Cooperative games", category: "games", aliases: ["co-op games"], eventKeywords: ["cooperative", "board games"] },

  { id: "drawing", label: "Drawing", category: "artCreativity", eventKeywords: ["drawing", "art"] },
  { id: "painting", label: "Painting", category: "artCreativity", eventKeywords: ["painting", "art"] },
  { id: "digital-art", label: "Digital art", category: "artCreativity", eventKeywords: ["digital art", "design"] },
  { id: "photography", label: "Photography", category: "artCreativity", eventKeywords: ["photography", "photos"] },
  { id: "design", label: "Design", category: "artCreativity", eventKeywords: ["design"] },
  { id: "pottery", label: "Pottery", category: "artCreativity", eventKeywords: ["pottery", "ceramics"] },
  { id: "crafting", label: "Crafting", category: "artCreativity", aliases: ["crafts"], eventKeywords: ["crafting", "craft"] },
  { id: "writing", label: "Writing", category: "artCreativity", eventKeywords: ["writing"] },
  { id: "journaling", label: "Journaling", category: "artCreativity", eventKeywords: ["journaling"] },
  { id: "sewing", label: "Sewing", category: "artCreativity", eventKeywords: ["sewing"] },
  { id: "knitting", label: "Knitting", category: "artCreativity", eventKeywords: ["knitting"] },
  { id: "crochet", label: "Crochet", category: "artCreativity", eventKeywords: ["crochet"] },

  { id: "pop", label: "Pop", category: "music", eventKeywords: ["pop music"] },
  { id: "rock", label: "Rock", category: "music", eventKeywords: ["rock music"] },
  { id: "indie-music", label: "Indie", category: "music", aliases: ["indie music"], eventKeywords: ["indie music", "quiet music"] },
  { id: "jazz", label: "Jazz", category: "music", eventKeywords: ["jazz"] },
  { id: "classical", label: "Classical", category: "music", eventKeywords: ["classical"] },
  { id: "hip-hop", label: "Hip hop", category: "music", aliases: ["rap"], eventKeywords: ["hip hop"] },
  { id: "rnb", label: "R&B", category: "music", aliases: ["r and b", "rhythm and blues"], eventKeywords: ["r&b"] },
  { id: "electronic", label: "Electronic", category: "music", eventKeywords: ["electronic"] },
  { id: "k-pop", label: "K-pop", category: "music", aliases: ["kpop"], eventKeywords: ["k-pop"] },
  { id: "j-pop", label: "J-pop", category: "music", aliases: ["jpop"], eventKeywords: ["j-pop"] },
  { id: "lo-fi", label: "Lo-fi", category: "music", aliases: ["lofi"], eventKeywords: ["lo-fi", "quiet music"] },
  { id: "soundtracks", label: "Soundtracks", category: "music", eventKeywords: ["soundtrack", "movie"] },
  { id: "concerts", label: "Concerts", category: "music", eventKeywords: ["concert", "live music"] },
  { id: "karaoke", label: "Karaoke", category: "music", eventKeywords: ["karaoke"] },
  { id: "open-mic-nights", label: "Open mic nights", category: "music", aliases: ["open mic"], eventKeywords: ["open mic"] },
  { id: "quiet-music", label: "Quiet music", category: "music", aliases: ["calm songs"], eventKeywords: ["quiet music", "calm songs", "music listening"] },

  { id: "walking", label: "Walking", category: "outdoorsLocal", aliases: ["walks"], eventKeywords: ["walk", "walking"] },
  { id: "bushwalks", label: "Bushwalks", category: "outdoorsLocal", aliases: ["hiking"], eventKeywords: ["bushwalk", "hike", "park"] },
  { id: "coastal-walks", label: "Coastal walks", category: "outdoorsLocal", eventKeywords: ["coastal walk", "beach", "harbour"] },
  { id: "picnics", label: "Picnics", category: "outdoorsLocal", eventKeywords: ["picnic", "park"] },
  { id: "parks", label: "Parks", category: "outdoorsLocal", eventKeywords: ["park", "parks"] },
  { id: "beach-days", label: "Beach days", category: "outdoorsLocal", eventKeywords: ["beach", "ocean"] },
  { id: "ferry-trips", label: "Ferry trips", category: "outdoorsLocal", eventKeywords: ["ferry", "harbour"] },
  { id: "local-cafes", label: "Local cafes", category: "outdoorsLocal", aliases: ["local cafés", "cafes"], eventKeywords: ["cafe", "coffee"] },
  { id: "markets", label: "Markets", category: "outdoorsLocal", eventKeywords: ["market", "markets"] },
  { id: "libraries", label: "Libraries", category: "outdoorsLocal", eventKeywords: ["library", "libraries"] },
  { id: "gardens", label: "Gardens", category: "outdoorsLocal", eventKeywords: ["garden", "gardens"] },
  { id: "stargazing", label: "Stargazing", category: "outdoorsLocal", aliases: ["stars"], eventKeywords: ["stargazing", "stars"] },

  { id: "yoga", label: "Yoga", category: "wellnessRelaxation", eventKeywords: ["yoga"] },
  { id: "meditation", label: "Meditation", category: "wellnessRelaxation", eventKeywords: ["meditation"] },
  { id: "stretching", label: "Stretching", category: "wellnessRelaxation", eventKeywords: ["stretching"] },
  { id: "sauna-steam", label: "Sauna / steam room", category: "wellnessRelaxation", aliases: ["sauna", "steam room"], eventKeywords: ["sauna", "steam"] },
  { id: "spa-days", label: "Spa days", category: "wellnessRelaxation", eventKeywords: ["spa"] },
  { id: "massage-therapy", label: "Massage therapy", category: "wellnessRelaxation", eventKeywords: ["massage"] },
  { id: "relaxation", label: "Relaxation", category: "wellnessRelaxation", eventKeywords: ["relax", "calm"] },
  { id: "self-care", label: "Self-care", category: "wellnessRelaxation", eventKeywords: ["self-care"] },
  { id: "recovery", label: "Recovery", category: "wellnessRelaxation", eventKeywords: ["recovery"] },

  { id: "coffee-cafes", label: "Coffee", category: "foodDrinksVenues", aliases: ["coffee shops", "cafes"], eventKeywords: ["coffee", "cafe"] },
  { id: "tea-meetups", label: "Tea", category: "foodDrinksVenues", eventKeywords: ["tea", "cafe"] },
  { id: "dessert-spots", label: "Dessert spots", category: "foodDrinksVenues", eventKeywords: ["dessert", "ice cream", "gelato"] },
  { id: "restaurants", label: "Restaurants", category: "foodDrinksVenues", eventKeywords: ["restaurant", "food"] },
  { id: "small-tables", label: "Small tables", category: "foodDrinksVenues", eventKeywords: ["small table", "food"] },
  { id: "quiet-cafes", label: "Quiet cafes", category: "foodDrinksVenues", aliases: ["quiet cafés"], eventKeywords: ["quiet cafe", "coffee", "cafe"] },
  { id: "food-markets", label: "Food markets", category: "foodDrinksVenues", eventKeywords: ["food market", "markets"] },
  { id: "picnic-foods", label: "Picnic foods", category: "foodDrinksVenues", eventKeywords: ["picnic", "snacks"] },

  { id: "running", label: "Running", category: "movementSport", eventKeywords: ["running"] },
  { id: "cycling", label: "Cycling", category: "movementSport", eventKeywords: ["cycling", "bike"] },
  { id: "swimming", label: "Swimming", category: "movementSport", eventKeywords: ["swimming", "beach"] },
  { id: "tennis", label: "Tennis", category: "movementSport", eventKeywords: ["tennis"] },
  { id: "basketball", label: "Basketball", category: "movementSport", eventKeywords: ["basketball"] },
  { id: "soccer", label: "Soccer", category: "movementSport", aliases: ["football"], eventKeywords: ["soccer", "football"] },
  { id: "bowling", label: "Bowling", category: "movementSport", eventKeywords: ["bowling"] },
  { id: "mini-golf", label: "Mini golf", category: "movementSport", eventKeywords: ["mini golf"] },
  { id: "pilates", label: "Pilates", category: "movementSport", eventKeywords: ["pilates"] },
  { id: "dance", label: "Dance", category: "movementSport", aliases: ["dancing"], eventKeywords: ["dance"] },
  { id: "casual-sports", label: "Casual sports", category: "movementSport", eventKeywords: ["casual sports", "active"] },

  { id: "technology", label: "Technology", category: "learningIdeas", aliases: ["tech"], eventKeywords: ["technology", "tech"] },
  { id: "coding", label: "Coding", category: "learningIdeas", aliases: ["programming"], eventKeywords: ["coding", "programming"] },
  { id: "ai", label: "AI", category: "learningIdeas", aliases: ["artificial intelligence"], eventKeywords: ["ai", "artificial intelligence"] },
  { id: "science", label: "Science", category: "learningIdeas", eventKeywords: ["science"] },
  { id: "space", label: "Space", category: "learningIdeas", eventKeywords: ["space", "stargazing"] },
  { id: "history", label: "History", category: "learningIdeas", eventKeywords: ["history", "historical"] },
  { id: "psychology", label: "Psychology", category: "learningIdeas", eventKeywords: ["psychology"] },
  { id: "philosophy", label: "Philosophy", category: "learningIdeas", eventKeywords: ["philosophy"] },
  { id: "languages", label: "Languages", category: "learningIdeas", eventKeywords: ["language", "languages"] },
  { id: "learning-trivia", label: "Trivia", category: "learningIdeas", eventKeywords: ["trivia", "quiz"] },
  { id: "workshops", label: "Workshops", category: "learningIdeas", eventKeywords: ["workshop", "workshops"] },
  { id: "study-groups-learning", label: "Study groups", category: "learningIdeas", eventKeywords: ["study", "library"] },

  { id: "dogs", label: "Dogs", category: "animalsPets", eventKeywords: ["dog", "dogs"] },
  { id: "cats", label: "Cats", category: "animalsPets", eventKeywords: ["cat", "cats"] },
  { id: "wildlife", label: "Wildlife", category: "animalsPets", eventKeywords: ["wildlife", "animals"] },
  { id: "pet-cafes", label: "Pet cafes", category: "animalsPets", aliases: ["pet cafés"], eventKeywords: ["pet cafe", "pets"] },
  { id: "dog-walks", label: "Dog walks", category: "animalsPets", eventKeywords: ["dog walk", "walk"] },
  { id: "animal-shelters", label: "Animal shelters", category: "animalsPets", eventKeywords: ["animal shelter", "volunteering"] },

  { id: "travel", label: "Travel", category: "travelCulture", eventKeywords: ["travel"] },
  { id: "local-culture", label: "Local culture", category: "travelCulture", eventKeywords: ["local", "culture"] },
  { id: "museums", label: "Museums", category: "travelCulture", eventKeywords: ["museum", "museums"] },
  { id: "galleries", label: "Galleries", category: "travelCulture", eventKeywords: ["gallery", "galleries", "art"] },
  { id: "language-exchange", label: "Language exchange", category: "travelCulture", eventKeywords: ["language exchange", "languages"] },
  { id: "food-cultures", label: "Food cultures", category: "travelCulture", eventKeywords: ["food", "culture"] },
  { id: "day-trips", label: "Day trips", category: "travelCulture", eventKeywords: ["day trip", "ferry"] },

  { id: "volunteering", label: "Volunteering", category: "communityVolunteering", eventKeywords: ["volunteering", "volunteer"] },
  { id: "local-groups", label: "Local groups", category: "communityVolunteering", eventKeywords: ["local groups", "community"] },
  { id: "environmental-cleanups", label: "Environmental cleanups", category: "communityVolunteering", eventKeywords: ["cleanup", "environmental"] },
  { id: "community-gardens", label: "Community gardens", category: "communityVolunteering", eventKeywords: ["community garden", "gardens"] },
  { id: "study-groups", label: "Study groups", category: "communityVolunteering", eventKeywords: ["study group", "library"] },
  { id: "supportive-meetups", label: "Supportive meetups", category: "communityVolunteering", eventKeywords: ["supportive", "meetups"] },
];

export const defaultInterestPreferenceIds = ["coffee-cafes", "movies", "board-games", "walking", "libraries"];

export const defaultInterestComfortTagsByInterest: Record<string, InterestComfortTagId[]> = {
  "coffee-cafes": ["open-to-this", "quiet-setting-preferred"],
  movies: ["open-to-this", "observing-okay"],
  "board-games": ["love-this", "small-groups-only"],
  walking: ["open-to-this", "daytime-preferred"],
  libraries: ["love-this", "quiet-setting-preferred"],
};

const normalizeSearchValue = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

export const interestPreferenceById = new Map(interestPreferenceOptions.map((option) => [option.id, option]));
export const validInterestPreferenceIds = new Set(interestPreferenceOptions.map((option) => option.id));
export const validInterestComfortTagIds = new Set(interestComfortTags.map((tag) => tag.id));

export function normalizeInterestPreferenceIds(value?: string[] | null) {
  if (!value) return defaultInterestPreferenceIds;

  const uniqueIds: string[] = [];
  value.forEach((id) => {
    if (validInterestPreferenceIds.has(id) && !uniqueIds.includes(id)) {
      uniqueIds.push(id);
    }
  });

  return uniqueIds;
}

export function normalizeInterestComfortTagsByInterest(value?: Record<string, string[]> | null, selectedIds?: string[]) {
  if (!value) return defaultInterestComfortTagsByInterest;

  const selectedSet = selectedIds ? new Set(selectedIds) : validInterestPreferenceIds;
  const normalized: Record<string, InterestComfortTagId[]> = {};

  Object.entries(value).forEach(([interestId, tags]) => {
    if (!validInterestPreferenceIds.has(interestId) || !selectedSet.has(interestId)) return;

    const validTags = tags.filter((tag): tag is InterestComfortTagId => validInterestComfortTagIds.has(tag as InterestComfortTagId));
    if (validTags.length) {
      normalized[interestId] = Array.from(new Set(validTags));
    }
  });

  return normalized;
}

export function getInterestPreference(id: string) {
  return interestPreferenceById.get(id);
}

export function getInterestOptionsByCategory(category: InterestCategoryId) {
  return interestPreferenceOptions.filter((option) => option.category === category);
}

export function getInterestPreferenceLabels(ids: string[]) {
  return ids.map((id) => interestPreferenceById.get(id)?.label).filter((label): label is string => Boolean(label));
}

export function getSelectedInterestLabels(ids: string[], limit = 8) {
  return getInterestPreferenceLabels(ids).slice(0, limit);
}

export function searchInterestPreferences(query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return [];

  return interestPreferenceOptions.filter((option) => {
    const category = interestCategories.find((item) => item.id === option.category);
    const searchable = normalizeSearchValue([
      option.label,
      option.id,
      category?.title ?? option.category,
      ...(option.aliases ?? []),
      ...(option.genres ?? []),
      ...(option.comfortTags ?? []),
    ].join(" "));
    return searchable.includes(normalizedQuery);
  });
}

export function getInterestCategorySelectedCount(ids: string[], category: InterestCategoryId) {
  return ids.filter((id) => interestPreferenceById.get(id)?.category === category).length;
}

export function getInterestComfortTagLabels(tags: string[] | undefined) {
  return (tags ?? [])
    .map((tagId) => interestComfortTags.find((tag) => tag.id === tagId)?.label)
    .filter((label): label is string => Boolean(label));
}

export function getEventInterestPreferenceMatches(
  event: { title: string; category: string; venue: string; description: string; tags: string[] },
  selectedIds: string[],
  comfortTagsByInterest: Record<string, string[]> = {},
  limit = 2
) {
  const searchableEvent = normalizeSearchValue([event.title, event.category, event.venue, event.description, ...event.tags].join(" "));
  const matches: string[] = [];

  selectedIds.forEach((id) => {
    const option = interestPreferenceById.get(id);
    if (!option || matches.includes(option.label)) return;
    if ((comfortTagsByInterest[id] ?? []).includes("not-for-me")) return;

    const candidateTerms = [option.label, ...(option.aliases ?? []), ...(option.genres ?? []), ...(option.eventKeywords ?? [])];
    const isMatch = candidateTerms.some((term) => {
      const normalizedTerm = normalizeSearchValue(term);
      return normalizedTerm.length > 1 && searchableEvent.includes(normalizedTerm);
    });

    if (isMatch) matches.push(option.label);
  });

  return matches.slice(0, limit);
}
