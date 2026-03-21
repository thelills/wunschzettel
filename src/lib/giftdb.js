import { getAmazonUrl, getAmazonImageUrl } from './affiliate'

const TAG = 'dein-wunsch-21'

// Alle Produkte mit ASIN → automatisch amazon.de URLs + Bilder
export const GIFT_DB = {
  u_wedding:[
    {name:'KitchenAid Küchenmaschine 4,3L',price:399,cat:'Küche',note:'Das Hochzeitsgeschenk schlechthin — wird jahrzehntelang täglich benutzt.',asin:'B00BY57EIK',pop:true,group:true},
    {name:'Le Creuset Bräter 28cm Volcanic',price:289,cat:'Küche',note:'Kult-Bräter in der ikonischen Farbe — ein Leben lang.',asin:'B00008KCB9',group:true},
    {name:'Nespresso Vertuo Next',price:149,cat:'Küche',note:'Gemeinsam Kaffee genießen — täglich in Nutzung.',asin:'B07Q13QZ62',pop:true},
    {name:'Raclette-Grill für 8 Personen',price:89,cat:'Küche',note:'Für gesellige Abende — immer ein Volltreffer.',asin:'B07CWYC7QV'},
    {name:'WMF Messer-Set 6-teilig',price:149,cat:'Küche',note:'Gute Messer fehlen in jedem neuen Haushalt.',asin:'B000N5OK4K'},
    {name:'Instant Pot Duo 7-in-1',price:89,cat:'Küche',note:'Schnellkochtopf, Slow Cooker, Reiskocher — alles in einem.',asin:'B01NBKTPTS'},
  ],
  m_adult_mid:[
    {name:'Victorinox SwissChamp',price:55,cat:'Outdoor',note:'33 Funktionen, lebenslange Garantie.',asin:'B0002H9IXS',pop:true},
    {name:'Kindle Paperwhite (16 GB)',price:150,cat:'Technik',note:'Meistgekaufter E-Reader — wasserdicht, 12 Wochen Akku.',asin:'B09TMF6742',pop:true},
    {name:"De'Longhi Dedica Espresso",price:130,cat:'Küche',note:'Echter Espresso zuhause, schlankes Design.',asin:'B00S8AIMBE'},
    {name:'Ledergeldbörse slim RFID',price:35,cat:'Accessoires',note:'Schlank, hochwertig, zeitlos.',asin:'B07YTQTS8V'},
    {name:'Weber Smokey Joe Grill',price:79,cat:'Outdoor',note:'Der perfekte Balkon-Grill.',asin:'B00004RALF'},
    {name:'Whisky Tasting Set 4×5cl',price:40,cat:'Genuss',note:'Vier Single Malts zum Entdecken.',asin:'B07WQTJ8JQ'},
  ],
  m_adult_large:[
    {name:'Bose QuietComfort Earbuds II',price:179,cat:'Technik',note:'Bestes Noise-Cancelling auf dem Markt.',asin:'B0B4PSKCJW',pop:true},
    {name:'Garmin Forerunner 55',price:120,cat:'Sport',note:'GPS-Uhr für Läufer, 2 Wochen Akku.',asin:'B09BWXT51R'},
    {name:'JBL Charge 5',price:99,cat:'Technik',note:'Wasserdicht, 20h Akku, Powerbank.',asin:'B08WM2LNPB'},
    {name:'Philips Hue Starter Set',price:129,cat:'Smart Home',note:'Smart Lighting — Einstieg ins smarte Zuhause.',asin:'B07PRGLSMB'},
  ],
  f_adult_mid:[
    {name:'Diptyque Baies Kerze 190g',price:55,cat:'Zuhause',note:'Die meistgeschenkte Luxuskerze Europas.',asin:'B004E4QQ9Y',pop:true},
    {name:'Rituals Sakura Geschenkset',price:35,cat:'Beauty',note:'Beliebtestes Pflege-Geschenkset.',asin:'B077ZHWMLB',pop:true},
    {name:'Kindle Paperwhite (16 GB)',price:150,cat:'Technik',note:'Für Buchliebhaber — dünn, leicht, wasserdicht.',asin:'B09TMF6742'},
    {name:'Yoga-Matte Gaiam Premium',price:45,cat:'Sport',note:'Rutschfest, tolle Designs.',asin:'B0000DZFG5'},
    {name:'Leuchtturm1917 Notizbuch A5',price:22,cat:'Schreiben',note:'Das Lieblings-Notizbuch kreativer Menschen.',asin:'B002CVAU1Y'},
    {name:'Nespresso Vertuo Next',price:149,cat:'Küche',note:'Kaffeemaschine die wirklich einfach funktioniert.',asin:'B07Q13QZ62'},
  ],
  f_adult_large:[
    {name:'Dyson Airwrap Volumiser',price:349,cat:'Beauty',note:'Das beliebteste Haar-Styling-Tool weltweit.',asin:'B087KGXW3B',pop:true},
    {name:'Philips Lumea Advanced IPL',price:249,cat:'Beauty',note:'Langfristige Haarentfernung zuhause.',asin:'B075K7TVTV'},
    {name:'Le Creuset Cocotte 20cm',price:180,cat:'Küche',note:'Ikonischer Gusseisen-Topf — ein Leben lang.',asin:'B00008KCB9'},
    {name:'KitchenAid Handmixer 5-Gang',price:89,cat:'Küche',note:'Kultgerät für Hobbybäcker.',asin:'B000G0KJJ4'},
  ],
  u_teen_mid:[
    {name:'JBL Clip 4',price:49,cat:'Technik',note:'Klein, laut, wasserdicht — ideal für unterwegs.',asin:'B08PH5LSVK',pop:true},
    {name:'Polaroid Now Kamera',price:89,cat:'Foto',note:'Echte Sofortfotos — echter Spaß.',asin:'B08464QCH7'},
    {name:'Spotify Geschenkkarte €30',price:30,cat:'Musik',note:'Lieblingsgeschenk für Teenager.',asin:'B01DMXKFAU'},
    {name:'Anker PowerBank 10.000mAh',price:28,cat:'Technik',note:'Immer Akku haben — schlankes Design.',asin:'B01MFG543L'},
  ],
  u_young_mid:[
    {name:'AirTag 4er-Pack',price:99,cat:'Technik',note:'Schlüssel, Portemonnaie & Koffer nie wieder verlieren.',asin:'B09335SNKP',pop:true},
    {name:'Anker PowerBank 20.000mAh',price:45,cat:'Technik',note:'Lädt Handy mehrfach auf.',asin:'B01MFG543L'},
    {name:'JBL Charge 5',price:99,cat:'Technik',note:'Wasserdicht, 20h Akku.',asin:'B08WM2LNPB'},
    {name:'Kindle Paperwhite (16 GB)',price:150,cat:'Technik',note:'Für lange Reisen und kurze Pausen.',asin:'B09TMF6742'},
  ],
  u_adult_mid:[
    {name:'Kindle Paperwhite (16 GB)',price:150,cat:'Technik',note:'Für fast jeden Buchliebhaber.',asin:'B09TMF6742',pop:true},
    {name:'JBL Charge 5',price:99,cat:'Technik',note:'Wasserdicht, 20h Akku.',asin:'B08WM2LNPB'},
    {name:'Nespresso Vertuo Next',price:149,cat:'Küche',note:'Für Kaffeeliebhaber.',asin:'B07Q13QZ62'},
    {name:'Diptyque Baies Kerze',price:55,cat:'Zuhause',note:'Die meistgeschenkte Luxuskerze.',asin:'B004E4QQ9Y'},
  ],
  u_senior_mid:[
    {name:'Kindle Paperwhite (16 GB)',price:150,cat:'Technik',note:'Große Schrift einstellbar — ideal für Vielleser.',asin:'B09TMF6742',pop:true},
    {name:'Echo Dot 5. Generation',price:55,cat:'Technik',note:'Alexa für Musik, Nachrichten und Smart Home.',asin:'B09B93ZDG4'},
    {name:'Ronnefeldt Tee-Geschenkbox',price:45,cat:'Genuss',note:'Premium-Tee-Sortiment für Kenner.',asin:'B00DQ0HWSM'},
    {name:'Philips Sonicare Zahnbürste',price:49,cat:'Gesundheit',note:'Elektrische Zahnbürste — täglich nützlich.',asin:'B07GZKTTLQ'},
  ],
}

