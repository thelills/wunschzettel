const TAG = 'dein-wunsch-21'

export function extractAsin(url) {
  if (!url) return null
  return url.match(/(?:\/dp\/|\/gp\/(?:aw\/d|product)\/|\/product\/)([A-Z0-9]{10})/i)?.[1] || null
}

export function getAmazonUrl(asin) {
  return `https://www.amazon.de/dp/${asin}?tag=${TAG}`
}

// _AC_SX300_ ist das einzige Format das Amazon zuverlässig als <img src> erlaubt
export function getAmazonImageUrl(asin) {
  if (!asin) return null
  return `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01._AC_SX300_.jpg`
}

export function genAffiliateLink(url) {
  if (!url?.startsWith('http')) return { url: null, id: null, mon: false, asin: null }
  try {
    const u = new URL(url)
    if (/amazon\.(de|com|at|co\.uk)/i.test(u.hostname)) {
      const asin = extractAsin(url)
      return {
        url: asin ? `https://www.amazon.de/dp/${asin}?tag=${TAG}` : `${url.split('?')[0]}?tag=${TAG}`,
        id: 'amazon', mon: true, asin,
      }
    }
    if (/zalando\.(de|at)/i.test(u.hostname)) {
      return { url, id: 'zalando', mon: false, asin: null }
    }
  } catch {}
  return { url, id: 'generic', mon: false, asin: null }
}

// Produktdaten aus URL extrahieren — KEIN Proxy, KEIN Fetch, sofort
// Gibt Name aus URL-Slug, ASIN, Bild und Affiliate-Link zurück
export async function fetchProductData(url) {
  if (!url?.startsWith('http')) return null

  const asin = extractAsin(url)

  // Produktname aus URL-Slug extrahieren
  // Amazon-URLs: /ProduktName-Weitere-Details/dp/ASIN
  let name = ''
  try {
    const slugMatch = url.match(/amazon\.[a-z.]+\/([^/?#]+)\/(?:dp|gp)/i)
    if (slugMatch) {
      name = slugMatch[1]
        .replace(/[，,].*/, '')           // ab Unicode-Komma abschneiden
        .replace(/-/g, ' ')               // Bindestriche zu Leerzeichen
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100)
    }
  } catch {}

  if (!asin) return name ? { name, asin: null, imgUrl: null, affUrl: null } : null

  return {
    name,
    asin,
    imgUrl: getAmazonImageUrl(asin),
    affUrl: getAmazonUrl(asin),
  }
}
