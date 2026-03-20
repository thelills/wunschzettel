const TAG = 'wunschzettel-21'

export const GIFT_DB = {
  u_wedding:[
    {name:'KitchenAid Küchenmaschine 4,3L',price:399,cat:'Küche',note:'Das Hochzeitsgeschenk. Wird jahrzehntelang täglich benutzt.',asin:'B00BY57EIK',pop:true,group:true},
    {name:'Le Creuset Bräter 28cm Volcanic',price:289,cat:'Küche',note:'Kult-Bräter in der ikonischen Farbe — ein Leben lang.',asin:'B00008KCB9',group:true},
    {name:'Nespresso Vertuo Next',price:149,cat:'Küche',note:'Gemeinsam Kaffee genießen — täglich in Nutzung.',asin:'B07Q13QZ62',pop:true},
    {name:'Raclette-Grill für 8 Personen',price:89,cat:'Küche',note:'Für gesellige Abende — immer ein Volltreffer.',asin:'B07CWYC7QV'},
    {name:'WMF Messer-Set 6-teilig',price:149,cat:'Küche',note:'Gute Messer fehlen in jedem neuen Haushalt.',asin:'B000N5OK4K'},
    {name:'Instant Pot Duo 7-in-1',price:89,cat:'Küche',note:'Schnellkochtopf, Slow Cooker, Reiskocher — alles in einem.',asin:'B01NBKTPTS'},
  ],
  m_adult_mid:[
    {name:'Victorinox SwissChamp',price:55,cat:'Outdoor',note:'33 Funktionen, lebenslange Garantie.',asin:'B0002H9IXS',pop:true},
    {name:'Whisky Tasting Set 4×5cl',price:40,cat:'Genuss',note:'Vier Single Malts zum Entdecken.',asin:'B07WQTJ8JQ'},
    {name:'Kindle Paperwhite',price:150,cat:'Technik',note:'Meistgekauftes E-Book-Reader.',asin:'B09TMF6742',pop:true},
    {name:'Ledergeldbörse slim RFID',price:35,cat:'Accessoires',note:'Schlank, hochwertig, zeitlos.',asin:'B07YTQTS8V'},
    {name:'Weber Smokey Joe Grill',price:79,cat:'Outdoor',note:'Der perfekte Balkon-Grill.',asin:'B00004RALF'},
    {name:"De'Longhi Dedica Espresso",price:130,cat:'Küche',note:'Echter Espresso zuhause.',asin:'B00S8AIMBE'},
  ],
  m_adult_large:[
    {name:'Bose QuietComfort Earbuds II',price:179,cat:'Technik',note:'Bestes Noise-Cancelling auf dem Markt.',asin:'B0B4PSKCJW',pop:true},
    {name:'Garmin Forerunner 55',price:120,cat:'Sport',note:'Einsteiger-GPS-Uhr für Läufer.',asin:'B09BWXT51R'},
    {name:'JBL Charge 5',price:99,cat:'Technik',note:'Wasserdicht, 20h Akku.',asin:'B08WM2LNPB'},
  ],
  f_adult_mid:[
    {name:'Diptyque Baies Kerze 190g',price:55,cat:'Zuhause',note:'Die meistgeschenkte Luxuskerze Europas.',asin:'B004E4QQ9Y',pop:true},
    {name:'Rituals Sakura Geschenkset',price:35,cat:'Beauty',note:'Beliebtestes Pflege-Set.',asin:'B077ZHWMLB',pop:true},
    {name:'Nespresso Vertuo Next',price:149,cat:'Küche',note:'Kaffeemaschine die wirklich einfach funktioniert.',asin:'B07Q13QZ62'},
    {name:'Yoga-Matte Gaiam Premium',price:45,cat:'Sport',note:'Rutschfest, schöne Designs.',asin:'B0000DZFG5'},
    {name:'Leuchtturm1917 Notizbuch A5',price:22,cat:'Bücher',note:'Das Lieblings-Notizbuch kreativer Menschen.',asin:'B002CVAU1Y'},
    {name:'Kindle Paperwhite',price:150,cat:'Technik',note:'Für Buchliebhaber.',asin:'B09TMF6742'},
  ],
  f_adult_large:[
    {name:'Dyson Airwrap Volumiser',price:299,cat:'Beauty',note:'Das beliebteste Haar-Styling-Tool.',asin:'B087KGXW3B',pop:true},
    {name:'Philips Lumea IPL',price:299,cat:'Beauty',note:'Langfristige Haarentfernung zuhause.',asin:'B075K7TVTV'},
    {name:'Le Creuset Cocotte 20cm',price:180,cat:'Küche',note:'Ikonischer Gusseisen-Topf.',asin:'B00008KCB9'},
  ],
  u_teen_mid:[
    {name:'JBL Clip 4',price:49,cat:'Technik',note:'Klein, laut, wasserdicht.',asin:'B08PH5LSVK',pop:true},
    {name:'Polaroid Now Kamera',price:89,cat:'Foto',note:'Echte Fotos statt Instagram.',asin:'B08464QCH7'},
    {name:'Spotify Geschenkkarte €30',price:30,cat:'Musik',note:'Lieblingsgeschenk für Teenager.',asin:'B01DMXKFAU'},
  ],
  u_young_mid:[
    {name:'AirTag 4er-Pack',price:89,cat:'Technik',note:'Schlüssel & Koffer nie verlieren.',asin:'B09335SNKP',pop:true},
    {name:'Anker PowerBank 20.000mAh',price:35,cat:'Technik',note:'Lädt alles mehrfach auf.',asin:'B01MFG543L'},
    {name:'JBL Charge 5',price:99,cat:'Technik',note:'Wasserdicht, 20h Akku.',asin:'B08WM2LNPB'},
  ],
  u_adult_mid:[
    {name:'Kindle Paperwhite',price:150,cat:'Technik',note:'Passt für fast jeden Buchliebhaber.',asin:'B09TMF6742',pop:true},
    {name:'JBL Charge 5',price:99,cat:'Technik',note:'Wasserdicht, 20h Akku.',asin:'B08WM2LNPB'},
    {name:'Nespresso Vertuo Next',price:149,cat:'Küche',note:'Für Kaffeeliebhaber.',asin:'B07Q13QZ62'},
    {name:'Diptyque Baies Kerze',price:55,cat:'Zuhause',note:'Die meistgeschenkte Luxuskerze.',asin:'B004E4QQ9Y'},
  ],
  u_senior_mid:[
    {name:'Kindle Paperwhite',price:150,cat:'Technik',note:'Große Schrift einstellbar.',asin:'B09TMF6742',pop:true},
    {name:'Echo Dot 5. Generation',price:55,cat:'Technik',note:'Alexa für Musik und Nachrichten.',asin:'B09B93ZDG4'},
    {name:'Ronnefeldt Tee-Geschenkbox',price:45,cat:'Genuss',note:'Premium-Tee-Sortiment.',asin:'B00DQ0HWSM'},
  ],
}

