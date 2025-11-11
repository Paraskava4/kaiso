// Continent classification for world map countries
// Maps country IDs and names to their respective continents/regions
// Based on the world-atlas TopoJSON data structure

export const CONTINENT_CLASSIFICATION = {
  // North America
  "124": "NA", // Canada
  "840": "NA", // United States of America
  "484": "NA", // Mexico
  "320": "NA", // Guatemala
  "084": "NA", // Belize
  "222": "NA", // El Salvador
  "340": "NA", // Honduras
  "558": "NA", // Nicaragua
  "188": "NA", // Costa Rica
  "591": "NA", // Panama
  "044": "NA", // Bahamas
  "192": "NA", // Cuba
  "332": "NA", // Haiti
  "214": "NA", // Dominican Rep.
  "388": "NA", // Jamaica
  "630": "NA", // Puerto Rico

  // Europe
  "578": "EU", // Norway
  "752": "EU", // Sweden
  "246": "EU", // Finland
  "233": "EU", // Estonia
  "428": "EU", // Latvia
  "440": "EU", // Lithuania
  "112": "EU", // Belarus
  "616": "EU", // Poland
  "276": "EU", // Germany
  "528": "EU", // Netherlands
  "056": "EU", // Belgium
  "442": "EU", // Luxembourg
  "250": "EU", // France
  "756": "EU", // Switzerland
  "040": "EU", // Austria
  "203": "EU", // Czechia
  "703": "EU", // Slovakia
  "348": "EU", // Hungary
  "705": "EU", // Slovenia
  "191": "EU", // Croatia
  "070": "EU", // Bosnia and Herz.
  "499": "EU", // Montenegro
  "688": "EU", // Serbia
  "807": "EU", // Macedonia
  "008": "EU", // Albania
  "300": "EU", // Greece
  "100": "EU", // Bulgaria
  "642": "EU", // Romania
  "498": "EU", // Moldova
  "804": "EU", // Ukraine
  "643": "EU", // Russia
  "826": "EU", // United Kingdom
  "372": "EU", // Ireland
  "352": "EU", // Iceland
  "208": "EU", // Denmark
  "380": "EU", // Italy
  "724": "EU", // Spain
  "620": "EU", // Portugal
  "196": "EU", // Cyprus

  // South America
  "076": "SA", // Brazil
  "032": "SA", // Argentina
  "152": "SA", // Chile
  "068": "SA", // Bolivia
  "604": "SA", // Peru
  "218": "SA", // Ecuador
  "170": "SA", // Colombia
  "862": "SA", // Venezuela
  "328": "SA", // Guyana
  "740": "SA", // Suriname
  "600": "SA", // Paraguay
  "858": "SA", // Uruguay
  "238": "SA", // Falkland Is.

  // Africa
  "012": "AF", // Algeria
  "504": "AF", // Morocco
  "788": "AF", // Tunisia
  "434": "AF", // Libya
  "818": "AF", // Egypt
  "729": "AF", // Sudan
  "728": "AF", // S. Sudan
  "231": "AF", // Ethiopia
  "232": "AF", // Eritrea
  "262": "AF", // Djibouti
  "706": "AF", // Somalia
  "404": "AF", // Kenya
  "800": "AF", // Uganda
  "646": "AF", // Rwanda
  "108": "AF", // Burundi
  "834": "AF", // Tanzania
  "454": "AF", // Malawi
  "508": "AF", // Mozambique
  "748": "AF", // eSwatini
  "426": "AF", // Lesotho
  "710": "AF", // South Africa
  "516": "AF", // Namibia
  "072": "AF", // Botswana
  "716": "AF", // Zimbabwe
  "894": "AF", // Zambia
  "024": "AF", // Angola
  "180": "AF", // Dem. Rep. Congo
  "178": "AF", // Congo
  "266": "AF", // Gabon
  "226": "AF", // Eq. Guinea
  "120": "AF", // Cameroon
  "140": "AF", // Central African Rep.
  "148": "AF", // Chad
  "562": "AF", // Niger
  "566": "AF", // Nigeria
  "204": "AF", // Benin
  "768": "AF", // Togo
  "288": "AF", // Ghana
  "384": "AF", // Côte d'Ivoire
  "854": "AF", // Burkina Faso
  "466": "AF", // Mali
  "478": "AF", // Mauritania
  "686": "AF", // Senegal
  "270": "AF", // Gambia
  "324": "AF", // Guinea
  "624": "AF", // Guinea-Bissau
  "694": "AF", // Sierra Leone
  "430": "AF", // Liberia
  "450": "AF", // Madagascar
  "732": "AF", // W. Sahara

  // APAC (Asia-Pacific)
  "156": "AP", // China
  "392": "AP", // Japan
  "410": "AP", // South Korea
  "408": "AP", // North Korea
  "496": "AP", // Mongolia
  "356": "AP", // India
  "586": "AP", // Pakistan
  "004": "AP", // Afghanistan
  "762": "AP", // Tajikistan
  "417": "AP", // Kyrgyzstan
  "795": "AP", // Turkmenistan
  "860": "AP", // Uzbekistan
  "398": "AP", // Kazakhstan
  "050": "AP", // Bangladesh
  "104": "AP", // Myanmar
  "764": "AP", // Thailand
  "418": "AP", // Laos
  "704": "AP", // Vietnam
  "116": "AP", // Cambodia
  "458": "AP", // Malaysia
  "096": "AP", // Brunei
  "360": "AP", // Indonesia
  "626": "AP", // Timor-Leste
  "608": "AP", // Philippines
  "158": "AP", // Taiwan
  "524": "AP", // Nepal
  "064": "AP", // Bhutan
  "144": "AP", // Sri Lanka
  "036": "AP", // Australia
  "554": "AP", // New Zealand
  "598": "AP", // Papua New Guinea
  "242": "AP", // Fiji
  "548": "AP", // Vanuatu
  "090": "AP", // Solomon Is.
  "540": "AP", // New Caledonia

  // Middle East (part of APAC region)
  "792": "AP", // Turkey
  "364": "AP", // Iran
  "368": "AP", // Iraq
  "760": "AP", // Syria
  "422": "AP", // Lebanon
  "376": "AP", // Israel
  "275": "AP", // Palestine
  "400": "AP", // Jordan
  "682": "AP", // Saudi Arabia
  "887": "AP", // Yemen
  "512": "AP", // Oman
  "784": "AP", // United Arab Emirates
  "634": "AP", // Qatar
  "414": "AP", // Kuwait
  "031": "AP", // Azerbaijan
  "268": "AP", // Georgia
  "051": "AP", // Armenia
};

