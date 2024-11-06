"use client";

import React, { useCallback, useState } from "react";
import FileSaver from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Modern color palette
const colors = {
  primary: "#2DD4BF", // Vibrant teal
  secondary: "#818CF8", // Soft purple
  background: "#F8FAFC", // Light gray background
  text: "#1E293B", // Dark blue-gray text
  muted: "#94A3B8", // Muted text
  grid: "#E2E8F0", // Grid lines
};

const farmData: any = {
  farm1: {
    plotA: [
      { x: 45, y: 500, z: 200 },
      { x: 55, y: 700, z: 300 },
      { x: 40, y: 550, z: 250 },
      { x: 60, y: 900, z: 400 },
      { x: 50, y: 600, z: 350 },
      { x: 65, y: 1000, z: 500 },
    ],
    plotB: [
      { x: 70, y: 1100, z: 450 },
      { x: 75, y: 1200, z: 470 },
      { x: 68, y: 1050, z: 400 },
      { x: 80, y: 1300, z: 500 },
      { x: 72, y: 1250, z: 520 },
      { x: 78, y: 1150, z: 480 },
    ],
  },
  farm2: {
    plotA: [
      { x: 42, y: 480, z: 180 },
      { x: 52, y: 680, z: 280 },
      { x: 38, y: 520, z: 230 },
      { x: 58, y: 850, z: 380 },
      { x: 48, y: 580, z: 330 },
      { x: 62, y: 950, z: 480 },
    ],
    plotB: [
      { x: 68, y: 1050, z: 430 },
      { x: 73, y: 1150, z: 450 },
      { x: 65, y: 1000, z: 380 },
      { x: 78, y: 1250, z: 480 },
      { x: 70, y: 1200, z: 500 },
      { x: 75, y: 1100, z: 460 },
    ],
  },
  farm3: {
    plotA: [
      { x: 47, y: 520, z: 220 },
      { x: 57, y: 720, z: 320 },
      { x: 42, y: 570, z: 270 },
      { x: 62, y: 920, z: 420 },
      { x: 52, y: 620, z: 370 },
      { x: 67, y: 1020, z: 520 },
    ],
    plotB: [
      { x: 72, y: 1150, z: 470 },
      { x: 77, y: 1250, z: 490 },
      { x: 70, y: 1100, z: 420 },
      { x: 82, y: 1350, z: 520 },
      { x: 74, y: 1300, z: 540 },
      { x: 80, y: 1200, z: 500 },
    ],
  },
};

const farms = [
  { value: "farm1", label: "Green Valley Farm" },
  { value: "farm2", label: "Sunrise Fields" },
  { value: "farm3", label: "Highland Ranch" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-semibold text-sm text-gray-900">Plot Details</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Height:{" "}
            <span className="font-medium text-gray-900">{data.x} cm</span>
          </p>
          <p className="text-sm text-gray-600">
            Yield:{" "}
            <span className="font-medium text-gray-900">{data.y} kg</span>
          </p>
          <p className="text-sm text-gray-600">
            Fertilizer:{" "}
            <span className="font-medium text-gray-900">{data.z} kg/ha</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ScatterChartView = () => {
  const [selectedFarm, setSelectedFarm] = useState("farm1");
  const [getDivPng, { ref: scatterRef }] = useGenerateImage<HTMLDivElement>({
    quality: 1,
    type: "image/png",
  });

  const handleDownload = useCallback(async () => {
    const png = await getDivPng();
    if (png) {
      FileSaver.saveAs(png, "farm-analysis.png");
    }
  }, [getDivPng]);

  // Calculate statistics for the selected farm
  const getStats = (plotData: any[]) => {
    const avgYield =
      plotData.reduce((acc: any, curr: { y: any }) => acc + curr.y, 0) /
      plotData.length;
    const avgHeight =
      plotData.reduce((acc, curr) => acc + curr.x, 0) / plotData.length;
    const avgFertilizer =
      plotData.reduce((acc, curr) => acc + curr.z, 0) / plotData.length;
    return { avgYield, avgHeight, avgFertilizer };
  };

  const statsA = getStats(farmData[selectedFarm].plotA);
  const statsB = getStats(farmData[selectedFarm].plotB);

  return (
    <Card className="w-full h-fit bg-white  border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-8 px-6">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Crop Performance Analysis
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Analyzing relationships between crop height, yield, and fertilizer
              usage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedFarm} onValueChange={setSelectedFarm}>
            <SelectTrigger className="w-48 border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <SelectValue placeholder="Select farm" />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => (
                <SelectItem
                  key={farm.value}
                  value={farm.value}
                  className="hover:bg-gray-50"
                >
                  {farm.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors border-gray-200"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-6">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6">
          <div ref={scatterRef} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="x"
                  name="Crop Height"
                  unit="cm"
                  tick={{ fill: colors.text }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                  tickMargin={15}
                  label={{
                    value: "Crop Height (cm)",
                    position: "bottom",
                    offset: 5,
                    style: { fill: colors.muted },
                  }}
                />
                <YAxis
                  dataKey="y"
                  name="Yield"
                  unit="kg"
                  tick={{ fill: colors.text }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                  tickMargin={15}
                  label={{
                    value: "Yield (kg)",
                    angle: -90,
                    position: "left",
                    offset: 10,
                    style: { fill: colors.muted },
                  }}
                />
                <ZAxis
                  dataKey="z"
                  name="Fertilizer Usage"
                  unit="kg/ha"
                  range={[64, 144]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  align="center"
                  verticalAlign="top"
                  wrapperStyle={{
                    paddingTop: 10,
                    paddingBottom: 20,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                />
                <Scatter
                  name="Plot A"
                  data={farmData[selectedFarm].plotA}
                  fill={colors.primary}
                />
                <Scatter
                  name="Plot B"
                  data={farmData[selectedFarm].plotB}
                  fill={colors.secondary}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-100">
            <p className="text-sm font-medium text-teal-600">Plot A Averages</p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Height:</span>
                <span className="font-medium text-teal-700">
                  {statsA.avgHeight.toFixed(1)} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Yield:</span>
                <span className="font-medium text-teal-700">
                  {statsA.avgYield.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Fertilizer:</span>
                <span className="font-medium text-teal-700">
                  {statsA.avgFertilizer.toFixed(1)} kg/ha
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm font-medium text-purple-600">
              Plot B Averages
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-600">Height:</span>
                <span className="font-medium text-purple-700">
                  {statsB.avgHeight.toFixed(1)} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-600">Yield:</span>
                <span className="font-medium text-purple-700">
                  {statsB.avgYield.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-600">Fertilizer:</span>
                <span className="font-medium text-purple-700">
                  {statsB.avgFertilizer.toFixed(1)} kg/ha
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScatterChartView;
