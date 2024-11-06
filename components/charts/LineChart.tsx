"use client";

import React, { useCallback, useState } from "react";
import FileSaver from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Color palette for consistency
const colors = {
  primary: "#2DD4BF", // Teal for average time
  secondary: "#818CF8", // Purple for max time
  background: "#F8FAFC",
  text: "#1E293B",
  grid: "#E2E8F0",
};

// KYC verification time data (replace with actual KYC data)
const verificationData = [
  { month: "Jan", avgTime: 2.5, maxTime: 5 },
  { month: "Feb", avgTime: 3, maxTime: 6 },
  { month: "Mar", avgTime: 2, maxTime: 4 },
  { month: "Apr", avgTime: 4, maxTime: 7 },
  { month: "May", avgTime: 3.5, maxTime: 6 },
  { month: "Jun", avgTime: 2.2, maxTime: 4.5 },
  { month: "Jul", avgTime: 2.7, maxTime: 5 },
  { month: "Aug", avgTime: 3.2, maxTime: 6 },
  { month: "Sep", avgTime: 2.9, maxTime: 5.2 },
  { month: "Oct", avgTime: 2.3, maxTime: 4.7 },
];

// Tooltip for displaying verification times
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-semibold text-sm text-gray-900">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Avg. Verification Time:{" "}
            <span className="font-medium text-gray-900">
              {payload[0]?.value} days
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Max Verification Time:{" "}
            <span className="font-medium text-gray-900">
              {payload[1]?.value} days
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const LineChartView = () => {
  const [getDivPng, { ref: lineRef }] = useGenerateImage<HTMLDivElement>({
    quality: 1,
    type: "image/png",
  });

  const handleDownload = useCallback(async () => {
    const png = await getDivPng();
    if (png) {
      FileSaver.saveAs(png, "verification-time-distribution.png");
    }
  }, [getDivPng]);

  return (
    <Card className="w-full h-fit bg-white border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-8 px-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
          Verification Time Distribution
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="bg-white text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors border-gray-200"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="pt-4 px-6">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6">
          <div ref={lineRef} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={verificationData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: colors.text }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                  tickMargin={15}
                  label={{
                    value: "Month",
                    position: "bottom",
                    offset: 5,
                    style: { fill: colors.text },
                  }}
                />
                <YAxis
                  tick={{ fill: colors.text }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                  tickMargin={15}
                  label={{
                    value: "Time (days)",
                    angle: -90,
                    position: "left",
                    offset: 10,
                    style: { fill: colors.text },
                  }}
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
                <Line
                  type="monotone"
                  dataKey="avgTime"
                  stroke={colors.primary}
                  strokeWidth={3}
                  dot={{ r: 4, fill: colors.primary }}
                  activeDot={{ r: 6 }}
                  name="Avg. Verification Time"
                />
                <Line
                  type="monotone"
                  dataKey="maxTime"
                  stroke={colors.secondary}
                  strokeWidth={3}
                  dot={{ r: 4, fill: colors.secondary }}
                  activeDot={{ r: 6 }}
                  name="Max Verification Time"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChartView;
