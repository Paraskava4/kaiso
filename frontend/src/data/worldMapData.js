// World map data configuration
// Using a public CDN for world map TopoJSON data

export const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Fallback URL in case primary CDN fails
export const FALLBACK_MAP_URL = "https://raw.githubusercontent.com/topojson/world-atlas/master/countries-110m.json";

// Country highlighting configuration
export const HIGHLIGHT_COUNTRIES = [
  {
    name: "Russia",
    id: "RUS",
    alternativeIds: ["643", "RU", "Russian Federation"],
    color: "#FF6B35", // Orange
    duration: 5000
  },
  {
    name: "United States of America",
    id: "USA",
    alternativeIds: ["840", "US", "United States", "America"],
    color: "#4CAF50", // Green
    duration: 5000
  },
  {
    name: "India",
    id: "IND",
    alternativeIds: ["356", "IN"],
    color: "#D62035", // Red (matching your brand color)
    duration: 5000
  }
];

// Animation configuration
export const ANIMATION_CONFIG = {
  intervalDuration: 4000, // 5 seconds per country
  transitionDuration: 500, // 0.5 seconds for color transitions
  pauseOnHover: true,
  respectReducedMotion: true
};

// Map projection configuration
export const MAP_CONFIG = {
  projection: "geoNaturalEarth1",
  projectionConfig: {
    scale: 200, // Optimized for 1200x512 container to fill properly
    center: [0, 15] // Positioned to start from Iceland, cut Antarctica
  },
  style: {
    default: {
      fill: "#E5E7EB", // Light gray for default countries
      stroke: "#9CA3AF", // Gray border
      strokeWidth: 0.5,
      outline: "none"
    },
    highlighted: {
      stroke: "#374151", // Darker border for highlighted countries
      strokeWidth: 1,
      outline: "none"
    }
  }
};
