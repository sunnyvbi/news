/**
 * URL and title normalization utilities for deduplication and clean presentation.
 */

export function normalizeCanonicalUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    // Remove UTM and analytics trackers
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "ocid",
      "ref",
      "source",
    ];
    for (const param of trackingParams) {
      url.searchParams.delete(param);
    }
    // Remove hash
    url.hash = "";
    // Remove trailing slash
    let clean = url.toString();
    if (clean.endsWith("/")) {
      clean = clean.slice(0, -1);
    }
    return clean;
  } catch {
    return urlStr.trim();
  }
}

export function normalizeTitle(title: string): string {
  if (!title) return "";
  return title
    .replace(/\s*-\s*[^-]+$/, "") // remove trailing " - Publisher Name"
    .replace(/\s*\|\s*[^|]+$/, "") // remove trailing " | Publisher Name"
    .replace(/[^\w\s]/gi, "")     // remove punctuation for matching
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function extractImageUrl(item: any): string | undefined {
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url;
  }
  if (item["media:content"]?.$?.url) {
    return item["media:content"].$.url;
  }
  if (item["media:thumbnail"]?.$?.url) {
    return item["media:thumbnail"].$.url;
  }

  // Check HTML content for <img> tag
  const content = item["content:encoded"] || item.content || item.summary || "";
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1] && !match[1].includes("feedburner") && !match[1].includes("statcounter")) {
    return match[1];
  }

  return undefined;
}
