export interface FeedConfig {
  name: string;
  url: string;
  defaultCategory: string;
  website: string;
}

export const RSS_FEEDS: FeedConfig[] = [
  // 1. BBC News
  {
    name: "BBC News - World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    defaultCategory: "World News",
    website: "https://www.bbc.com/news",
  },
  {
    name: "BBC News - Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    defaultCategory: "Business",
    website: "https://www.bbc.com/news/business",
  },

  // 2. Reuters
  {
    name: "Reuters - Global Wire",
    url: "https://news.google.com/rss/search?q=when:24h+allinurl:reuters.com&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "Top Stories",
    website: "https://www.reuters.com",
  },

  // 3. CNBC
  {
    name: "CNBC - Markets & Trading",
    url: "https://news.google.com/rss/search?q=when:24h+allinurl:cnbc.com+markets&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "Trading",
    website: "https://www.cnbc.com/markets",
  },

  // 4. Bloomberg
  {
    name: "Bloomberg - Markets & Economy",
    url: "https://news.google.com/rss/search?q=when:24h+allinurl:bloomberg.com&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "Stock Market",
    website: "https://www.bloomberg.com",
  },

  // 5. Financial Times
  {
    name: "Financial Times - Global Markets",
    url: "https://news.google.com/rss/search?q=when:24h+allinurl:ft.com&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "Business",
    website: "https://www.ft.com",
  },

  // 6. CNN
  {
    name: "CNN - World News",
    url: "http://rss.cnn.com/rss/edition_world.rss",
    defaultCategory: "World News",
    website: "https://www.cnn.com",
  },

  // 7. The Guardian
  {
    name: "The Guardian - World",
    url: "https://www.theguardian.com/world/rss",
    defaultCategory: "World News",
    website: "https://www.theguardian.com",
  },
  {
    name: "The Guardian - Business & Economics",
    url: "https://www.theguardian.com/uk/business/rss",
    defaultCategory: "Business",
    website: "https://www.theguardian.com/business",
  },

  // 8. Moneycontrol
  {
    name: "Moneycontrol - Market Reports",
    url: "https://www.moneycontrol.com/rss/marketreports.xml",
    defaultCategory: "Trading",
    website: "https://www.moneycontrol.com",
  },

  // 9. Economic Times Markets
  {
    name: "Economic Times - Markets",
    url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    defaultCategory: "Stock Market",
    website: "https://economictimes.indiatimes.com/markets",
  },

  // 10. Investing.com
  {
    name: "Investing.com - Financial News",
    url: "https://www.investing.com/rss/news_25.rss",
    defaultCategory: "Trading",
    website: "https://www.investing.com",
  },

  // 11. TechCrunch
  {
    name: "TechCrunch - Startups & AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    defaultCategory: "Startups",
    website: "https://techcrunch.com",
  },

  // 12. Google News AI & Technology
  {
    name: "Google News - Artificial Intelligence",
    url: "https://news.google.com/rss/search?q=Artificial+Intelligence&hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "AI & Innovation",
    website: "https://news.google.com",
  },
  {
    name: "Google News - Technology",
    url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en",
    defaultCategory: "Technology",
    website: "https://news.google.com",
  },
];
