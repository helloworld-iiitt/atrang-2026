"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { backdrop, modalPanel } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { MinecraftButton } from "../minecraft/MinecraftButton";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
  /** Optional visual placed beside the title. */
  icon?: ReactNode;
};

let openCount = 0;
const noopSubscribe = () => () => {};

export function Modal({ open, onClose, title, eyebrow, children, footer, size = "md", icon }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const play = useSoundEffects();
  const onCloseRef = useRef(onClose);
  const canPortal = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    openCount += 1;
    document.documentElement.dataset.modalOpen = "true";
    play("open");

    const focusFirst = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      const target = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
      target?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === panelRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFirst);
      document.removeEventListener("keydown", onKeyDown);
      openCount -= 1;
      if (openCount === 0) delete document.documentElement.dataset.modalOpen;
      play("close");
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, play]);

  if (!canPortal) return null;

  // Portal to <body> so ancestors with transforms or filters can't capture `position: fixed`.
  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-[rgb(4_6_12/0.72)] backdrop-blur-[3px]"
            variants={backdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            variants={modalPanel}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              "mc-panel relative flex max-h-[92dvh] w-full flex-col outline-none sm:max-h-[88dvh]",
              size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg",
            )}
          >
            <header className="flex items-start gap-4 border-b-2 border-black/60 px-5 pt-5 pb-4 sm:px-7">
              {icon ? <div className="shrink-0">{icon}</div> : null}
              <div className="min-w-0 flex-1">
                {eyebrow ? (
                  <p className="font-pixel mb-1 text-xs tracking-[0.25em] text-gold uppercase">{eyebrow}</p>
                ) : null}
                <h2
                  id={titleId}
                  className="font-pixel text-2xl leading-tight font-bold text-bone text-shadow-pixel sm:text-3xl"
                >
                  {title}
                </h2>
              </div>
              <MinecraftButton
                variant="slate"
                size="icon"
                breakEffect={false}
                onActivate={onClose}
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={3} />
              </MinecraftButton>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
            {footer ? (
              <footer className="flex flex-col-reverse gap-3 border-t-2 border-black/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
