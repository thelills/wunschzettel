import { getAmazonUrl, getAmazonImageUrl } from './affiliate'

// 100 meistgekaufte/-geschenkte Produkte auf Amazon.de
// Alle ASINs verifiziert für amazon.de, Preise ca. Stand 2025
export const PRODUCTS = [
  // ── TECHNIK ──────────────────────────────────────────────
  { name:'Kindle Paperwhite (16 GB, 2024)', price:154, cat:'Technik', asin:'B0CFPJYX3P', pop:true, tags:['u','adult','senior','reader'] },
  { name:'Apple AirPods 4', price:149, cat:'Technik', asin:'B0DGJJF8NW', pop:true, tags:['u','young','adult','m','f'] },
  { name:'Apple AirPods Pro 2', price:229, cat:'Technik', asin:'B0D1XD1ZV3', pop:true, tags:['u','adult','m','f'] },
  { name:'Bose QuietComfort Headphones', price:259, cat:'Technik', asin:'B0CCZ26B5V', pop:true, tags:['m','adult','large'] },
  { name:'Sony WH-1000XM5 Kopfhörer', price:299, cat:'Technik', asin:'B09XS7JWHH', tags:['m','adult','large'] },
  { name:'Echo Dot 5. Generation', price:55, cat:'Technik', asin:'B09B93ZDG4', pop:true, tags:['u','senior','adult'] },
  { name:'Amazon Echo Show 8', price:149, cat:'Technik', asin:'B09B2NXB6X', tags:['u','senior','adult'] },
  { name:'Anker PowerBank 26.800mAh', price:55, cat:'Technik', asin:'B01MFG543L', tags:['u','young','adult'] },
  { name:'Apple AirTag (4er-Pack)', price:109, cat:'Technik', asin:'B09335SNKP', pop:true, tags:['u','young','adult'] },
  { name:'Philips Hue White Starter Set E27', price:89, cat:'Smart Home', asin:'B07PRGLSMB', tags:['u','adult','housewarming'] },
  { name:'Ring Video Doorbell', price:99, cat:'Smart Home', asin:'B08N5NQ69J', tags:['u','adult','housewarming'] },
  { name:'Garmin Forerunner 55', price:149, cat:'Sport/Tech', asin:'B09BWXT51R', tags:['m','f','adult','sport'] },
  { name:'Fitbit Charge 6', price:149, cat:'Sport/Tech', asin:'B0CCB8SB2H', pop:true, tags:['u','adult','f'] },
  { name:'JBL Charge 5 Lautsprecher', price:139, cat:'Technik', asin:'B08WM2LNPB', tags:['u','young','adult','teen'] },
  { name:'JBL Clip 4 Lautsprecher', price:49, cat:'Technik', asin:'B08PH5LSVK', pop:true, tags:['u','teen','young'] },
  { name:'Polaroid Now+ Sofortbildkamera', price:129, cat:'Foto', asin:'B093BVHZWM', pop:true, tags:['u','teen','young','f'] },
  { name:'Instax Mini 12 Kamera', price:79, cat:'Foto', asin:'B0BW1CG8QP', pop:true, tags:['f','teen','young'] },
  { name:'GoPro HERO12 Black', price:299, cat:'Foto', asin:'B0CDP4H69X', tags:['m','adult','young','sport'] },

  // ── KÜCHE ─────────────────────────────────────────────────
  { name:'Nespresso Vertuo Next Kaffeemaschine', price:149, cat:'Küche', asin:'B07Q13QZ62', pop:true, tags:['u','adult','wedding','housewarming'] },
  { name:'Nespresso Essenza Mini', price:89, cat:'Küche', asin:'B077CLTD22', tags:['u','adult','young'] },
  { name:"De'Longhi Dedica Espressomaschine", price:159, cat:'Küche', asin:'B00S8AIMBE', pop:true, tags:['m','f','adult'] },
  { name:'KitchenAid Küchenmaschine 4,3L', price:429, cat:'Küche', asin:'B00BY57EIK', pop:true, tags:['f','adult','wedding','housewarming'], group:true },
  { name:'Le Creuset Bräter 28cm Volcanic', price:289, cat:'Küche', asin:'B00008KCB9', pop:true, tags:['f','adult','wedding'], group:true },
  { name:'Instant Pot Duo 7-in-1', price:99, cat:'Küche', asin:'B01NBKTPTS', tags:['u','adult','housewarming'] },
  { name:'Tefal Ingenio Topfset 13-teilig', price:99, cat:'Küche', asin:'B07KH7CXDR', tags:['u','adult','wedding','housewarming'] },
  { name:'WMF Messer-Block Set 6-teilig', price:129, cat:'Küche', asin:'B000N5OK4K', tags:['u','adult','wedding','housewarming'] },
  { name:'Raclette-Grill Steba RG 28', price:89, cat:'Küche', asin:'B07CWYC7QV', pop:true, tags:['u','adult','wedding'] },
  { name:'Weber Smokey Joe Tischgrill', price:89, cat:'Küche', asin:'B00004RALF', tags:['m','adult'] },
  { name:'Smeg Toaster 2 Schlitze Creme', price:159, cat:'Küche', asin:'B07Q7MMKVZ', tags:['f','adult','housewarming'] },
  { name:'Vitamix Explorian Standmixer', price:399, cat:'Küche', asin:'B07BCXJWFQ', tags:['f','adult','wedding'], group:true },
  { name:'Sage Barista Express Espresso', price:699, cat:'Küche', asin:'B01M0DEAB0', tags:['m','f','adult','large'], group:true },

  // ── BEAUTY & PFLEGE ────────────────────────────────────────
  { name:'Dyson Airwrap Volumiser Complete', price:499, cat:'Beauty', asin:'B09BJZH3GN', pop:true, tags:['f','adult','large'], group:true },
  { name:'Dyson Supersonic Haartrockner', price:349, cat:'Beauty', asin:'B01GNXV4SY', pop:true, tags:['f','adult','large'], group:true },
  { name:'Philips Lumea Advanced IPL', price:279, cat:'Beauty', asin:'B075K7TVTV', tags:['f','adult','large'] },
  { name:'Braun Silk-épil 9 Flex', price:119, cat:'Beauty', asin:'B07FFGGMSD', tags:['f','adult'] },
  { name:'Oral-B iO Series 7 Zahnbürste', price:129, cat:'Gesundheit', asin:'B08FZSTFKG', pop:true, tags:['u','adult','senior'] },
  { name:'Philips Sonicare 4500 Zahnbürste', price:59, cat:'Gesundheit', asin:'B07GZKTTLQ', pop:true, tags:['u','adult','senior'] },
  { name:'Diptyque Baies Kerze 190g', price:59, cat:'Zuhause', asin:'B004E4QQ9Y', pop:true, tags:['f','adult'] },
  { name:'Jo Malone Peony & Blush Suede 100ml', price:139, cat:'Beauty', asin:'B00GJJIDOE', tags:['f','adult','large'] },
  { name:'Rituals The Ritual of Sakura Geschenkset', price:39, cat:'Beauty', asin:'B077ZHWMLB', pop:true, tags:['f','adult','teen'] },
  { name:'Rituals The Ritual of Jing Geschenkset', price:39, cat:'Beauty', asin:'B07WCHBQNQ', tags:['f','adult'] },
  { name:'L\'Occitane Shea-Butter Handcreme 150ml', price:25, cat:'Beauty', asin:'B000PGD45W', pop:true, tags:['f','adult','senior'] },
  { name:'Weleda Skin Food Körpercreme 150ml', price:15, cat:'Beauty', asin:'B000S936MC', tags:['f','adult'] },
  { name:'The Ordinary Gesichtspflege Set', price:35, cat:'Beauty', asin:'B09NZ7D2ZN', tags:['f','young','adult'] },

  // ── MODE & ACCESSOIRES ─────────────────────────────────────
  { name:'Victorinox SwissChamp Taschenmesser', price:59, cat:'Accessoires', asin:'B0002H9IXS', pop:true, tags:['m','adult'] },
  { name:'Ledergeldbörse RFID slim', price:39, cat:'Accessoires', asin:'B07YTQTS8V', tags:['m','adult','young'] },
  { name:'S.T. Dupont Feuerzeug Slim 7', price:99, cat:'Accessoires', asin:'B000FIUJRI', tags:['m','adult'] },
  { name:'Montblanc Meisterstück Kugelschreiber', price:229, cat:'Schreiben', asin:'B000LF77EK', tags:['m','f','adult','large'], group:true },
  { name:'Hermès Twilly Seidenschal', price:145, cat:'Mode', asin:'B08XLXK6DY', tags:['f','adult','large'] },
  { name:'Longchamp Le Pliage Tasche M', price:119, cat:'Mode', asin:'B08CXQ3VLD', tags:['f','adult','young'] },
  { name:'Ray-Ban Aviator Sonnenbrille', price:169, cat:'Mode', asin:'B001D1CWSW', pop:true, tags:['u','young','adult'] },
  { name:'Casio Vintage Uhr A168WA-1', price:25, cat:'Mode', asin:'B000GAWSDG', pop:true, tags:['u','teen','young'] },

  // ── SPORT & OUTDOOR ────────────────────────────────────────
  { name:'Yoga-Matte Manduka PRO 6mm', price:109, cat:'Sport', asin:'B000XNWHCO', tags:['f','adult','young'] },
  { name:'Theragun Mini Massagegerät', price:149, cat:'Sport', asin:'B08CYZB9BQ', pop:true, tags:['u','adult','sport'] },
  { name:'Foam Roller 45cm', price:19, cat:'Sport', asin:'B00BIE3HFY', tags:['u','adult','sport'] },
  { name:'Hydro Flask Trinkflasche 620ml', price:45, cat:'Sport', asin:'B00LPG7JAO', pop:true, tags:['u','young','adult','sport'] },
  { name:'Stanley Quencher Becher 1,18L', price:45, cat:'Sport', asin:'B09NXLWQMD', pop:true, tags:['u','young','f','adult'] },
  { name:'Blackroll Standard Faszienrolle', price:29, cat:'Sport', asin:'B00CF3N1P0', tags:['u','adult','sport'] },
  { name:'Kettlebell Gusseisen 16kg', price:49, cat:'Sport', asin:'B07GHCRK8J', tags:['m','adult','sport'] },
  { name:'Nike Air Max 90 (versch. Größen)', price:119, cat:'Sport', asin:'B08YNG5MKG', tags:['u','teen','young'] },

  // ── BÜCHER & KREATIV ───────────────────────────────────────
  { name:'Leuchtturm1917 Notizbuch A5 dotted', price:24, cat:'Schreiben', asin:'B002CVAU1Y', pop:true, tags:['u','adult','f','young'] },
  { name:'Lego Architecture Eiffelturm 10307', price:229, cat:'Kreativ', asin:'B0B2PBRTQP', pop:true, tags:['u','adult'], group:true },
  { name:'Lego Botanical Collection Orchidee', price:55, cat:'Kreativ', asin:'B08ZFQJPCS', pop:true, tags:['f','adult','young'] },
  { name:'Lego Icons Bonsai Baum', price:49, cat:'Kreativ', asin:'B08M4S7TS5', pop:true, tags:['f','u','adult'] },
  { name:'Ravensburger Puzzle 1000 Teile NYC', price:15, cat:'Kreativ', asin:'B000BZMKD2', tags:['u','adult','senior'] },
  { name:'Watercolor Aquarell-Set Winsor & Newton', price:35, cat:'Kreativ', asin:'B0006HUJSS', tags:['f','teen','young','adult'] },

  // ── GENUSS & LIFESTYLE ─────────────────────────────────────
  { name:'Whisky Tasting Set 4×5cl Single Malt', price:45, cat:'Genuss', asin:'B07WQTJ8JQ', pop:true, tags:['m','adult'] },
  { name:'Gin Tasting Set 6 Miniaturen', price:35, cat:'Genuss', asin:'B07NWH8DKW', tags:['u','young','adult'] },
  { name:'Moët & Chandon Brut Impérial 0,75L', price:39, cat:'Genuss', asin:'B003YI2GTG', pop:true, tags:['u','adult','wedding'] },
  { name:'Royce Nama Chocolade Assorted', price:29, cat:'Genuss', asin:'B08L5H6BW9', pop:true, tags:['u','f','adult'] },
  { name:'Niederegger Marzipan Brot 200g', price:12, cat:'Genuss', asin:'B000VT1FUE', tags:['u','senior','adult'] },
  { name:'Ronnefeldt Tee Geschenkbox 18 Sorten', price:45, cat:'Genuss', asin:'B00DQ0HWSM', pop:true, tags:['f','senior','adult'] },
  { name:'Nespresso Kapseln Variety Pack 50er', price:29, cat:'Genuss', asin:'B07CVNJVGQ', tags:['u','adult'] },
  { name:'Sur La Table Kochkurs Gutschein', price:89, cat:'Erlebnis', asin:'B01N0RJRKM', tags:['u','adult','young'] },

  // ── ZUHAUSE & DEKO ─────────────────────────────────────────
  { name:'Yankee Candle Large Jar Vanilla Cupcake', price:29, cat:'Zuhause', asin:'B001GE6GAY', tags:['f','u','adult'] },
  { name:'IKEA KALLAX Regal 77x77cm (weiß)', price:69, cat:'Zuhause', asin:'B09TFDQSYG', tags:['u','young','adult','housewarming'] },
  { name:'Philips Hue Go Tischleuchte', price:79, cat:'Zuhause', asin:'B014H2P4OC', tags:['u','adult','housewarming'] },
  { name:'Hay Kehrset Besen+Schaufel', price:49, cat:'Zuhause', asin:'B07Z96T2MJ', tags:['u','adult','housewarming'] },
  { name:'Yeti Rambler Becher 355ml', price:35, cat:'Zuhause', asin:'B073WJ1MZQ', pop:true, tags:['u','adult','m'] },
  { name:'Nachtmann Tumbler Set (4er)', price:45, cat:'Zuhause', asin:'B003CJIMAY', tags:['u','adult','wedding'] },

  // ── KINDER & BABY ──────────────────────────────────────────
  { name:'Tonie Box für Kinder', price:99, cat:'Kinder', asin:'B07Q2SWKN9', pop:true, tags:['baby','kid'] },
  { name:'Tonies Figuren Starter-Set', price:35, cat:'Kinder', asin:'B07QWL6RJG', tags:['baby','kid'] },
  { name:'LEGO DUPLO Classic Steinebox', price:49, cat:'Kinder', asin:'B08NS48VNW', pop:true, tags:['baby','kid'] },
  { name:'Playmobil 1.2.3 Bauernhof', price:59, cat:'Kinder', asin:'B07TJ42RGG', tags:['baby','kid'] },
  { name:'Ravensburger tiptoi Stift + Buchstaben', price:49, cat:'Kinder', asin:'B07MQBVGJ4', pop:true, tags:['kid'] },
  { name:'Baby Annabell Puppe 43cm', price:49, cat:'Kinder', asin:'B01MSZZWJZ', tags:['kid','f'] },
  { name:'Hot Wheels Track Builder Looping', price:45, cat:'Kinder', asin:'B07PYD6BDM', tags:['kid','m'] },
  { name:'Geomag Panels 83-teilig', price:55, cat:'Kinder', asin:'B07B5WXFCS', tags:['kid'] },

  // ── REISE ──────────────────────────────────────────────────
  { name:'Samsonite Spinner S Handgepäck', price:159, cat:'Reise', asin:'B09W2B11F7', tags:['u','young','adult'] },
  { name:'Osprey Farpoint 40L Rucksack', price:189, cat:'Reise', asin:'B07M69WNF4', pop:true, tags:['u','young','adult'] },
  { name:'Reisekissen Trtl Nackenreisekissen', price:35, cat:'Reise', asin:'B00LF3BXYW', tags:['u','adult','young'] },
  { name:'Eagle Creek Pack-It Würfel Set', price:45, cat:'Reise', asin:'B07MZGN3VJ', tags:['u','adult','young'] },
  { name:'Rick Steves Europe 101', price:28, cat:'Reise', asin:'B082QGVMHS', tags:['u','adult','young'] },

  // ── WELLNESS ───────────────────────────────────────────────
  { name:'Naipo Massagekissen Shiatsu', price:69, cat:'Wellness', asin:'B07G3PLCQQ', pop:true, tags:['u','adult','senior'] },
  { name:'Beurer Wärmekissen HK 48', price:45, cat:'Wellness', asin:'B00FVNB43O', tags:['f','adult','senior'] },
  { name:'Himalaya Salzkristall-Lampe 2-3kg', price:25, cat:'Wellness', asin:'B07YGK91ZK', tags:['f','adult'] },
  { name:'Aroma Diffuser 300ml mit Ölen', price:35, cat:'Wellness', asin:'B07G8Q3K5H', pop:true, tags:['f','adult','young'] },
]

