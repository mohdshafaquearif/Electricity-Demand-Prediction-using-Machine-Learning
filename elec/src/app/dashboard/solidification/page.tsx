// HourlyReportPage.tsx
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import SolidificationModel from "./Solidi";

export const metadata: Metadata = {
  title: "Solidification Prediction",
  description: "Make predictions using the solidification model",
};

const HourlyReportPage: React.FC = () => {
  return (
    <DefaultLayout>
      <SolidificationModel />
    </DefaultLayout>
  );
};

export default HourlyReportPage;