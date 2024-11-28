import React from 'react';

interface WellSection {
    internalDiameter: number;
    wallThickness: number;
    depth: number;
}

interface Fluid {
    type: string;
    depth: number;
    density: number;
}

interface OilWellProps {
    sections: WellSection[];
    openHoleDiameter: number;
    packerDepth: number | null;
    totalDepth: number;
    fluids: Fluid[];
    slurryDepth: number;
    slurryStartDepth?: number;
}

const OilWell: React.FC<OilWellProps> = ({
                                             sections,
                                             openHoleDiameter,
                                             packerDepth,
                                             totalDepth,
                                             fluids,
                                             slurryDepth
                                         }) => {
    const svgWidth = 800; // Increased width to accommodate the table
    const svgHeight = 1000;
    const scale = 8;

    const wellCenterX = 300; // Adjusted to make room for the table
    const groundLevel = 150;
    const scaledTotalDepth = totalDepth / 6;

    const sectionColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581', '#FFD54F'];

    const drawSection = (startDepth: number, endDepth: number, internalDiameter: number, wallThickness: number, color: string) => {
        const externalDiameter = internalDiameter + 2 * wallThickness;
        const scaledInternalDiameter = internalDiameter * scale;
        const scaledExternalDiameter = externalDiameter * scale;
        const scaledStartDepth = startDepth / 6;
        const scaledEndDepth = endDepth / 6;

        return (
            <g key={`section-${startDepth}-${endDepth}`}>
                <rect
                    x={wellCenterX - scaledExternalDiameter / 2}
                    y={groundLevel + scaledStartDepth}
                    width={scaledExternalDiameter}
                    height={scaledEndDepth - scaledStartDepth}
                    fill={color}
                    stroke="black"
                    strokeWidth="1"
                />
                <rect
                    x={wellCenterX - scaledInternalDiameter / 2}
                    y={groundLevel + scaledStartDepth}
                    width={scaledInternalDiameter}
                    height={scaledEndDepth - scaledStartDepth}
                    fill="#FFFFFF"
                />
            </g>
        );
    };

    const drawPacker = (depth: number) => {
        const scaledDepth = depth / 6;
        const packerWidth = openHoleDiameter *10;
        return (
            <rect
                x={wellCenterX - packerWidth / 2}
                y={groundLevel + scaledDepth - 5}
                width={packerWidth}
                height={10}
                fill="red"
            />
        );
    };

    const drawFluids = () => {
        return fluids.map((fluid, index) => {
            const startDepth = index === 0 ? 0 : fluids[index - 1].depth;
            const endDepth = Math.min(
                fluid.depth,
                totalDepth - (slurryDepth || 0),
                totalDepth - (innerSlurryDepth || 0)
            );
            const scaledStartDepth = startDepth / 6;
            const scaledEndDepth = endDepth / 6;
            const fluidWidth = openHoleDiameter * scale;
            const externalDiameter = sections.find(section => section.depth > startDepth)?.internalDiameter +
                2 * sections.find(section => section.depth > startDepth)?.wallThickness || 0;
            const scaledExternalDiameter = externalDiameter * scale;

            const colorIntensity = Math.max(0, Math.min(255, Math.floor(255 - fluid.density * 50)));
            const fluidColor = `rgb(${colorIntensity}, ${colorIntensity}, 255)`;

            if (endDepth > startDepth) {
                return (
                    <g key={`fluid-${index}`}>
                        <rect
                            x={wellCenterX - scaledExternalDiameter / 2}
                            y={groundLevel + scaledStartDepth}
                            width={scaledExternalDiameter}
                            height={scaledEndDepth - scaledStartDepth}
                            fill={fluidColor}
                        />
                        <text
                            x={wellCenterX + fluidWidth / 2 + 5}
                            y={groundLevel + (scaledStartDepth + scaledEndDepth) / 2}
                            fill="black"
                            fontSize="12"
                            dominantBaseline="middle"
                        >
                            {fluid.type} ({endDepth.toFixed(0)} ft)
                        </text>
                    </g>
                );
            }
            return null;
        });
    };

    const drawCementSlurry = () => {
        const scaledSlurryStartDepth = (totalDepth - slurryDepth) / 6;
        const scaledSlurryEndDepth = totalDepth / 6;
        const slurryWidth = openHoleDiameter * scale;
        const externalDiameter = sections.find(section => section.depth > totalDepth - slurryDepth)?.internalDiameter +
            2 * sections.find(section => section.depth > totalDepth - slurryDepth)?.wallThickness || 0;
        const scaledExternalDiameter = externalDiameter * scale;

        return (
            <g key="cement-slurry">
                <rect
                    x={wellCenterX - slurryWidth / 2}
                    y={groundLevel + scaledSlurryStartDepth}
                    width={(slurryWidth - scaledExternalDiameter) / 2}
                    height={scaledSlurryEndDepth - scaledSlurryStartDepth}
                    fill="#4a4a4a"
                />
                <rect
                    x={wellCenterX + scaledExternalDiameter / 2}
                    y={groundLevel + scaledSlurryStartDepth}
                    width={(slurryWidth - scaledExternalDiameter) / 2}
                    height={scaledSlurryEndDepth - scaledSlurryStartDepth}
                    fill="#4a4a4a"
                />
                <text
                    x={wellCenterX + slurryWidth / 2 + 5}
                    y={groundLevel + (scaledSlurryStartDepth + scaledSlurryEndDepth) / 2}
                    fill="black"
                    fontSize="12"
                    dominantBaseline="middle"
                >
                    Cement ({slurryDepth.toFixed(0)} ft)
                </text>
            </g>
        );
    };

    const drawInnerSlurry = () => {
        const scaledInnerSlurryStartDepth = (totalDepth - innerSlurryDepth) / 6;
        const scaledInnerSlurryEndDepth = totalDepth / 6;
        const innerDiameter = sections[sections.length - 1].internalDiameter;
        const scaledInnerDiameter = innerDiameter * scale;

        return (
            <g key="inner-slurry">
                <rect
                    x={wellCenterX - scaledInnerDiameter / 2}
                    y={groundLevel + scaledInnerSlurryStartDepth}
                    width={scaledInnerDiameter}
                    height={scaledInnerSlurryEndDepth - scaledInnerSlurryStartDepth}
                    fill="#4a4a4a"
                />
                <text
                    x={wellCenterX}
                    y={groundLevel + (scaledInnerSlurryStartDepth + scaledInnerSlurryEndDepth) / 2}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    Inner Slurry ({innerSlurryDepth?.toFixed(0)} ft)
                </text>
            </g>
        );
    };

    const drawLegendTable = () => {
        const tableX = 550;
        const tableY = 150;
        const rowHeight = 25;
        const colWidths = [30, 150, 150];

        const legendItems = [
            { color: "#36454F", label: "Open Hole" },
            ...sections.map((_, index) => ({ color: sectionColors[index % sectionColors.length], label: `Section ${index + 1}` })),
            ...fluids.map(fluid => {
                const colorIntensity = Math.max(0, Math.min(255, Math.floor(255 - (fluid.density || 0) * 50)));
                const fluidColor = `rgb(${colorIntensity}, ${colorIntensity}, 255)`;
                return {
                    color: fluidColor,
                    label: fluid.type,
                    details: `Depth: ${Math.min(fluid.depth, totalDepth - (slurryDepth || 0), totalDepth - (innerSlurryDepth || 0)).toFixed(0)} ft, Density: ${(fluid.density || 0).toFixed(2)}`
                };
            }),
            { color: "#4a4a4a", label: "Cement", details: `Depth: ${(totalDepth - (slurryDepth || 0)).toFixed(0)}-${totalDepth.toFixed(0)} ft` },
            { color: "#4a4a4a", label: "Inner Slurry", details: `Depth: ${(totalDepth - (innerSlurryDepth || 0)).toFixed(0)}-${totalDepth.toFixed(0)} ft` }
        ];

        return (
            <g>
                <text x={tableX} y={tableY - 20} fontWeight="bold" fontSize="14">Legend</text>
                {legendItems.map((item, index) => (
                    <g key={`legend-${index}`} transform={`translate(0, ${index * rowHeight})`}>
                        <rect x={tableX} y={tableY} width={colWidths[0]} height={rowHeight - 2} fill={item.color} />
                        <text x={tableX + colWidths[0] + 5} y={tableY + rowHeight / 2} dominantBaseline="middle" fontSize="12">{item.label}</text>
                        {item.details && (
                            <text x={tableX + colWidths[0] + colWidths[1] + 5} y={tableY + rowHeight / 2} dominantBaseline="middle" fontSize="12">{item.details}</text>
                        )}
                    </g>
                ))}
            </g>
        );
    };

    return (
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* Sky */}
            <rect x="0" y="0" width={svgWidth} height={groundLevel} fill="#87CEEB" />

            {/* Ground */}
            <rect x="0" y={groundLevel} width={svgWidth} height={svgHeight - groundLevel} fill="#8B4513" />

            {/* Derrick */}
            <polygon
                points={`${wellCenterX-70},${groundLevel} ${wellCenterX+70},${groundLevel} ${wellCenterX},20`}
                fill="#708090"
                stroke="black"
                strokeWidth="2"
            />

            {/* Open Hole */}
            <rect
                x={wellCenterX - openHoleDiameter * scale / 2}
                y={groundLevel}
                width={openHoleDiameter * scale}
                height={scaledTotalDepth}
                fill="#36454F"
            />

            {/* Fluids */}
            {drawFluids()}

            {/* Well Sections */}
            {sections.map((section, index) => {
                const startDepth = index === 0 ? 0 : sections[index - 1].depth;
                return drawSection(
                    startDepth,
                    section.depth,
                    section.internalDiameter,
                    section.wallThickness,
                    sectionColors[index % sectionColors.length]
                );
            })}

            {/* Cement Slurry */}
            {drawCementSlurry()}

            {/* Inner Slurry */}
            {innerSlurryDepth > 0 && drawInnerSlurry()}

            {/* Packer */}
            {packerDepth !== null && drawPacker(packerDepth)}

            {/* Text labels */}
            <text x="10" y="30" fill="black" fontSize="14">Total Depth: {totalDepth.toFixed(2)} ft</text>
            <text x="10" y="50" fill="black" fontSize="14">Open Hole Diameter: {openHoleDiameter.toFixed(2)} in</text>
            {packerDepth !== null && (
                <text x="10" y="70" fill="black" fontSize="14">Packer Depth: {packerDepth.toFixed(2)} ft</text>
            )}

            {/* Legend Table */}
            {drawLegendTable()}
        </svg>
    );
};

export default OilWell;

