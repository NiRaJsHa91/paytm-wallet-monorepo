import express from "express"
import db from "@repo/db/client"
import bodyParser from "body-parser"

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/hdfcWebhook", async(req, res) => {
  // toadd: add zod validation
  // tocheck: if request actually came from HDFC bank, using webhook secret here

  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  const txn_to_update = await db.onRampTransaction.findFirst({
    where: {
      token: paymentInformation.token,
    },
    select: {
      status: true,
    },
  });
  // tocheck: if an onRamptxn is still processiong or not
  if (!txn_to_update) return res.status(400).json({ message: "Invalid token" });
  if (txn_to_update?.status === "Success")
    return res.status(200).json({ message: "Txn already processed" });
  try {
    await db.$transaction([
      db.balance.update({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            // You can also get this from your DB
            increment: Number(paymentInformation.amount),
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.status(200).json({ message: "captured" });
  } catch (error) {
    console.log(error);
    res.status(411).json({ message: "Error while processing webhook" });
  }
})
 
app.listen(3002, () => console.log("Listening on port 3002"))