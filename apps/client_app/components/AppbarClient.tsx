"use client";

import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AppbarClient() {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="border-b border-slate-300">
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          router.push("/api/auth/signin");
        }}
        user={session?.data?.user}
      />
    </div>
  );
}

