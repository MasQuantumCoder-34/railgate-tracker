"use client";

import { useEffect, useState } from "react";
import { Train } from "lucide-react";

export function SplashLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("gw_splash_shown");
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem("gw_splash_shown", "true");
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-500 dark:bg-brand-800 animate-fadeIn">
      <div className="animate-pulse">
        <Train className="h-16 w-16 text-white mb-4" />
      </div>
      <h1 className="text-2xl font-bold text-white">GateWatch</h1>
      <p className="text-sm text-white/80 mt-1">Vaniyambadi</p>
    </div>
  );
}
