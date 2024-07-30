"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@repo/db/client";

export async function createOnRampTransaction(provider: string, amount: number) {
  const session = await getServerSession(authOptions);

  if (!session.user || !session.user.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  // Ideally the token should come from the banking provider (hdfc/axis)

  const token = (Math.random() * 1000).toString()
  await db.onRampTransaction.create({
    data: {
      token,
      provider,
      amount: amount * 100,
      status: "Processing",
      startTime: new Date(),
      userId: Number(session.user.id),
    },
  })

  return {
    message: "Done"
  }
}