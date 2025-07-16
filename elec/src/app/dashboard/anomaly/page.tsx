// HourlyReportPage.tsx
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import AnomalyModel from "./Anom";

export const metadata: Metadata = {
  title: "Anomaly Detection System",
  description: "Monitor and detect anomalies in fluid temperature system",
};

const HourlyReportPage: React.FC = () => {
  return (
    <DefaultLayout>
      <AnomalyModel />
    </DefaultLayout>
  );
};

export default HourlyReportPage;