// Alternative mapping by country name (for fallback)
export const CONTINENT_BY_NAME = {
  // North America
  "Canada": "NA",
  "United States of America": "NA",
  "Mexico": "NA",
  "Guatemala": "NA",
  "Belize": "NA",
  "El Salvador": "NA",
  "Honduras": "NA",
  "Nicaragua": "NA",
  "Costa Rica": "NA",
  "Panama": "NA",
  "Bahamas": "NA",
  "Cuba": "NA",
  "Haiti": "NA",
  "Dominican Rep.": "NA",
  "Jamaica": "NA",
  "Puerto Rico": "NA",

  // Europe
  "Norway": "EU",
  "Sweden": "EU",
  "Finland": "EU",
  "Estonia": "EU",
  "Latvia": "EU",
  "Lithuania": "EU",
  "Belarus": "EU",
  "Poland": "EU",
  "Germany": "EU",
  "Netherlands": "EU",
  "Belgium": "EU",
  "Luxembourg": "EU",
  "France": "EU",
  "Switzerland": "EU",
  "Austria": "EU",
  "Czechia": "EU",
  "Slovakia": "EU",
  "Hungary": "EU",
  "Slovenia": "EU",
  "Croatia": "EU",
  "Bosnia and Herz.": "EU",
  "Montenegro": "EU",
  "Serbia": "EU",
  "Macedonia": "EU",
  "Albania": "EU",
  "Greece": "EU",
  "Bulgaria": "EU",
  "Romania": "EU",
  "Moldova": "EU",
  "Ukraine": "EU",
  "Russia": "EU",
  "United Kingdom": "EU",
  "Ireland": "EU",
  "Iceland": "EU",
  "Denmark": "EU",
  "Italy": "EU",
  "Spain": "EU",
  "Portugal": "EU",
  "Cyprus": "EU",

  // South America
  "Brazil": "SA",
  "Argentina": "SA",
  "Chile": "SA",
  "Bolivia": "SA",
  "Peru": "SA",
  "Ecuador": "SA",
  "Colombia": "SA",
  "Venezuela": "SA",
  "Guyana": "SA",
  "Suriname": "SA",
  "Paraguay": "SA",
  "Uruguay": "SA",
  "Falkland Is.": "SA",

  // Africa
  "Algeria": "AF",
  "Morocco": "AF",
  "Tunisia": "AF",
  "Libya": "AF",
  "Egypt": "AF",
  "Sudan": "AF",
  "S. Sudan": "AF",
  "Ethiopia": "AF",
  "Eritrea": "AF",
  "Djibouti": "AF",
  "Somalia": "AF",
  "Kenya": "AF",
  "Uganda": "AF",
  "Rwanda": "AF",
  "Burundi": "AF",
  "Tanzania": "AF",
  "Malawi": "AF",
  "Mozambique": "AF",
  "eSwatini": "AF",
  "Lesotho": "AF",
  "South Africa": "AF",
  "Namibia": "AF",
  "Botswana": "AF",
  "Zimbabwe": "AF",
  "Zambia": "AF",
  "Angola": "AF",
  "Dem. Rep. Congo": "AF",
  "Congo": "AF",
  "Gabon": "AF",
  "Eq. Guinea": "AF",
  "Cameroon": "AF",
  "Central African Rep.": "AF",
  "Chad": "AF",
  "Niger": "AF",
  "Nigeria": "AF",
  "Benin": "AF",
  "Togo": "AF",
  "Ghana": "AF",
  "Côte d'Ivoire": "AF",
  "Burkina Faso": "AF",
  "Mali": "AF",
  "Mauritania": "AF",
  "Senegal": "AF",
  "Gambia": "AF",
  "Guinea": "AF",
  "Guinea-Bissau": "AF",
  "Sierra Leone": "AF",
  "Liberia": "AF",
  "Madagascar": "AF",
  "W. Sahara": "AF",

  // APAC (Asia-Pacific)
  "China": "AP",
  "Japan": "AP",
  "South Korea": "AP",
  "North Korea": "AP",
  "Mongolia": "AP",
  "India": "AP",
  "Pakistan": "AP",
  "Afghanistan": "AP",
  "Tajikistan": "AP",
  "Kyrgyzstan": "AP",
  "Turkmenistan": "AP",
  "Uzbekistan": "AP",
  "Kazakhstan": "AP",
  "Bangladesh": "AP",
  "Myanmar": "AP",
  "Thailand": "AP",
  "Laos": "AP",
  "Vietnam": "AP",
  "Cambodia": "AP",
  "Malaysia": "AP",
  "Brunei": "AP",
  "Indonesia": "AP",
  "Timor-Leste": "AP",
  "Philippines": "AP",
  "Taiwan": "AP",
  "Nepal": "AP",
  "Bhutan": "AP",
  "Sri Lanka": "AP",
  "Australia": "AP",
  "New Zealand": "AP",
  "Papua New Guinea": "AP",
  "Fiji": "AP",
  "Vanuatu": "AP",
  "Solomon Is.": "AP",
  "New Caledonia": "AP",

  // Middle East (part of APAC region)
  "Turkey": "AP",
  "Iran": "AP",
  "Iraq": "AP",
  "Syria": "AP",
  "Lebanon": "AP",
  "Israel": "AP",
  "Palestine": "AP",
  "Jordan": "AP",
  "Saudi Arabia": "AP",
  "Yemen": "AP",
  "Oman": "AP",
  "United Arab Emirates": "AP",
  "Qatar": "AP",
  "Kuwait": "AP",
  "Azerbaijan": "AP",
  "Georgia": "AP",
  "Armenia": "AP"
};

// Helper function to get continent for a country
export const getCountryContinent = (geo) => {
  // Try by ID first
  if (geo.id && CONTINENT_CLASSIFICATION[geo.id]) {
    return CONTINENT_CLASSIFICATION[geo.id];
  }
  
  // Try by name as fallback
  if (geo.properties?.name && CONTINENT_BY_NAME[geo.properties.name]) {
    return CONTINENT_BY_NAME[geo.properties.name];
  }
  
  return null; // Unknown country
};
