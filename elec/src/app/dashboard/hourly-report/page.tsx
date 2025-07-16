import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import HourlyMultiModel from "./Hourly";

export const metadata: Metadata = {
  title: "Hourly Report",
  description:
    "This is the page to check daily report",
};

const HourlyReportPage: React.FC = () => {
  return (
    <DefaultLayout>
      <HourlyMultiModel />
    </DefaultLayout>
  );
};

export default HourlyReportPage;
