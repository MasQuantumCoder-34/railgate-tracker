"use client";

export function MapSection() {
  return (
    <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Location
        </p>
      </div>
      <div className="h-40 bg-[hsl(var(--muted))] relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.5!2d78.6167!3d12.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDQwJzU5LjkiTiA3OMKwMzcnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Vaniyambadi Railway Gate"
        />
      </div>
    </div>
  );
}