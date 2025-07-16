import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import BiWeeklyMultiModel from "./BiWeekly";

export const metadata: Metadata = {
  title: "Two Week Report",
  description:
    "This is the page to check bi weekly report",
};

const DailyReportPage: React.FC = () => {
  return (
    <DefaultLayout>
      <BiWeeklyMultiModel />
    </DefaultLayout>
  );
};

export default DailyReportPage;
