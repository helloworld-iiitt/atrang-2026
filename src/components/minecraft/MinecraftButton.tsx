"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useBlockBreak } from "@/hooks/useBlockBreak";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { emitBurst, PALETTES } from "@/lib/particles";
import { cn } from "@/lib/utils";
import { CrackOverlay } from "./BreakableBlock";

type Variant = "stone" | "grass" | "gold" | "slate";
type Size = "sm" | "md" | "lg" | "icon";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  /** Play the crack → burst sequence before the action. Disable for instant actions. */
  breakEffect?: boolean;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "onClick"> & {
    href?: undefined;
    onActivate?: () => void;
  };

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href"> & {
    href: string;
    external?: boolean;
  };

export type MinecraftButtonProps = ButtonProps | LinkProps;

const VARIANT_CLASS: Record<Variant, string> = {
  stone: "",
  grass: "mc-btn--grass",
  gold: "mc-btn--gold",
  slate: "mc-btn--slate",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "mc-btn--sm",
  md: "",
  lg: "mc-btn--lg",
  icon: "mc-btn--icon",
};

const CRACK_SIZE: Record<Size, number> = { sm: 32, md: 48, lg: 52, icon: 32 };

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function MinecraftButton(props: MinecraftButtonProps) {
  const { children, variant = "stone", size = "md", icon, fullWidth, className, breakEffect = true } = props;
  const router = useRouter();
  const play = useSoundEffects();
  const palette = PALETTES[variant === "grass" ? "grass" : variant];
  const { ref, trigger, phase, stage, isBusy } = useBlockBreak<HTMLElement>({ palette });

  const classes = cn("mc-btn", VARIANT_CLASS[variant], SIZE_CLASS[size], fullWidth && "w-full", className);

  const content = (
    <>
      {icon ? (
        <span aria-hidden className="relative z-[1] inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      {size === "icon" ? children : <span className="relative z-[1] truncate">{children}</span>}
      <CrackOverlay phase={phase} stage={stage} size={CRACK_SIZE[size]} />
    </>
  );

  const instantBurst = () => {
    play("pop");
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      emitBurst({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, palette, count: 8 });
    }
  };

  if (props.href !== undefined) {
    const { href, external, onClick, ...rest } = stripCommon(props) as LinkProps;
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || isModifiedClick(event)) return;
      if (external || !breakEffect) {
        instantBurst();
        return;
      }
      event.preventDefault();
      if (isBusy) return;
      trigger(() => router.push(href));
    };

    if (external) {
      return (
        <a
          {...rest}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={handleClick}
          data-break={phase === "idle" ? undefined : phase}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        {...rest}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onClick={handleClick}
        aria-busy={isBusy || undefined}
        data-break={phase === "idle" ? undefined : phase}
      >
        {content}
      </Link>
    );
  }

  const { onActivate, type = "button", disabled, ...rest } = stripCommon(props) as ButtonProps;
  const handleClick = () => {
    if (isBusy || disabled) return;
    if (!breakEffect) {
      play("click");
      onActivate?.();
      return;
    }
    trigger(() => onActivate?.());
  };

  return (
    <button
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={classes}
      onClick={handleClick}
      aria-busy={isBusy || undefined}
      data-break={phase === "idle" ? undefined : phase}
    >
      {content}
    </button>
  );
}

function stripCommon(props: MinecraftButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, variant, size, icon, fullWidth, className, breakEffect, ...rest } = props;
  return rest;
}