// Mapping: Anlass + Alter + Geschlecht → Segment
export function getSegment({ age = 30, gender = 'u', occasion = 'birthday' }) {
  if (occasion === 'wedding') return 'u_wedding'
  const g = ['m','f'].includes(gender) ? gender : 'u'
  if (age < 16) return 'u_teen_mid'
  if (age < 26) return 'u_young_mid'
  if (age > 70) return 'u_senior_mid'
  const sizeKey = age > 50 ? 'large' : 'mid'
  const key = `${g}_adult_${sizeKey}`
  return GIFT_DB[key] ? key : `u_adult_mid`
}

// Vorschläge mit fertigen amazon.de Links + Bildern
export function getSuggestions({ age, gender, occasion, budgetMax = 999 }) {
  const seg = getSegment({ age, gender, occasion })
  const items = GIFT_DB[seg] || GIFT_DB['u_adult_mid']
  return items
    .filter(i => i.price <= budgetMax)
    .map(i => ({
      name: i.name,
      price: i.price,
      note: i.note,
      cat: i.cat,
      asin: i.asin,
      popular: i.pop || false,
      group: i.group || false,
      // Korrekte amazon.de Affiliate-URLs
      affUrl: i.asin ? getAmazonUrl(i.asin) : null,
      imgUrl: i.asin ? getAmazonImageUrl(i.asin) : null,
    }))
}
