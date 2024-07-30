"use client";

import { usePathname, useRouter } from "next/navigation";

type SidebarProps = {
    href: string;
    title: string;
    icon: React.ReactNode;
}

export default function SidebarItem({ href, title, icon }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div
      className={` ${isActive ? "text-[#6a51a6]" : "text-slate-500"} flex w-full  p-2 pl-8 cursor-pointer `}
      onClick={() => router.push(href)}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <div className="ml-2 font-semibold">{title}</div>
    </div>
  );
}