import { NextResponse } from "next/server";
import Retell from "retell-sdk";

const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST() {
  try {
    const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

    if (!agentId) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_RETELL_AGENT_ID is not set" },
        { status: 500 }
      );
    }

    const callResponse = await retell.call.createWebCall({
      agent_id: agentId,
    });

    return NextResponse.json(callResponse);
  } catch (error) {
    console.error("Error registering call:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to register call" },
      { status: 500 }
    );
  }
}
