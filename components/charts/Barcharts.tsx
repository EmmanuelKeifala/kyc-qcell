import React, { useCallback, useState } from "react";
import FileSaver from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
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

const colors = {
  verified: "#F78F1E", // Original base color for verified (warm, bold)
  unverified: "#FFB94D", // Lighter, more muted shade for unverified (subtle contrast)
  background: "#F8FAFC", // Light gray background for contrast
  text: "#1E293B", // Dark blue-gray text for legibility
  grid: "#E2E8F0", // Light, soft grid lines
};

const userData: any = {
  westernAreaUrban: [
    { name: "Jan", verified: 1200, unverified: 400 },
    { name: "Feb", verified: 1300, unverified: 500 },
    { name: "Mar", verified: 1250, unverified: 450 },
    { name: "Apr", verified: 1400, unverified: 600 },
    { name: "May", verified: 1500, unverified: 650 },
    { name: "Jun", verified: 1550, unverified: 700 },
  ],
  bo: [
    { name: "Jan", verified: 1000, unverified: 300 },
    { name: "Feb", verified: 1100, unverified: 400 },
    { name: "Mar", verified: 1050, unverified: 350 },
    { name: "Apr", verified: 1200, unverified: 500 },
    { name: "May", verified: 1300, unverified: 550 },
    { name: "Jun", verified: 1350, unverified: 600 },
  ],
  kenema: [
    { name: "Jan", verified: 900, unverified: 200 },
    { name: "Feb", verified: 950, unverified: 250 },
    { name: "Mar", verified: 1000, unverified: 300 },
    { name: "Apr", verified: 1100, unverified: 400 },
    { name: "May", verified: 1200, unverified: 450 },
    { name: "Jun", verified: 1250, unverified: 500 },
  ],
  bombali: [
    { name: "Jan", verified: 800, unverified: 150 },
    { name: "Feb", verified: 850, unverified: 200 },
    { name: "Mar", verified: 900, unverified: 250 },
    { name: "Apr", verified: 1000, unverified: 300 },
    { name: "May", verified: 1100, unverified: 350 },
    { name: "Jun", verified: 1150, unverified: 400 },
  ],
};

const districts = [
  { value: "westernAreaUrban", label: "Western Area Urban" },
  { value: "bo", label: "Bo" },
  { value: "kenema", label: "Kenema" },
  { value: "bombali", label: "Bombali" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-semibold text-sm text-gray-900">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Verified:{" "}
            <span className="font-medium text-gray-900">
              {payload[0].value}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Unverified:{" "}
            <span className="font-medium text-gray-900">
              {payload[1].value}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Barcharts = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("westernAreaUrban");
  const [getDivPng, { ref: chartRef }] = useGenerateImage({
    quality: 1,
    type: "image/png",
  });

  const handleDownload = useCallback(async () => {
    const png = await getDivPng();
    if (png) {
      FileSaver.saveAs(png, "qcell-kyc-district-distribution.png");
    }
  }, [getDivPng]);

  const getStats = (data: any[]) => {
    const totalVerified = data.reduce((acc, curr) => acc + curr.verified, 0);
    const totalUnverified = data.reduce(
      (acc, curr) => acc + curr.unverified,
      0
    );
    const avgVerified = totalVerified / data.length;
    const avgUnverified = totalUnverified / data.length;
    return { totalVerified, totalUnverified, avgVerified, avgUnverified };
  };

  const stats = getStats(userData[selectedDistrict]);

  return (
    <Card className="w-full h-fit bg-white border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-8 px-6">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Q-Cell KYC Compliance by District
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Verified and unverified Q-Cell users across Sierra Leone districts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-48 border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem
                  key={district.value}
                  value={district.value}
                  className="hover:bg-gray-50"
                >
                  {district.label}
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
          <div ref={chartRef} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userData[selectedDistrict]}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: colors.text }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: colors.text }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                  width={80}
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
                <Bar
                  dataKey="verified"
                  fill={colors.verified}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="unverified"
                  fill={colors.unverified}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-100">
            <p className="text-sm font-medium text-teal-600">
              Verified Users Stats
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Total Verified:</span>
                <span className="font-medium text-teal-700">
                  {stats.totalVerified.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-teal-600">Average Verified:</span>
                <span className="font-medium text-teal-700">
                  {stats.avgVerified.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm font-medium text-purple-600">
              Unverified Users Stats
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-600">
                  Total Unverified:
                </span>
                <span className="font-medium text-purple-700">
                  {stats.totalUnverified.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-600">
                  Average Unverified:
                </span>
                <span className="font-medium text-purple-700">
                  {stats.avgUnverified.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Barcharts;
