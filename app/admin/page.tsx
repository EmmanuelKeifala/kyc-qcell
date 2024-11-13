"use client";
import { Suspense, lazy } from "react";
import StatCard from "@/components/StatCard";
import { userLocations } from "@/constants/mockData";

// Dynamically import components that depend on window
const Barcharts = lazy(() => import("@/components/charts/Barcharts"));
const LineChartView = lazy(() => import("@/components/charts/LineChart"));
const MapWithClusters = lazy(() => import("@/components/Map"));

// Loading placeholder components
const ChartPlaceholder = () => (
  <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg"></div>
);

const MapPlaceholder = () => (
  <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg"></div>
);

const AdminPage = () => {
  return (
    <div className="p-4 flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-xl font-bold">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-evenly flex-wrap">
            <StatCard label="Hub 1" value={10} />
            <StatCard label="Hub 2" value={11} />
            <StatCard label="Hub 3" value={200} />
            <StatCard label="Hub 4" value={300} />
          </div>
        </div>

        {/* Charts and Map Section */}
        <div className="flex flex-col gap-6 p-4 rounded-lg">
          {/* Bar Chart Section */}
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <Suspense fallback={<ChartPlaceholder />}>
                  <Barcharts />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Line Chart Section */}
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="flex-1 rounded-lg shadow-md overflow-hidden">
              <div className="h-full p-4">
                <Suspense fallback={<ChartPlaceholder />}>
                  <LineChartView />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full rounded-lg shadow-md overflow-hidden">
            <div className="h-full p-4">
              <Suspense fallback={<MapPlaceholder />}>
                <MapWithClusters userLocations={userLocations as any} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
