"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTransaction";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
  const [addMoneyDeatils, setAddMoneyDeatils] = useState({
    amount: 100,
    provider: SUPPORTED_BANKS[0]?.name,
  });
  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={value => setAddMoneyDeatils({ ...addMoneyDeatils, amount: Number(value) })}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={value =>{
              setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl);
              setAddMoneyDeatils({ ...addMoneyDeatils, provider: value})
          } }
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={async() => {
              const token = (Math.random() * 1000).toString();
              const userId = await createOnRampTransaction(addMoneyDeatils.provider || "", addMoneyDeatils.amount, token)
              try {
                await axios.post("http://localhost:3002/hdfcWebhook", {
                  token,
                  amount: addMoneyDeatils.amount * 100,
                  user_identifier: userId.userId,
                });
                window.location.reload();
                alert("Money added Sucessfully")

              } catch (error) {
                alert("Something went wrong");
              }      
            }}
          >
            Add Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