function getSegment(age, gender, budgetMax, occasion) {
  if (occasion === 'wedding') return 'u_wedding'
  let ag = age <= 17 ? 'teen' : age <= 29 ? 'young' : age <= 44 ? 'adult' : age <= 59 ? 'mid' : 'senior'
  const budget = budgetMax <= 75 ? 'mid' : 'large'
  const g = gender === 'm' ? 'm' : gender === 'f' ? 'f' : 'u'
  const k = `${g}_${ag}_${budget}`
  return GIFT_DB[k] ? k : GIFT_DB[`u_${ag}_${budget}`] ? `u_${ag}_${budget}` : 'u_adult_mid'
}

export function getSuggestions({ age = 35, gender = 'u', budgetMax = 150, occasion = '' }) {
  const key = getSegment(age, gender, budgetMax, occasion)
  return (GIFT_DB[key] || GIFT_DB.u_adult_mid)
    .filter(p => p.price <= budgetMax * 1.4)
    .map(p => ({
      ...p,
      affUrl: p.asin ? `https://www.amazon.de/dp/${p.asin}?tag=${TAG}` : null,
      imgUrl: p.asin ? `https://images-na.ssl-images-amazon.com/images/P/${p.asin}.01.LZZZZZZZ.jpg` : null,
    }))
}
