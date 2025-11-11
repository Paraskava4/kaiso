import React from 'react';

/**
 * AngleLabelConnector Component
 *
 * Creates angled connector lines for map annotations with two segments:
 * 1. First segment (usually vertical)
 * 2. Second segment (usually horizontal)
 * 3. Text label at the end
 *
 * This component is designed to be used within a Marker component
 * where coordinate transformation is already handled.
 *
 * Props:
 * - annotation: annotation configuration object
 * - children: text content to display
 * - stroke: line color (default: "#000000")
 * - strokeWidth: line thickness (default: 2)
 */
const AngleLabelConnector = ({
    annotation,
    children,
    stroke = "#000000",
    strokeWidth = 2
}) => {
    // Start from the marker center (0, 0 in marker coordinate space)
    const x = 0;
    const y = 0;
    
    // If not using angled connector, fall back to simple straight line
    if (!annotation.useAngledConnector || !annotation.angledConnector) {
        // Calculate text position with offset
        const textOffset = annotation.textOffset || { dx: 0, dy: 0 };
        const textX = x + annotation.dx + textOffset.dx;
        const textY = y + annotation.dy + textOffset.dy;

        return (
            <g>
                {/* Simple straight connector line */}
                <line
                    x1={x}
                    y1={y}
                    x2={x + annotation.dx}
                    y2={y + annotation.dy}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Text label with offset */}
                <g transform={`translate(${textX}, ${textY})`}>
                    {children}
                </g>
            </g>
        );
    }

    // Angled connector configuration
    const { segment1, segment2 } = annotation.angledConnector;

    // Calculate points for the angled connector
    const point1 = { x: x, y: y }; // Start point (marker center)
    const point2 = { x: x + segment1.dx, y: y + segment1.dy }; // End of first segment
    const point3 = { x: point2.x + segment2.dx, y: point2.y + segment2.dy }; // End of second segment (line end)

    // Calculate text position with offset
    const textOffset = annotation.textOffset || { dx: 0, dy: 0 };
    const textX = point3.x + textOffset.dx;
    const textY = point3.y + textOffset.dy;

    return (
        <g>
            {/* First segment of the connector */}
            <line
                x1={point1.x}
                y1={point1.y}
                x2={point2.x}
                y2={point2.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill="none"
            />

            {/* Second segment of the connector */}
            <line
                x1={point2.x}
                y1={point2.y}
                x2={point3.x}
                y2={point3.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                fill="none"
            />

            {/* Optional: Add a small circle at the corner for visual clarity */}
            <circle
                cx={point2.x}
                cy={point2.y}
                r={1}
                fill={stroke}
            />

            {/* Text label with offset from line end */}
            <g transform={`translate(${textX}, ${textY})`}>
                {children}
            </g>
        </g>
    );
};

export default AngleLabelConnector;
