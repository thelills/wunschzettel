const TAG = import.meta.env.VITE_AMAZON_TAG || 'dein-wunsch-21'

export function getAmazonImageUrl(asin) {
  return asin ? `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg` : null
}

export function extractAsin(url) {
  return url?.match(/\/dp\/([A-Z0-9]{10})/i)?.[1] || null
}

export function genAffiliateLink(url) {
  if (!url?.startsWith('http')) return { url: null, id: null, mon: false }
  try {
    const u = new URL(url)
    if (/amazon\.(de|com|at)/i.test(u.hostname)) {
      const asin = extractAsin(url)
      return { url: asin ? `https://www.amazon.de/dp/${asin}?tag=${TAG}` : `${url.split('?')[0]}?tag=${TAG}`, id: 'amazon', mon: true }
    }
    if (/zalando\.(de|at)/i.test(u.hostname)) {
      return { url: `https://www.awin1.com/cread.php?awinaffid=YOUR_ID&awinmid=14158&ued=${encodeURIComponent(url)}`, id: 'zalando', mon: true }
    }
  } catch {}
  return { url, id: 'generic', mon: false }
}
