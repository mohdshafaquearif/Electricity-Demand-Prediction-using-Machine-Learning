// pages/page.tsx
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import RULModel from "./RUL";

export const metadata: Metadata = {
  title: "RUL Prediction System",
  description: "Predict Remaining Useful Life of equipment",
};

const RULPage: React.FC = () => {
  return (
    <DefaultLayout>
      <RULModel />
    </DefaultLayout>
  );
};

export default RULPage;