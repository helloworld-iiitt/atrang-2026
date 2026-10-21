"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { isTypingTarget } from "@/lib/utils";

type EventSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EventSearch({ value, onChange }: EventSearchProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || isTypingTarget(event.target) || event.metaKey || event.ctrlKey) return;
      if (document.documentElement.dataset.modalOpen) return;
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search events by title or description
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-mist"
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.stopPropagation();
            onChange("");
          }
        }}
        placeholder="Search events…"
        autoComplete="off"
        spellCheck={false}
        className="mc-input pr-24 pl-11 [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="grid size-8 place-items-center text-mist hover:text-bone"
            aria-label="Clear search"
          >
            <X className="size-4" strokeWidth={3} />
          </button>
        ) : (
          <kbd className="font-pixel hidden border-2 border-[#555] px-2 py-0.5 text-xs text-mist sm:inline-block">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
