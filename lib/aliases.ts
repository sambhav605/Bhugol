/**
 * Alias map for the Nepal Districts quiz.
 *
 * Key   = canonical district name from the GeoJSON, lowercased.
 * Value = array of accepted alternative inputs (already lowercase, accent-free).
 *
 * These cover common alternate spellings, romanizations, and well-known
 * cities that people associate with a given district.
 */
export const ALIASES: Record<string, string[]> = {
  kabhrepalanchok: ["kavre", "kavrepalanchok", "kabhre", "kabhrepalanchowk", "kavrepalanchowk"],
  sindhupalchok: ["sindhupalchowk", "sindhupalchwok"],
  kapilbastu: ["kapilvastu"],
  dhanusha: ["dhanusa"],
  "nawalparasi west": ["nawalparasi", "nawalparasiwest", "bardaghat", "bardaghatsusta"],
  "nawalparasi east": ["nawalpur", "parasi", "nawalparasieast"],
  lalitpur: ["patan"],
  kaski: ["pokhara"],
  makawanpur: ["makwanpur", "hetauda"],
  // A few extra friendly aliases for major cities / common spellings
  kathmandu: ["ktm"],
  chitawan: ["chitwan", "bharatpur"],
  morang: ["biratnagar"],
  rupandehi: ["butwal", "siddharthanagar", "bhairahawa"],
  sunsari: ["dharan", "itahari"],
}
