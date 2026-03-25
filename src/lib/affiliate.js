const TAG = 'dein-wunsch-21'

export function extractAsin(url) {
  if (!url) return null
  // Alle Amazon URL-Formate: /dp/, /gp/product/, /gp/aw/d/, /product/
  return url.match(/(?:\/dp\/|\/gp\/(?:aw\/d|product)\/|\/product\/)([A-Z0-9]{10})/i)?.[1] || null
}

export function getAmazonUrl(asin) {
  return `https://www.amazon.de/dp/${asin}?tag=${TAG}`
}

// Amazon-Produktbild via ASIN — _AC_ Format funktioniert zuverlässig als <img src>
export function getAmazonImageUrl(asin) {
  if (!asin) return null
  // _AC_SX300_ = Amazon CDN mit 300px Breite, kein CORS-Problem
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
        id: 'amazon',
        mon: true,
        asin,
      }
    }
    if (/zalando\.(de|at)/i.test(u.hostname)) {
      return { url, id: 'zalando', mon: false, asin: null }
    }
  } catch {}
  return { url, id: 'generic', mon: false, asin: null }
}

// Produktdaten aus Amazon-URL holen via allorigins proxy
// Extrahiert: Titel, Preis, Bild-URL (echte m.media-amazon.com URL)
export async function fetchProductData(url) {
  const asin = extractAsin(url)
  if (!asin) return null

  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.amazon.de/dp/${asin}`)}`
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) })
    const { contents } = await res.json()

    if (!contents) return { asin, name: '', affUrl: getAmazonUrl(asin), imgUrl: null }

    // Titel aus og:title oder <title>
    const title = (
      contents.match(/property="og:title"\s+content="([^"]+)"/)?.[1] ||
      contents.match(/content="([^"]+)"\s+property="og:title"/)?.[1] ||
      contents.match(/<title>([^<]+)<\/title>/i)?.[1] ||
      ''
    ).replace(/\s*[|:–\-]\s*(Amazon\.de|Amazon).*$/i, '').trim().slice(0, 100)

    // Echte Bild-URL aus m.media-amazon.com (zuverlässig!)
    const imgMatch = contents.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[^"'\s]+\.jpg/)?.[0]
    const imgUrl = imgMatch ? imgMatch.replace(/\._[A-Z0-9_,]+_\.jpg/, '._SL300_.jpg') : null

    // Preis
    const priceMatch = contents.match(/(\d+[,\.]\d{2})\s*€|€\s*(\d+[,\.]\d{2})/)
    const price = priceMatch
      ? parseFloat((priceMatch[1] || priceMatch[2]).replace(',', '.'))
      : null

    return {
      asin,
      name: title,
      price,
      imgUrl,
      affUrl: getAmazonUrl(asin),
    }
  } catch (e) {
    console.warn('fetchProductData failed:', e.message)
    // Fallback: nur ASIN aus URL extrahieren
    const slugMatch = url.match(/\/([^/?]+)\/dp\/[A-Z0-9]{10}/i)
    const name = slugMatch
      ? slugMatch[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 80)
      : ''
    return { asin, name, price: null, imgUrl: null, affUrl: getAmazonUrl(asin) }
  }
}
