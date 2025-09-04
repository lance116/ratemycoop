export interface Company {
  id: number;
  name: string;
  logo: string;
  rating: number;
  elo: number;
  reviews: Review[];
  tags: string[];
  description: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
  program: string;
  year: string;
}

export const baseCompanies: Company[] = [
  {
    id: 1,
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    rating: 0,
    elo: 1600,
    description: "Leading technology company with innovative culture",
    tags: ["Search", "Cloud", "AI/ML", "Ads"],
    reviews: []
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    rating: 0,
    elo: 1600,
    description: "Global technology leader with diverse opportunities",
    tags: ["Azure", "Office", "Gaming", "Enterprise"],
    reviews: []
  },
  {
    id: 3,
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    rating: 0,
    elo: 1600,
    description: "Social technology company building the metaverse",
    tags: ["Social Media", "VR/AR", "Mobile", "AI"],
    reviews: []
  },
  {
    id: 4,
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    rating: 0,
    elo: 1600,
    description: "E-commerce and cloud computing giant",
    tags: ["AWS", "E-commerce", "Logistics", "Alexa"],
    reviews: []
  },
  {
    id: 5,
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    rating: 0,
    elo: 1600,
    description: "Consumer technology and innovation leader",
    tags: ["iOS", "Hardware", "Design", "Consumer"],
    reviews: []
  },
  {
    id: 6,
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    rating: 0,
    elo: 1600,
    description: "Streaming entertainment and content platform",
    tags: ["Streaming", "Content", "Microservices", "Data"],
    reviews: []
  },
  {
    id: 7,
    name: "Shopify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    rating: 0,
    elo: 1600,
    description: "E-commerce platform powering businesses worldwide",
    tags: ["E-commerce", "Payments", "Canadian", "Ruby"],
    reviews: []
  },
  {
    id: 8,
    name: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
    rating: 0,
    elo: 1600,
    description: "Electric vehicles and sustainable energy",
    tags: ["Automotive", "Energy", "Autopilot", "Manufacturing"],
    reviews: []
  },
  {
    id: 9,
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    rating: 0,
    elo: 1600,
    description: "Mobility and delivery technology platform",
    tags: ["Rideshare", "Delivery", "Maps", "Payments"],
    reviews: []
  },
  {
    id: 10,
    name: "Spotify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    rating: 0,
    elo: 1600,
    description: "Audio streaming and media services platform",
    tags: ["Music", "Audio", "Recommendations", "Mobile"],
    reviews: []
  },
  {
    id: 11,
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
    rating: 0,
    elo: 1600,
    description: "Online marketplace for lodging and experiences",
    tags: ["Marketplace", "Travel", "Payments", "Mobile"],
    reviews: []
  },
  {
    id: 12,
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    rating: 0,
    elo: 1600,
    description: "Financial infrastructure for the internet",
    tags: ["Payments", "FinTech", "APIs", "Infrastructure"],
    reviews: []
  },
  {
    id: 13,
    name: "Databricks",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Databricks_Logo.png",
    rating: 0,
    elo: 1600,
    description: "Unified data analytics platform",
    tags: ["Big Data", "Analytics", "ML", "Spark"],
    reviews: []
  },
  {
    id: 14,
    name: "Palantir",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Palantir_Technologies_logo.svg",
    rating: 0,
    elo: 1600,
    description: "Big data analytics and software solutions",
    tags: ["Big Data", "Government", "Analytics", "Security"],
    reviews: []
  },
  {
    id: 15,
    name: "Snowflake",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/4b/Snowflake_Logo.svg",
    rating: 0,
    elo: 1600,
    description: "Cloud data platform company",
    tags: ["Data Warehouse", "Cloud", "Analytics", "SQL"],
    reviews: []
  },
  {
    id: 16,
    name: "Coinbase",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase_Logo_2016.svg",
    rating: 0,
    elo: 1600,
    description: "Cryptocurrency exchange platform",
    tags: ["Crypto", "FinTech", "Exchange", "Blockchain"],
    reviews: []
  },
  {
    id: 17,
    name: "Discord",
    logo: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
    rating: 0,
    elo: 1600,
    description: "Voice, video and text communication service",
    tags: ["Gaming", "Communication", "Real-time", "Community"],
    reviews: []
  },
  {
    id: 18,
    name: "Figma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    rating: 0,
    elo: 1600,
    description: "Collaborative interface design tool",
    tags: ["Design", "Collaboration", "Web", "Creative"],
    reviews: []
  },
  {
    id: 19,
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    rating: 0,
    elo: 1600,
    description: "All-in-one workspace for notes and collaboration",
    tags: ["Productivity", "Collaboration", "Notes", "Workspace"],
    reviews: []
  },
  {
    id: 20,
    name: "Zoom",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
    rating: 0,
    elo: 1600,
    description: "Video communications platform",
    tags: ["Video", "Communication", "Enterprise", "Remote"],
    reviews: []
  },
  {
    id: 21,
    name: "Twilio",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg",
    rating: 0,
    elo: 1600,
    description: "Cloud communications platform",
    tags: ["APIs", "Communication", "SMS", "Voice"],
    reviews: []
  },
  {
    id: 22,
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    rating: 0,
    elo: 1600,
    description: "Customer relationship management platform",
    tags: ["CRM", "Enterprise", "Cloud", "Sales"],
    reviews: []
  },
  {
    id: 23,
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg",
    rating: 0,
    elo: 1600,
    description: "Digital media and creativity software",
    tags: ["Creative", "Design", "Media", "SaaS"],
    reviews: []
  },
  {
    id: 24,
    name: "MongoDB",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/45/MongoDB-Logo.svg",
    rating: 0,
    elo: 1600,
    description: "Document database platform",
    tags: ["Database", "NoSQL", "Cloud", "Developer Tools"],
    reviews: []
  },
  {
    id: 25,
    name: "Roblox",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Roblox_Logo_2022.svg",
    rating: 0,
    elo: 1600,
    description: "Online game platform and creation system",
    tags: ["Gaming", "Platform", "UGC", "Virtual Worlds"],
    reviews: []
  }
];

import { getStoredRatings } from '@/utils/elo';

export const getCompanies = (): Company[] => {
  const storedRatings = getStoredRatings();
  
  return baseCompanies
    .map(company => ({
      ...company,
      elo: storedRatings[company.id] || company.elo
    }))
    .sort((a, b) => b.elo - a.elo);
};

export const companies = getCompanies();