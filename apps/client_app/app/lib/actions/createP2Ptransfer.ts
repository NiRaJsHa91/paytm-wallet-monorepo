"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@repo/db/client";

export async function createP2Ptransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions)
    const from = session?.user?.id
    if(!from){
        return{
            message: "Error while sending money"
        }
    }  
    const toUser = await db.user.findFirst({
        where: {
            number: to
        }
    })
    if(!toUser) return {"message": "User not found"}

     await db.$transaction(async (tx) => {
      //locking row for update
      // in monodb a txn reverts back automatically if a change happened to rows in db while txn is running
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

       const fromBalance = await tx.balance.findUnique({
         where: { userId: Number(from) },
       });
       if (!fromBalance || fromBalance.amount < amount) {
         throw new Error("Insufficient funds");
       }

        await tx.balance.update({
          where: { userId: Number(from) },
          data: { amount: { decrement: amount } },
        });

        await tx.balance.update({
          where: { userId: toUser.id },
          data: { amount: { increment: amount } },
        });

        await tx.p2pTransfer.create({
          data: {
            fromUserId: Number(from),
            toUserId: toUser.id,
            amount,
            timestamp: new Date(),
          },
        });
    
     });
}
