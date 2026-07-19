/**
 * Curated list of world hubs → IANA timezones for the Timezone Planner tool.
 *
 * This is intentionally a small, hand-picked set (~100 hubs) rather than a full
 * geonames dump — enough to cover the cities an international team actually
 * meets across. The planner's search combobox falls back to raw IANA zone ids
 * (via `Intl.supportedValuesOf('timeZone')`) for anything not listed here.
 *
 * Pure data + string helpers only — no `Intl` calls — so it is safe to import
 * from both the page frontmatter (build time) and the client island script.
 */
export type City = {
  /** Display name. */
  name: string;
  /** Country / region shown as the subtitle. */
  country: string;
  /** IANA timezone id. */
  tz: string;
  /** Extra search terms (nicknames, old names, abbreviations). */
  aliases?: string[];
};

export type ZoneResult = {
  tz: string;
  label: string;
  sub: string;
};

export const CITIES: City[] = [
  // — Asia —
  { name: 'Ho Chi Minh City', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', aliases: ['Saigon', 'Sài Gòn', 'HCMC', 'HCM', 'TP HCM'] },
  { name: 'Hanoi', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', aliases: ['Hà Nội'] },
  { name: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok' },
  { name: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', aliases: ['SG'] },
  { name: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur', aliases: ['KL'] },
  { name: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta' },
  { name: 'Manila', country: 'Philippines', tz: 'Asia/Manila' },
  { name: 'Hong Kong', country: 'Hong Kong', tz: 'Asia/Hong_Kong', aliases: ['HK'] },
  { name: 'Shanghai', country: 'China', tz: 'Asia/Shanghai', aliases: ['China'] },
  { name: 'Beijing', country: 'China', tz: 'Asia/Shanghai', aliases: ['Peking'] },
  { name: 'Shenzhen', country: 'China', tz: 'Asia/Shanghai' },
  { name: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei' },
  { name: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul', aliases: ['Korea'] },
  { name: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', aliases: ['Japan'] },
  { name: 'Osaka', country: 'Japan', tz: 'Asia/Tokyo' },
  { name: 'Mumbai', country: 'India', tz: 'Asia/Kolkata', aliases: ['Bombay'] },
  { name: 'New Delhi', country: 'India', tz: 'Asia/Kolkata', aliases: ['Delhi'] },
  { name: 'Bengaluru', country: 'India', tz: 'Asia/Kolkata', aliases: ['Bangalore'] },
  { name: 'Kolkata', country: 'India', tz: 'Asia/Kolkata', aliases: ['Calcutta'] },
  { name: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi' },
  { name: 'Dhaka', country: 'Bangladesh', tz: 'Asia/Dhaka' },
  { name: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai', aliases: ['UAE'] },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', tz: 'Asia/Dubai' },
  { name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
  { name: 'Doha', country: 'Qatar', tz: 'Asia/Qatar' },
  { name: 'Tehran', country: 'Iran', tz: 'Asia/Tehran' },
  { name: 'Jerusalem', country: 'Israel', tz: 'Asia/Jerusalem', aliases: ['Tel Aviv'] },
  { name: 'Istanbul', country: 'Turkey', tz: 'Europe/Istanbul', aliases: ['Türkiye'] },
  { name: 'Almaty', country: 'Kazakhstan', tz: 'Asia/Almaty' },
  { name: 'Colombo', country: 'Sri Lanka', tz: 'Asia/Colombo' },
  { name: 'Yangon', country: 'Myanmar', tz: 'Asia/Yangon' },
  { name: 'Kathmandu', country: 'Nepal', tz: 'Asia/Kathmandu' },
  { name: 'Phnom Penh', country: 'Cambodia', tz: 'Asia/Phnom_Penh' },

  // — Europe —
  { name: 'London', country: 'United Kingdom', tz: 'Europe/London', aliases: ['UK', 'England'] },
  { name: 'Dublin', country: 'Ireland', tz: 'Europe/Dublin' },
  { name: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon' },
  { name: 'Madrid', country: 'Spain', tz: 'Europe/Madrid' },
  { name: 'Barcelona', country: 'Spain', tz: 'Europe/Madrid' },
  { name: 'Paris', country: 'France', tz: 'Europe/Paris', aliases: ['France'] },
  { name: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam' },
  { name: 'Brussels', country: 'Belgium', tz: 'Europe/Brussels' },
  { name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin', aliases: ['Germany'] },
  { name: 'Munich', country: 'Germany', tz: 'Europe/Berlin' },
  { name: 'Frankfurt', country: 'Germany', tz: 'Europe/Berlin' },
  { name: 'Zurich', country: 'Switzerland', tz: 'Europe/Zurich' },
  { name: 'Milan', country: 'Italy', tz: 'Europe/Rome' },
  { name: 'Rome', country: 'Italy', tz: 'Europe/Rome' },
  { name: 'Vienna', country: 'Austria', tz: 'Europe/Vienna' },
  { name: 'Prague', country: 'Czechia', tz: 'Europe/Prague' },
  { name: 'Warsaw', country: 'Poland', tz: 'Europe/Warsaw' },
  { name: 'Stockholm', country: 'Sweden', tz: 'Europe/Stockholm' },
  { name: 'Oslo', country: 'Norway', tz: 'Europe/Oslo' },
  { name: 'Copenhagen', country: 'Denmark', tz: 'Europe/Copenhagen' },
  { name: 'Helsinki', country: 'Finland', tz: 'Europe/Helsinki' },
  { name: 'Athens', country: 'Greece', tz: 'Europe/Athens' },
  { name: 'Bucharest', country: 'Romania', tz: 'Europe/Bucharest' },
  { name: 'Kyiv', country: 'Ukraine', tz: 'Europe/Kyiv', aliases: ['Kiev'] },
  { name: 'Moscow', country: 'Russia', tz: 'Europe/Moscow' },
  { name: 'Reykjavik', country: 'Iceland', tz: 'Atlantic/Reykjavik' },

  // — Africa —
  { name: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo' },
  { name: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos' },
  { name: 'Nairobi', country: 'Kenya', tz: 'Africa/Nairobi' },
  { name: 'Johannesburg', country: 'South Africa', tz: 'Africa/Johannesburg' },
  { name: 'Cape Town', country: 'South Africa', tz: 'Africa/Johannesburg' },
  { name: 'Casablanca', country: 'Morocco', tz: 'Africa/Casablanca' },
  { name: 'Accra', country: 'Ghana', tz: 'Africa/Accra' },
  { name: 'Addis Ababa', country: 'Ethiopia', tz: 'Africa/Addis_Ababa' },

  // — Americas —
  { name: 'New York', country: 'United States', tz: 'America/New_York', aliases: ['NYC', 'New York City'] },
  { name: 'Boston', country: 'United States', tz: 'America/New_York' },
  { name: 'Washington', country: 'United States', tz: 'America/New_York', aliases: ['DC', 'Washington DC'] },
  { name: 'Atlanta', country: 'United States', tz: 'America/New_York' },
  { name: 'Miami', country: 'United States', tz: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', tz: 'America/Toronto' },
  { name: 'Montreal', country: 'Canada', tz: 'America/Toronto' },
  { name: 'Chicago', country: 'United States', tz: 'America/Chicago' },
  { name: 'Dallas', country: 'United States', tz: 'America/Chicago' },
  { name: 'Houston', country: 'United States', tz: 'America/Chicago' },
  { name: 'Austin', country: 'United States', tz: 'America/Chicago' },
  { name: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City' },
  { name: 'Denver', country: 'United States', tz: 'America/Denver' },
  { name: 'Phoenix', country: 'United States', tz: 'America/Phoenix' },
  { name: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles', aliases: ['LA'] },
  { name: 'San Francisco', country: 'United States', tz: 'America/Los_Angeles', aliases: ['SF', 'Bay Area', 'Silicon Valley'] },
  { name: 'Seattle', country: 'United States', tz: 'America/Los_Angeles' },
  { name: 'Vancouver', country: 'Canada', tz: 'America/Vancouver' },
  { name: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo', aliases: ['Sao Paulo'] },
  { name: 'Rio de Janeiro', country: 'Brazil', tz: 'America/Sao_Paulo', aliases: ['Rio'] },
  { name: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires' },
  { name: 'Santiago', country: 'Chile', tz: 'America/Santiago' },
  { name: 'Bogotá', country: 'Colombia', tz: 'America/Bogota', aliases: ['Bogota'] },
  { name: 'Lima', country: 'Peru', tz: 'America/Lima' },
  { name: 'Honolulu', country: 'United States', tz: 'Pacific/Honolulu', aliases: ['Hawaii'] },
  { name: 'Anchorage', country: 'United States', tz: 'America/Anchorage', aliases: ['Alaska'] },

  // — Oceania —
  { name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', tz: 'Australia/Melbourne' },
  { name: 'Brisbane', country: 'Australia', tz: 'Australia/Brisbane' },
  { name: 'Perth', country: 'Australia', tz: 'Australia/Perth' },
  { name: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland', aliases: ['NZ'] },
  { name: 'Wellington', country: 'New Zealand', tz: 'Pacific/Auckland' },
  { name: 'Suva', country: 'Fiji', tz: 'Pacific/Fiji', aliases: ['Fiji'] },

  // — UTC —
  { name: 'UTC', country: 'Coordinated Universal Time', tz: 'UTC', aliases: ['GMT', 'Zulu'] },
];

/** Nicely-cased display name for a zone: curated name if known, else the leaf of the IANA id. */
export function displayName(tz: string): string {
  const city = CITIES.find((c) => c.tz === tz);
  if (city) return city.name;
  const leaf = tz.split('/').pop() || tz;
  return leaf.replace(/_/g, ' ');
}

/** Country/subtitle for a zone, else its raw IANA id. */
export function zoneSubtitle(tz: string): string {
  const city = CITIES.find((c) => c.tz === tz);
  return city ? city.country : tz;
}

/**
 * Search curated cities first (prefix matches ranked above substring matches),
 * then fall back to any raw IANA zone id that contains the query. Zones already
 * surfaced by a curated city are not repeated.
 */
export function searchZones(query: string, rawZones: string[] = [], limit = 8): ZoneResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const seen = new Set<string>();
  const scored: Array<{ r: ZoneResult; score: number }> = [];

  for (const c of CITIES) {
    const terms = [c.name, c.country, ...(c.aliases || [])].map((t) => t.toLowerCase());
    const nameHit = terms.some((t) => t.startsWith(q));
    const partHit = nameHit || terms.some((t) => t.includes(q)) || c.tz.toLowerCase().includes(q);
    if (!partHit) continue;
    // First curated city per tz wins its slot; extra cities on the same tz still
    // score so e.g. "hanoi" surfaces even though HCM owns the tz slot.
    if (seen.has(c.tz)) continue;
    seen.add(c.tz);
    scored.push({ r: { tz: c.tz, label: c.name, sub: c.country }, score: nameHit ? 0 : 1 });
  }

  scored.sort((a, b) => a.score - b.score);
  const results = scored.map((s) => s.r);

  if (results.length < limit) {
    for (const z of rawZones) {
      if (results.length >= limit) break;
      if (seen.has(z)) continue;
      if (z.toLowerCase().includes(q)) {
        seen.add(z);
        results.push({ tz: z, label: displayName(z), sub: z });
      }
    }
  }

  return results.slice(0, limit);
}
