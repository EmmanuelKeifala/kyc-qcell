import React from "react";

type Props = {
  value: number;
  label: string;
  title?: string;
};

function StatCard({ value, label, title }: Props) {
  return (
    <div className="rounded-xl bg-[#dacbbc] p-4 text-white flex-1 w-[350px] flex justify-between items-end  ">
      <div>
        {/* <span className="text-sm text-[#F78F1E] px-2 py-1 break-before-all ">
          {title}
        </span> */}
        <h1 className="text-2xl text-[#a57a4b] px-2 py-1 font-bold  ">
          {label}
        </h1>
      </div>
      <div className="flex gap-4 bg-gray-200 px-3 py-2 rounded-lg">
        <h2 className="capitalize text-xl font-bold select-none text-[#F78F1E]">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default StatCard;
