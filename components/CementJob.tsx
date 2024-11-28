import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CementJobProps {
  slurryDepth: number;
  slurryStartDepth: number;
  slurryDensity: number;
  slurryYield: number;
  openHoleDiameter: number;
  casingOuterDiameter: number;
  totalDepth?: number;
  innerSlurryDepth: number
}

const CementJob: React.FC<CementJobProps> = ({
  slurryDepth,
  slurryStartDepth,
  slurryDensity,
  slurryYield,
  openHoleDiameter,
  casingOuterDiameter,
                                               innerSlurryDepth
}) => {
  // Calculate annular volume
  const annularVolume = calculateAnnularVolume(slurryDepth, openHoleDiameter, casingOuterDiameter);
  
  // Calculate cement volume
  const cementVolume = annularVolume / slurryYield;
  
  // Calculate cement weight
  const cementWeight = cementVolume * slurryDensity;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cement Job Calculations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Slurry Start Depth</TableCell>
              <TableCell>{slurryStartDepth.toFixed(2)} ft</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Slurry End Depth</TableCell>
              <TableCell>{(slurryStartDepth - slurryDepth).toFixed(2)} ft</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Slurry Height</TableCell>
              <TableCell>{slurryDepth.toFixed(2)} ft</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Slurry Density</TableCell>
              <TableCell>{slurryDensity.toFixed(2)} ppg</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Slurry Yield</TableCell>
              <TableCell>{slurryYield.toFixed(2)} ft³/sack</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Open Hole Diameter</TableCell>
              <TableCell>{openHoleDiameter.toFixed(2)} in</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Casing Outer Diameter</TableCell>
              <TableCell>{casingOuterDiameter.toFixed(2)} in</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Annular Volume</TableCell>
              <TableCell>{annularVolume.toFixed(2)} ft³</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cement Volume</TableCell>
              <TableCell>{cementVolume.toFixed(2)} ft³</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cement Weight</TableCell>
              <TableCell>{cementWeight.toFixed(2)} lbs</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

function calculateAnnularVolume(depth: number, openHoleDiameter: number, casingOuterDiameter: number): number {
  const openHoleArea = Math.PI * Math.pow(openHoleDiameter / 24, 2) / 4;
  const casingArea = Math.PI * Math.pow(casingOuterDiameter / 24, 2) / 4;
  return (openHoleArea - casingArea) * depth;
}

export default CementJob;

