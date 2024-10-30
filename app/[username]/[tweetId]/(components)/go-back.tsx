"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter()
  return (
    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
      <ArrowLeft className="h-5 w-5" />
      <span className="sr-only">Go back</span>
    </Button>

  )
}