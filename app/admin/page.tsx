"use client";
import Barcharts from "@/components/charts/Barcharts";
import LineChartView from "@/components/charts/LineChart";
import PiechartView from "@/components/charts/Piechart";
import ScatterChartView from "@/components/charts/ScatterChart";
import MapWithClusters from "@/components/Map";
import StatCard from "@/components/StatCard";
import { userLocations } from "@/constants/mockData";
const AdminPage = () => {
  return (
    <div className="p-4 flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-xl font-bold">Dashboard</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-evenly flex-wrap">
            <StatCard label="Hub 1" value={10} />
            <StatCard label="Hub 2" value={11} />
            <StatCard label="Hub 3" value={200} />
            <StatCard label="Hub 4" value={300} />
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4  rounded-lg ">
          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Pie chart */}
            {/* <div className="flex-1  rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <PiechartView />
              </div>
            </div> */}

            {/* Bar chart */}
            <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <Barcharts />
              </div>
            </div>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <ScatterChartView />
              </div>
            </div> */}

            {/* Line Chart */}
            <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <LineChartView />
              </div>
            </div>
          </div>

          {/* MAP With locations */}
          <div className="w-full  rounded-lg shadow-md overflow-hidden">
            <div className="h-full p-4">
              <MapWithClusters userLocations={userLocations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
