"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm mt-3">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-2">
        <button className="hover:bg-gray-100 p-2 rounded-full ml-3" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold">Thread</h1>
      </div>
    </div>

  )
}