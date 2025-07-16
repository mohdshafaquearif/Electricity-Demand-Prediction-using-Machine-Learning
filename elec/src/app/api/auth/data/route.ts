// api/data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, area } = session.user;

    let demandData;
    if (role === UserRole.ADMIN || role === UserRole.SUPERVISOR) {
      demandData = await prisma.demandData.findMany();
    } else if (role === UserRole.AREA_MANAGER && area) {
      demandData = await prisma.demandData.findMany({
        where: { area: area },
      });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(demandData);
  } catch (error) {
    console.error("Data fetch error:", error);
    return NextResponse.json({ error: "An error occurred while fetching data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, area } = session.user;
    if (role !== UserRole.AREA_MANAGER || !area) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { timestamp, demand } = body;

    if (!timestamp || !demand) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newDemandData = await prisma.demandData.create({
      data: {
        area,
        timestamp: new Date(timestamp),
        demand: parseFloat(demand),
        userId: session.user.id
      }
    });

    return NextResponse.json(newDemandData);
  } catch (error) {
    console.error("Data creation error:", error);
    return NextResponse.json({ error: "An error occurred while creating data" }, { status: 500 });
  }
}