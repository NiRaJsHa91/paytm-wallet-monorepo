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
                await createP2Ptransfer(number, Number(amount)*100)
                router.push("/dashboard")
              }}>Send</Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
}