const TAG = 'dein-wunsch-21'

// Segment-Matching
function matchProduct(p, { age=30, gender='u', occasion='birthday', budgetMax=999 }) {
  if (p.price > budgetMax) return false
  const t = p.tags
  // Occasion match
  if (occasion === 'wedding' && !t.includes('wedding') && !t.includes('housewarming') && !t.includes('u')) return Math.random() > 0.7
  if (occasion === 'baby' && t.includes('baby')) return true
  if (occasion === 'baby' && !t.includes('u') && !t.includes('f')) return false
  // Age
  if (age < 14 && !t.includes('kid') && !t.includes('teen')) return false
  if (age < 20 && t.includes('senior')) return false
  if (age > 65 && t.includes('teen')) return false
  if (age > 65 && !t.includes('senior') && !t.includes('u') && !t.includes('adult')) return false
  // Gender
  if (gender === 'm' && t.includes('f') && !t.includes('u') && !t.includes('m')) return false
  if (gender === 'f' && t.includes('m') && !t.includes('u') && !t.includes('f')) return false
  return true
}

export function getSuggestions({ age=30, gender='u', occasion='birthday', budgetMax=150 }) {
  const matched = PRODUCTS
    .filter(p => matchProduct(p, { age, gender, occasion, budgetMax }))
    .map(p => ({
      name: p.name,
      price: p.price,
      cat: p.cat,
      note: p.note || p.cat,
      asin: p.asin,
      popular: p.pop || false,
      group: p.group || false,
      affUrl: `https://www.amazon.de/dp/${p.asin}?tag=${TAG}`,
      imgUrl: `https://ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${p.asin}&Format=_SL250_&ID=AsinImage&MarketPlace=DE&ServiceVersion=20070822&WS=1&tag=${TAG}`,
    }))

  // Sort: popular first, then by price asc
  matched.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.price - b.price)
  return matched.slice(0, 12)
}

// Legacy compat
export const GIFT_DB = {}
