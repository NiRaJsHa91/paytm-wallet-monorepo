"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { createP2Ptransfer } from "../app/lib/actions/createP2Ptransfer";
import { useRouter } from "next/navigation";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const router  = useRouter()

  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2 ">
            <TextInput
              placeholder={"Number"}
              label="Number"
              onChange={(value) => {
                setNumber(value);
              }}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              onChange={(value) => {
                setAmount(value);
              }}
            />
            <div className="pt-4 flex justify-center">
              <Button onClick={async() => {
                try {
                  const response = await createP2Ptransfer(
                    number,
                    Number(amount) * 100
                  );
                  if (response?.message === "User not found")
                    return alert("User not found");

                  alert("Money Sent");
                  router.push("/dashboard");
                } catch (error: any) {
                  return alert(`Something went wrong. Please add funds in transfer section if you do not have sufficient funds.`);
                }

              }}>Send</Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
}
