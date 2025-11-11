// Region data for world map markers
// Coordinates are [longitude, latitude] in degrees

export const WORLD_REGIONS = [
    {
        id: "NA",
        name: "North America",
        percentage: 25,
        color: "#4F46E5", // Indigo
        center: [-98.5795, 39.8283], // Geographic centre of contiguous USA (Kansas)
        annotation: {
            dx: -250,
            dy: 0,
            // Angled connector configuration
            useAngledConnector: true,
            angledConnector: {
                // First segment: horizontal left
                segment1: { dx: 0, dy: -150 },
                // Second segment: vertical down
                segment2: { dx: 20, dy: 0 }
            },
            // Text offset from line end
            textOffset: { dx: 0, dy: 0 }
        },
    },
    {
        id: "EU",
        name: "Europe",
        percentage: 25,
        color: "#10B981", // Emerald
        center: [73.37, 54.99], // Omsk, Russia
        annotation: {
            dx: -150,
            dy: 0,
            // Angled connector configuration
            useAngledConnector: true, // Simple straight line
            angledConnector: {
                // First segment: horizontal left
                segment1: { dx: 0, dy: -100 },
                // Second segment: vertical down
                segment2: { dx: 0, dy: 0 }
            },
            // Text offset from line end
            textOffset: { dx: -10, dy: -22 }
        },
    },
    {
        id: "SA",
        name: "South America",
        percentage: 10,
        color: "#F59E0B", // Amber
        center: [-60.0, -15.79], // Near central Brazil
        annotation: {
            dx: 60,
            dy: 80,
            // Angled connector configuration
            useAngledConnector: true,
            angledConnector: {
                // First segment: horizontal left
                segment1: { dx: -180, dy: 0 },
                // Second segment: vertical down
                segment2: { dx: 0, dy: 40 }
            },
            // Text offset from line end
            textOffset: { dx: -60, dy: 16 }
        },
    },
    {
        id: "AF",
        name: "Africa",
        percentage: 10,
        color: "#EF4444", // Red
        center: [23.59, -6.16], // Mbuji-Mayi, Democratic Republic of the Congo
        annotation: {
            dx: 60,
            dy: 120,
            // Angled connector configuration
            useAngledConnector: true,
            angledConnector: {
                // First segment: vertical down
                segment1: { dx: 0, dy: 120 },
                // Second segment: horizontal left
                segment2: { dx: -40, dy: 0 }
            },
            // Text offset from line end
            textOffset: { dx: -68, dy: 0 }
        },
    },
    {
        id: "AP",
        name: "APAC",
        percentage: 30,
        color: "#D62035", // Brand red
        center: [77.209, 28.6139], // New Delhi, India
        annotation: {
            dx: 0,
            dy: 120,
            // Angled connector configuration
            useAngledConnector: false, // Simple straight line for APAC as requested
            // Text offset from line end
            textOffset: { dx: -15, dy: 15 }
        },
    },
];
