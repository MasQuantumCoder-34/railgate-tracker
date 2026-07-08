import Link from "next/link";
import { Train } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-6 mb-6">
        <Train className="h-16 w-16 text-amber-600 dark:text-amber-400" />
      </div>
      <h1 className="text-6xl font-bold text-brand-500 dark:text-brand-300 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-2">Off the Tracks</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        This page has derailed. The route you&apos;re looking for doesn&apos;t
        exist on our railway network.
      </p>
      <Link href="/">
        <Button>Return to Station</Button>
      </Link>
    </div>
  );
}
