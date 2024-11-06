"use client";

import React, { useCallback, useState } from "react";
import FileSaver from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
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
  primary: "#2DD4BF",
  secondary: "#818CF8",
  tertiary: "#F472B6",
  background: "#F8FAFC",
  text: "#1E293B",
  muted: "#94A3B8",
};

const farmData: Record<
  string,
  Array<{
    name: string;
    area: number;
    fill: string;
    description?: string;
    percentage?: string;
  }>
> = {
  farm1: [
    {
      name: "Total Area",
      area: 500,
      fill: colors.background,
    },
    {
      name: "Crop Fields",
      area: 300,
      fill: colors.primary,
      description: "Active crop cultivation",
      percentage: "60%",
    },
    {
      name: "Pasture",
      area: 150,
      fill: colors.secondary,
      description: "Livestock grazing",
      percentage: "30%",
    },
    {
      name: "Infrastructure",
      area: 50,
      fill: colors.tertiary,
      description: "Buildings and roads",
      percentage: "10%",
    },
  ],
  farm2: [
    {
      name: "Total Area",
      area: 800,
      fill: colors.background,
    },
    {
      name: "Crop Fields",
      area: 500,
      fill: colors.primary,
      description: "Active crop cultivation",
      percentage: "62.5%",
    },
    {
      name: "Pasture",
      area: 200,
      fill: colors.secondary,
      description: "Livestock grazing",
      percentage: "25%",
    },
    {
      name: "Infrastructure",
      area: 100,
      fill: colors.tertiary,
      description: "Buildings and roads",
      percentage: "12.5%",
    },
  ],
  farm3: [
    {
      name: "Total Area",
      area: 600,
      fill: colors.background,
    },
    {
      name: "Crop Fields",
      area: 350,
      fill: colors.primary,
      description: "Active crop cultivation",
      percentage: "58.3%",
    },
    {
      name: "Pasture",
      area: 180,
      fill: colors.secondary,
      description: "Livestock grazing",
      percentage: "30%",
    },
    {
      name: "Infrastructure",
      area: 70,
      fill: colors.tertiary,
      description: "Buildings and roads",
      percentage: "11.7%",
    },
  ],
};

const farms = [
  { value: "farm1", label: "Green Valley Farm" },
  { value: "farm2", label: "Sunrise Fields" },
  { value: "farm3", label: "Highland Ranch" },
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      description?: string;
      area: number;
      percentage?: string;
    };
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-semibold text-sm text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">{data.description}</p>
        <div className="mt-2 flex justify-between gap-4 text-sm">
          <span className="text-gray-600">Area: {data.area} ha</span>
          <span className="font-medium text-gray-900">{data.percentage}</span>
        </div>
      </div>
    );
  }
  return null;
};

const PieChartView = () => {
  const [selectedFarm, setSelectedFarm] = useState("farm1");
  const [getDivJpeg, { ref: divRef }] = useGenerateImage({
    quality: 1,
    type: "image/jpeg",
  });

  const handleDownload = useCallback(async () => {
    const jpeg = await getDivJpeg();
    if (jpeg) {
      FileSaver.saveAs(jpeg, "farm-utilization-chart.jpeg");
    }
  }, [getDivJpeg]);

  return (
    <Card className="w-full h-fit bg-white border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-8 px-6">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Land Utilization
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Distribution of farm land usage by category
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
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4">
          <div ref={divRef} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                data={farmData[selectedFarm]}
                startAngle={180}
                endAngle={0}
                barSize={20}
              >
                <RadialBar
                  label={{
                    position: "insideStart",
                    fill: colors.text,
                    fontSize: 12,
                    fontWeight: 500,
                    formatter: (value: any) => `${value}`,
                  }}
                  background={{ fill: "#f1f5f9" }}
                  dataKey="area"
                  cornerRadius={15}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  width={200}
                  height={140}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    top: "50%",
                    right: 0,
                    transform: "translate(0, -50%)",
                    lineHeight: "24px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: colors.text,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-100">
            <p className="text-sm font-medium text-teal-600">Crop Fields</p>
            <p className="text-2xl font-bold text-teal-700 mt-1">
              {farmData[selectedFarm][1].area} ha
            </p>
            <p className="text-sm text-teal-600 mt-1">
              {farmData[selectedFarm][1].percentage}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm font-medium text-purple-600">Pasture</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {farmData[selectedFarm][2].area} ha
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {farmData[selectedFarm][2].percentage}
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-100">
            <p className="text-sm font-medium text-pink-600">Infrastructure</p>
            <p className="text-2xl font-bold text-pink-700 mt-1">
              {farmData[selectedFarm][3].area} ha
            </p>
            <p className="text-sm text-pink-600 mt-1">
              {farmData[selectedFarm][3].percentage}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartView;
