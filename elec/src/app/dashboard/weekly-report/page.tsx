
import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import WeeklyMultiModel from "./Weekly";

export const metadata: Metadata = {
  title: "Weekly Report",
  description:
    "This is the page to check weekly report",
};

const HourlyReportPage: React.FC = () => {
  return (
    <DefaultLayout>
      <WeeklyMultiModel />
    </DefaultLayout>
  );
};

export default HourlyReportPage;
