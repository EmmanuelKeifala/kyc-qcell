"use client";
import Barcharts from "@/components/charts/Barcharts";
import LineChartView from "@/components/charts/LineChart";
import PiechartView from "@/components/charts/Piechart";
import ScatterChartView from "@/components/charts/ScatterChart";
import FacilityCard from "@/components/FacilityCard";
import { Paperclip } from "lucide-react";
const AdminPage = () => {
  return (
    <div className="p-4 flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-xl font-bold">Dashboard</h1>
          <div className="bg-[#008080] px-3 py-2 flex items-center gap-3 rounded-lg">
            <Paperclip size={25} className="text-white" />
            <span className="text-white">Export as PDF</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="hidden md:block text-lg font-bold text-[#008080] px-2 ">
            Farmer &apos; s Data
          </h1>
          <div className="flex gap-4 justify-evenly flex-wrap">
            <FacilityCard label="Hub 1" value={10} />
            <FacilityCard label="Hub 2" value={11} />
            <FacilityCard label="Hub 3" value={200} />
            <FacilityCard label="Hub 4" value={300} />
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4  rounded-lg ">
          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Pie chart */}
            <div className="flex-1  rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <PiechartView />
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <Barcharts />
              </div>
            </div>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <ScatterChartView />
              </div>
            </div>

            {/* Line Chart */}
            <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <LineChartView />
              </div>
            </div>
          </div>

          {/* MAP With locations */}
          <div className="w-full  rounded-lg shadow-md overflow-hidden">
            <div className="h-full p-4">{/* Your Map Component */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
