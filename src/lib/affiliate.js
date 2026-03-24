const TAG = 'dein-wunsch-21'

// Amazon.de direktes Produktbild via ASIN
// Funktioniert ohne CORS-Probleme als <img src>
export function getAmazonImageUrl(asin) {
  if (!asin) return null
  // Direkte Bild-URL — funktioniert zuverlässig in Browsern
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL300_.jpg`
}

export function extractAsin(url) {
  if (!url) return null
  // /dp/ASIN oder /gp/product/ASIN
  return url.match(/(?:\/dp\/|\/gp\/product\/|\/product\/)([A-Z0-9]{10})/i)?.[1] || null
}

export function getAmazonUrl(asin) {
  return `https://www.amazon.de/dp/${asin}?tag=${TAG}`
}

export function genAffiliateLink(url) {
  if (!url?.startsWith('http')) return { url: null, id: null, mon: false }
  try {
    const u = new URL(url)
    if (/amazon\.(de|com|at|co\.uk)/i.test(u.hostname)) {
      const asin = extractAsin(url)
      return {
        url: asin
          ? `https://www.amazon.de/dp/${asin}?tag=${TAG}`
          : `${url.split('?')[0]}?tag=${TAG}`,
        id: 'amazon',
        mon: true,
        asin,
      }
    }
    if (/zalando\.(de|at)/i.test(u.hostname)) {
      return { url, id: 'zalando', mon: false } // AWIN ID noch nicht gesetzt
    }
  } catch {}
  return { url, id: 'generic', mon: false }
}

// Produktdaten aus Amazon-URL extrahieren — kein Proxy nötig
// Gibt ASIN, Name-Hinweis und Affiliate-URL zurück
export async function fetchProductData(url) {
  const asin = extractAsin(url)
  if (!asin) return null

  // Produktname aus Amazon via Open Graph — über allorigins proxy
  // Amazon erlaubt allorigins nicht mehr direkt, nutze daher ASIN-Lookup
  // Fallback: Titel aus URL-Slug extrahieren
  try {
    // Versuche den Slug aus der URL zu lesen: /dp/ASIN/ref.../Produkt-Name
    const slugMatch = url.match(/\/([^/?]+)\/dp\/[A-Z0-9]{10}/i)
    if (slugMatch) {
      const name = slugMatch[1]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .slice(0, 80)
      return { name, asin, affUrl: getAmazonUrl(asin), imgUrl: getAmazonImageUrl(asin) }
    }
  } catch {}

  // Letzter Fallback: nur ASIN bekannt
  return { name: '', asin, affUrl: getAmazonUrl(asin), imgUrl: getAmazonImageUrl(asin) }
}
