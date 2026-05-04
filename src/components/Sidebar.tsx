import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SidebarItem({ 
  icon, 
  label, 
  active 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer group text-xs uppercase tracking-widest font-semibold",
      active ? "bg-[#161616] border border-[#262626] text-white" : "text-neutral-500 hover:text-neutral-300"
    )}>
      <span className={cn(active ? "text-[#14F195]" : "text-neutral-600 group-hover:text-neutral-400")}>
        {icon}
      </span>
      {label}
    </div>
  );
}
