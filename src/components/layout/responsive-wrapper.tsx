import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
  /** Padding configuration */
  padding?: "none" | "sm" | "md" | "lg";
  /** Whether to animate entrance */
  animate?: boolean;
  /** Animation delay in seconds */
  animationDelay?: number;
  /** Maximum width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  /** Whether to center content */
  center?: boolean;
  /** As which element to render */
  as?: keyof JSX.IntrinsicElements;
}

const paddingClasses = {
  none: "",
  sm: "px-4 sm:px-5 md:px-6",
  md: "px-5 sm:px-6 md:px-8",
  lg: "px-6 sm:px-8 md:px-10",
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function ResponsiveWrapper({
  children,
  className,
  padding = "md",
  animate = false,
  animationDelay = 0,
  maxWidth = "full",
  center = false,
  as: Component = "div",
}: ResponsiveWrapperProps) {
  const baseClasses = cn(
    "w-full",
    paddingClasses[padding],
    maxWidthClasses[maxWidth],
    center && "mx-auto",
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: animationDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <Component className={baseClasses}>{children}</Component>;
}

// Responsive Section Component
interface ResponsiveSectionProps {
  children: ReactNode;
  className?: string;
  /** Section spacing */
  spacing?: "sm" | "md" | "lg";
  /** Background style */
  background?: "none" | "surface" | "elevated" | "glass";
  /** Whether to animate entrance */
  animate?: boolean;
  animationDelay?: number;
}

const spacingClasses = {
  sm: "py-4 sm:py-5 md:py-6",
  md: "py-6 sm:py-8 md:py-10",
  lg: "py-8 sm:py-10 md:py-12",
};

const backgroundClasses = {
  none: "",
  surface: "surface",
  elevated: "surface-elevated",
  glass: "surface-glass",
};

export function ResponsiveSection({
  children,
  className,
  spacing = "md",
  background = "none",
  animate = false,
  animationDelay = 0,
}: ResponsiveSectionProps) {
  const baseClasses = cn(
    "w-full",
    spacingClasses[spacing],
    backgroundClasses[background],
    background !== "none" && "rounded-2xl sm:rounded-3xl",
    className
  );

  if (animate) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: animationDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={baseClasses}
      >
        {children}
      </motion.section>
    );
  }

  return <section className={baseClasses}>{children}</section>;
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  /** Number of columns on mobile */
  cols?: 1 | 2;
  /** Number of columns on tablet (md) */
  colsMd?: 2 | 3 | 4;
  /** Number of columns on desktop (lg) */
  colsLg?: 2 | 3 | 4 | 5 | 6;
  /** Gap size */
  gap?: "sm" | "md" | "lg";
  /** Whether to animate children */
  animate?: boolean;
}

const gapClasses = {
  sm: "gap-2 sm:gap-3",
  md: "gap-3 sm:gap-4",
  lg: "gap-4 sm:gap-5 md:gap-6",
};

export function ResponsiveGrid({
  children,
  className,
  cols = 2,
  colsMd,
  colsLg,
  gap = "md",
  animate = false,
}: ResponsiveGridProps) {
  const colsClass = cols === 1 ? "grid-cols-1" : "grid-cols-2";
  const colsMdClass = colsMd ? `md:grid-cols-${colsMd}` : "";
  const colsLgClass = colsLg ? `lg:grid-cols-${colsLg}` : "";

  return (
    <div
      className={cn(
        "grid",
        colsClass,
        colsMdClass,
        colsLgClass,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive Card Component
interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  /** Card style variant */
  variant?: "default" | "elevated" | "glass" | "outline";
  /** Padding size */
  padding?: "sm" | "md" | "lg";
  /** Whether to animate on hover */
  hover?: boolean;
  /** Whether to animate entrance */
  animate?: boolean;
  animationDelay?: number;
  /** Click handler */
  onClick?: () => void;
}

const cardVariantClasses = {
  default: "surface",
  elevated: "surface-elevated",
  glass: "surface-glass",
  outline: "border border-border bg-transparent",
};

const cardPaddingClasses = {
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6 md:p-8",
};

export function ResponsiveCard({
  children,
  className,
  variant = "default",
  padding = "md",
  hover = false,
  animate = false,
  animationDelay = 0,
  onClick,
}: ResponsiveCardProps) {
  const baseClasses = cn(
    "rounded-2xl sm:rounded-3xl",
    cardVariantClasses[variant],
    cardPaddingClasses[padding],
    hover && "transition-transform duration-200 hover:-translate-y-1",
    onClick && "cursor-pointer",
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.4,
          delay: animationDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={hover ? { y: -4 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={baseClasses}>
      {children}
    </div>
  );
}

// Responsive Text Components
interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  variant?: "display" | "title" | "subtitle" | "body" | "caption" | "eyebrow";
  animate?: boolean;
  animationDelay?: number;
}

const textVariantClasses = {
  display: "display-font text-2xl sm:text-3xl md:text-4xl leading-tight",
  title: "display-font text-xl sm:text-2xl leading-tight",
  subtitle: "text-sm sm:text-base text-muted-foreground leading-relaxed",
  body: "text-sm sm:text-base leading-relaxed",
  caption: "text-xs sm:text-sm text-muted-foreground",
  eyebrow: "eyebrow",
};

export function ResponsiveText({
  children,
  className,
  as: Component = "p",
  variant = "body",
  animate = false,
  animationDelay = 0,
}: ResponsiveTextProps) {
  const baseClasses = cn(textVariantClasses[variant], className);

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: animationDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Component className={baseClasses}>{children}</Component>
      </motion.div>
    );
  }

  return <Component className={baseClasses}>{children}</Component>;
}

// Responsive Stack (Flex container with responsive gap)
interface ResponsiveStackProps {
  children: ReactNode;
  className?: string;
  /** Stack direction */
  direction?: "row" | "column";
  /** Responsive direction (changes at breakpoint) */
  responsiveDirection?: {
    mobile: "row" | "column";
    tablet?: "row" | "column";
    desktop?: "row" | "column";
  };
  /** Gap size */
  gap?: "xs" | "sm" | "md" | "lg";
  /** Alignment */
  align?: "start" | "center" | "end" | "stretch";
  /** Justification */
  justify?: "start" | "center" | "end" | "between" | "around";
  /** Whether to wrap */
  wrap?: boolean;
}

const stackGapClasses = {
  xs: "gap-1 sm:gap-2",
  sm: "gap-2 sm:gap-3",
  md: "gap-3 sm:gap-4",
  lg: "gap-4 sm:gap-6",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export function ResponsiveStack({
  children,
  className,
  direction = "column",
  responsiveDirection,
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
}: ResponsiveStackProps) {
  let directionClasses = direction === "row" ? "flex-row" : "flex-col";
  
  if (responsiveDirection) {
    directionClasses = cn(
      responsiveDirection.mobile === "row" ? "flex-row" : "flex-col",
      responsiveDirection.tablet && `md:${responsiveDirection.tablet === "row" ? "flex-row" : "flex-col"}`,
      responsiveDirection.desktop && `lg:${responsiveDirection.desktop === "row" ? "flex-row" : "flex-col"}`
    );
  }

  return (
    <div
      className={cn(
        "flex",
        directionClasses,
        stackGapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

// Export all components
export {
  type ResponsiveWrapperProps,
  type ResponsiveSectionProps,
  type ResponsiveGridProps,
  type ResponsiveCardProps,
  type ResponsiveTextProps,
  type ResponsiveStackProps,
};
