const TAG = import.meta.env.VITE_AMAZON_TAG || 'dein-wunsch-21'

// Amazon.de product image — mehrere Fallbacks
export function getAmazonImageUrl(asin) {
  if (!asin) return null
  // Primär: Amazon DE CDN (funktioniert zuverlässig)
  return `https://ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&Format=_SL250_&ID=AsinImage&MarketPlace=DE&ServiceVersion=20070822&WS=1&tag=${TAG}`
}

// Fallback-Bild wenn Amazon-Bild nicht lädt
export function getAmazonFallbackImg(asin) {
  return `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`
}

export function extractAsin(url) {
  return url?.match(/\/dp\/([A-Z0-9]{10})/i)?.[1] || null
}

// Korrekte Amazon.de Affiliate-URL für ein ASIN
export function getAmazonUrl(asin) {
  return `https://www.amazon.de/dp/${asin}?tag=${TAG}`
}

export function genAffiliateLink(url) {
  if (!url?.startsWith('http')) return { url: null, id: null, mon: false }
  try {
    const u = new URL(url)
    if (/amazon\.(de|com|at|co\.uk)/i.test(u.hostname)) {
      const asin = extractAsin(url)
      const affUrl = asin
        ? `https://www.amazon.de/dp/${asin}?tag=${TAG}`
        : `${url.split('?')[0]}?tag=${TAG}`
      return { url: affUrl, id: 'amazon', mon: true }
    }
    if (/zalando\.(de|at)/i.test(u.hostname)) {
      return { url: `https://www.awin1.com/cread.php?awinaffid=YOUR_ID&awinmid=14158&ued=${encodeURIComponent(url)}`, id: 'zalando', mon: true }
    }
  } catch {}
  return { url, id: 'generic', mon: false }
}
