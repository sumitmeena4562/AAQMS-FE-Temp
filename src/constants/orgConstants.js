/**
 * ── ORGANIZATION FORM CONSTANTS ──
 * Comprehensive lists for Industry, Occupancy, and Classification types.
 */

export const INDUSTRY_TYPES = [
    "Manufacturing & Heavy Industry",
    "Construction & Infrastructure",
    "Healthcare & Pharmaceuticals",
    "Warehousing & Logistics",
    "Information Technology & Data Centers",
    "Retail & Commercial Hubs",
    "Education & Institutional",
    "Hospitality & Tourism",
    "Energy & Utilities",
    "Chemical & Petrochemical",
    "Automotive & Aerospace",
    "Food & Beverage Processing",
    "Textile & Apparel",
    "Telecommunications"
];

export const OCCUPANCY_TYPES = [
    "Industrial Factory",
    "Commercial Office Space",
    "High-Rise Warehouse",
    "Retail Outlet / Mall",
    "Hospital / Medical Center",
    "Educational Building",
    "Residential Complex",
    "Hotel / Resort",
    "Data Center / Tech Park",
    "Laboratory / Research Center",
    "Assembly Hall / Cinema",
    "Parking Structure",
    "Underground Facility"
];

export const BUILDING_CLASSIFICATIONS = [
    "Group A - Residential",
    "Group B - Educational",
    "Group C - Institutional",
    "Group D - Assembly",
    "Group E - Business",
    "Group F - Mercantile",
    "Group G - Industrial",
    "Group H - Storage",
    "Group J - Hazardous"
];

// Default initial values
export const DEFAULT_ORG_VALUES = {
    industry: INDUSTRY_TYPES[0],
    occupancyType: OCCUPANCY_TYPES[0],
    classification: BUILDING_CLASSIFICATIONS[0],
    country: "India"
};
