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

const OilWell: React.FC<OilWellProps> = ({ sections, openHoleDiameter, packerDepth, totalDepth, fluids, slurryDepth }) => {
    const svgWidth = 500;
    const svgHeight = 800;
    const scale = 10; // Scale factor for better visibility
    const wellCenterX = svgWidth / 2;
    const groundLevel = 100;
    const scaledTotalDepth = totalDepth / 5; // Scale down depth for visualization

    // Array of colors for different sections
    const sectionColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581', '#FFD54F'];

    const drawSection = (startDepth: number, endDepth: number, internalDiameter: number, wallThickness: number, color: string) => {
        const externalDiameter = internalDiameter + 2 * wallThickness;
        const scaledInternalDiameter = internalDiameter * scale;
        const scaledExternalDiameter = externalDiameter * scale;
        const scaledStartDepth = startDepth / 5;
        const scaledEndDepth = endDepth / 5;

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
        const scaledDepth = depth / 5;
        const packerWidth = openHoleDiameter * scale;
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
            const endDepth = Math.min(fluid.depth, totalDepth - slurryDepth);
            const scaledStartDepth = startDepth / 5;
            const scaledEndDepth = endDepth / 5;
            const fluidWidth = openHoleDiameter * scale;
            const externalDiameter = sections.find(section => section.depth > startDepth)?.internalDiameter;
            const externalDiameter2 = sections.find(section => section.depth > startDepth)?.wallThickness || 0;
            let scaledExternalDiameter;
            if(externalDiameter) {
                const anotherExternalDiamter = externalDiameter + 2 * externalDiameter2;
                 scaledExternalDiameter = anotherExternalDiamter * scale;
            }


            // Generate a color based on fluid density (darker = denser)
            const colorIntensity = Math.max(0, Math.min(255, Math.floor(255 - fluid.density * 50)));
            const fluidColor = `rgb(${colorIntensity}, ${colorIntensity}, 255)`; // Blue-based color for fluids

            if (endDepth > startDepth) {
                return (
                    <g key={`fluid-${index}`}>
                        <rect
                            x={scaledExternalDiameter? wellCenterX - scaledExternalDiameter / 2 : ''}
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
        const scaledSlurryStartDepth = (totalDepth - slurryDepth) / 5;
        const scaledSlurryEndDepth = totalDepth / 5;
        const slurryWidth = openHoleDiameter * scale;
        const externalDiameter = sections.find(section => section.depth > totalDepth - slurryDepth)?.internalDiameter
        const externalDiameter2 = sections.find(section => section.depth > totalDepth - slurryDepth)?.wallThickness || 0;
        let scaledExternalDiameter
        if(externalDiameter) {
            const anotherDiameter = externalDiameter + 2 * externalDiameter2
            scaledExternalDiameter = anotherDiameter * scale;
        }

        return (
            <g key="cement-slurry">
                <rect
                    x={wellCenterX - slurryWidth / 2}
                    y={groundLevel + scaledSlurryStartDepth}
                    width={scaledExternalDiameter? (slurryWidth - scaledExternalDiameter) / 2 : ''}
                    height={scaledSlurryEndDepth - scaledSlurryStartDepth}
                    fill="#4a4a4a" // Dark gray for cement
                />
                <rect
                    x={scaledExternalDiameter? wellCenterX + scaledExternalDiameter / 2 : ''}
                    y={groundLevel + scaledSlurryStartDepth}
                    width={scaledExternalDiameter? (slurryWidth - scaledExternalDiameter) / 2 : ''}
                    height={scaledSlurryEndDepth - scaledSlurryStartDepth}
                    fill="#4a4a4a" // Dark gray for cement
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

            {/* Packer */}
            {packerDepth !== null && drawPacker(packerDepth)}

            {/* Text labels */}
            <text x="10" y="30" fill="black" fontSize="14">Total Depth: {totalDepth.toFixed(2)} ft</text>
            <text x="10" y="50" fill="black" fontSize="14">Open Hole Diameter: {openHoleDiameter.toFixed(2)} in</text>
            {packerDepth !== null && (
                <text x="10" y="70" fill="black" fontSize="14">Packer Depth: {packerDepth.toFixed(2)} ft</text>
            )}

            {/* Legend */}
            <rect x="10" y={svgHeight - 90} width="20" height="20" fill="#36454F" />
            <text x="40" y={svgHeight - 75} fill="black" fontSize="12">Open Hole</text>
            {sections.map((_, index) => (
                <g key={`legend-${index}`}>
                    <rect
                        x="10"
                        y={svgHeight - 60 + index * 25}
                        width="20"
                        height="20"
                        fill={sectionColors[index % sectionColors.length]}
                    />
                    <text x="40" y={svgHeight - 45 + index * 25} fill="black" fontSize="12">Section {index + 1}</text>
                </g>
            ))}
            <rect x="200" y={svgHeight - 30} width="20" height="5" fill="red" />
            <text x="230" y={svgHeight - 15} fill="black" fontSize="12">Packer</text>
            {fluids.map((fluid, index) => {
                const colorIntensity = Math.max(0, Math.min(255, Math.floor(255 - fluid.density * 50)));
                const fluidColor = `rgb(${colorIntensity}, ${colorIntensity}, 255)`;
                return (
                    <g key={`legend-fluid-${index}`}>
                        <rect x="10" y={svgHeight - 120 - index * 25} width="20" height="20" fill={fluidColor} />
                        <text x="40" y={svgHeight - 105 - index * 25} fill="black" fontSize="12">
                            {fluid.type} (Depth: {Math.min(fluid.depth, totalDepth - slurryDepth).toFixed(0)} ft, Density: {fluid.density.toFixed(2)})
                        </text>
                    </g>
                );
            })}
            <rect x="10" y={svgHeight - 120 - fluids.length * 25} width="20" height="20" fill="#4a4a4a" />
            <text x="40" y={svgHeight - 105 - fluids.length * 25} fill="black" fontSize="12">
                Cement (Depth: {(totalDepth - slurryDepth).toFixed(0)}-{totalDepth.toFixed(0)} ft)
            </text>
        </svg>
    );
};

export default OilWell;

