// app/dashboard/DashboardClient.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      // Redirect to login if no active session
      router.push("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading state while checking session
  }
console.log(session);
  return (
    <DefaultLayout>
      <p>Welcome, {session?.user.name}!</p>
      <p>Your role: {session?.user.role}</p>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 animate-bounce">Welcome to Your Dashboard</h1>
      <div className="flex flex-col space-y-4">
        <Link href="/dashboard/hourly-report">
          <div className="block p-4 text-center text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 cursor-pointer">
            Hourly Report
          </div>
        </Link>
        <Link href="/dashboard/weekly-report">
          <div className="block p-4 text-center text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105 cursor-pointer">
            Weekly Report
          </div>
        </Link>
        <Link href="/dashboard/bi-weekly">
          <div className="block p-4 text-center text-white bg-purple-500 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 transform hover:scale-105 cursor-pointer">
            Two Week Report
          </div>
        </Link>
      </div>
    </div>
    </DefaultLayout>
  );
}
