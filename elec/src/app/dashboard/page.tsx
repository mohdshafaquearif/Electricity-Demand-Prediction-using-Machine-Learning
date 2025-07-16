// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // You can perform any server-side data fetching here
  // For example, fetching user data from the database
  // const userData = await fetchUserData(session.user.id);

  return <DashboardClient user={session.user} />;
}