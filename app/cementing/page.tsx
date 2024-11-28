'use client'

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OilWell from "@/components/OilWell";
import CementJob from "@/components/CementJob";

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

export default function Home() {
  const [sections, setSections] = useState<WellSection[]>([
    { internalDiameter: 5.00, wallThickness: 0.50, depth: 1000.00 },
    { internalDiameter: 4.00, wallThickness: 0.40, depth: 2000.00 },
  ]);
  const [openHoleDiameter, setOpenHoleDiameter] = useState(8.00);
  const [packerDepth, setPackerDepth] = useState<number | null>(null);
  const [fluids, setFluids] = useState<Fluid[]>([
    { type: 'Water', depth: 500, density: 1.0 },
    { type: 'Drilling Mud', depth: 1500, density: 1.5 },
  ]);
  const [slurryDepth, setSlurryDepth] = useState(1000);
  const [slurryStartDepth, setSlurryStartDepth] = useState(2000);
  const [slurryDensity, setSlurryDensity] = useState(15.8);
  const [slurryYield, setSlurryYield] = useState(1.15);

  const totalDepth = sections[sections.length - 1].depth;

  const addSection = () => {
    const lastSection = sections[sections.length - 1];
    setSections([...sections, {
      internalDiameter: lastSection.internalDiameter - 0.5,
      wallThickness: lastSection.wallThickness,
      depth: lastSection.depth + 1000,
    }]);
  };

  const updateSection = (index: number, field: keyof WellSection, value: number) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index));
    }
  };

  const addFluid = () => {
    const lastFluid = fluids[fluids.length - 1];
    setFluids([...fluids, {
      type: 'New Fluid',
      depth: lastFluid ? lastFluid.depth + 500 : 500,
      density: 1.0,
    }]);
  };

  const updateFluid = (index: number, field: keyof Fluid, value: string | number) => {
    const newFluids = [...fluids];
    newFluids[index] = { ...newFluids[index], [field]: value };
    setFluids(newFluids);
  };

  const removeFluid = (index: number) => {
    if (fluids.length > 1) {
      setFluids(fluids.filter((_, i) => i !== index));
    }
  };

  return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Advanced Oil Well Visualizer</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sections">Well Sections</TabsTrigger>
                <TabsTrigger value="fluids">Fluids</TabsTrigger>
                <TabsTrigger value="cement">Cement Job</TabsTrigger>
              </TabsList>
              <TabsContent value="sections">
                <Card>
                  <CardHeader>
                    <CardTitle>Well Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Packer Depth (feet)
                        <input
                            type="range"
                            min="0"
                            max={sections[sections.length - 1].depth}
                            step="1"
                            value={packerDepth || 0}
                            onChange={(e) => setPackerDepth(Number(e.target.value))}
                            className="mt-1 block w-full"
                        />
                        <span>{packerDepth !== null ? `${packerDepth.toFixed(2)} ft` : 'No packer'}</span>
                      </label>
                      <button
                          onClick={() => setPackerDepth(null)}
                          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove Packer
                      </button>
                    </div>
                    {sections.map((section, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                          <h4 className="font-bold mb-2">Section {index + 1}</h4>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor={`internalDiameter-${index}`}>Internal Diameter (in)</Label>
                              <Input
                                  id={`internalDiameter-${index}`}
                                  type="number"
                                  step="0.01"
                                  value={section.internalDiameter}
                                  onChange={(e) => updateSection(index, 'internalDiameter', Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`wallThickness-${index}`}>Wall Thickness (in)</Label>
                              <Input
                                  id={`wallThickness-${index}`}
                                  type="number"
                                  step="0.01"
                                  value={section.wallThickness}
                                  onChange={(e) => updateSection(index, 'wallThickness', Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`depth-${index}`}>Depth (ft)</Label>
                              <Input
                                  id={`depth-${index}`}
                                  type="number"
                                  step="1"
                                  value={section.depth}
                                  onChange={(e) => updateSection(index, 'depth', Number(e.target.value))}
                              />
                            </div>
                          </div>
                          <Button variant="destructive" className="mt-2" onClick={() => removeSection(index)}>
                            Remove Section
                          </Button>
                        </div>
                    ))}
                    <Button onClick={addSection}>Add Section</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="fluids">
                <Card>
                  <CardHeader>
                    <CardTitle>Fluids</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fluids.map((fluid, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                          <h4 className="font-bold mb-2">Fluid {index + 1}</h4>
                          <div className="space-y-2">
                            <div>
                              <Label htmlFor={`fluidType-${index}`}>Type</Label>
                              <Input
                                  id={`fluidType-${index}`}
                                  type="text"
                                  value={fluid.type}
                                  onChange={(e) => updateFluid(index, 'type', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`fluidDepth-${index}`}>Depth (ft)</Label>
                              <Input
                                  id={`fluidDepth-${index}`}
                                  type="number"
                                  step="1"
                                  value={fluid.depth}
                                  onChange={(e) => updateFluid(index, 'depth', Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`fluidDensity-${index}`}>Density (g/cm³)</Label>
                              <Input
                                  id={`fluidDensity-${index}`}
                                  type="number"
                                  step="0.01"
                                  value={fluid.density}
                                  onChange={(e) => updateFluid(index, 'density', Number(e.target.value))}
                              />
                            </div>
                          </div>
                          <Button variant="destructive" className="mt-2" onClick={() => removeFluid(index)}>
                            Remove Fluid
                          </Button>
                        </div>
                    ))}
                    <Button onClick={addFluid}>Add Fluid</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="cement">
                <Card>
                  <CardHeader>
                    <CardTitle>Cement Job Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="slurryStartDepth">Slurry Start Depth (ft from bottom)</Label>
                        <Input
                            id="slurryStartDepth"
                            type="number"
                            value={slurryStartDepth}
                            onChange={(e) => setSlurryStartDepth(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slurryDepth">Slurry Depth (ft)</Label>
                        <Input
                            id="slurryDepth"
                            type="number"
                            value={slurryDepth}
                            onChange={(e) => setSlurryDepth(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slurryDensity">Slurry Density (ppg)</Label>
                        <Input
                            id="slurryDensity"
                            type="number"
                            step="0.1"
                            value={slurryDensity}
                            onChange={(e) => setSlurryDensity(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slurryYield">Slurry Yield (ft³/sack)</Label>
                        <Input
                            id="slurryYield"
                            type="number"
                            step="0.01"
                            value={slurryYield}
                            onChange={(e) => setSlurryYield(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="openHoleDiameter">Open Hole Diameter (in)</Label>
                        <Input
                            id="openHoleDiameter"
                            type="number"
                            step="0.01"
                            value={openHoleDiameter}
                            onChange={(e) => setOpenHoleDiameter(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-6">
                  <CementJob
                      slurryDepth={slurryDepth}
                      slurryStartDepth={slurryStartDepth}
                      slurryDensity={slurryDensity}
                      slurryYield={slurryYield}
                      openHoleDiameter={openHoleDiameter}
                      casingOuterDiameter={sections[sections.length - 1].internalDiameter + 2 * sections[sections.length - 1].wallThickness}
                      totalDepth={totalDepth}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-full md:w-1/2">
            <OilWell
                sections={sections}
                openHoleDiameter={openHoleDiameter}
                packerDepth={packerDepth}
                totalDepth={totalDepth}
                fluids={fluids}
                slurryDepth={slurryDepth}
                slurryStartDepth={slurryStartDepth}
            />
          </div>
        </div>
      </div>
  );
}

