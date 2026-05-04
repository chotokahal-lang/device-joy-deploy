import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo3DImg } from "@/components/ui/logo-3d-img";
import { LiveText } from "@/components/ui/live-text";

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  back?: string | true;
  right?: ReactNode;
  showLogo?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  back,
  right,
  showLogo = false,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className="px-6 pb-6 relative z-10"
      style={{ paddingTop: "max(3rem, calc(env(safe-area-inset-top, 0px) + 1.25rem))" }}
    >
      <div className="flex items-center justify-between mb-6">
        {/* Left: back button or spacer */}
        {back ? (
          typeof back === "string" ? (
            <Link to={back} aria-label="Kembali" className="shrink-0">
              <BackButton />
            </Link>
          ) : (
            <button
              onClick={() => navigate(-1)}
              aria-label="Kembali"
              className="shrink-0"
            >
              <BackButton />
            </button>
          )
        ) : (
          <span className="w-11 h-11 shrink-0" />
        )}

        {/* Center: logo (optional) */}
        {showLogo && (
          <Link to="/" aria-label="Beranda" className="shrink-0">
            <Logo3DImg size="sm" intensity="low" />
          </Link>
        )}

        {/* Right: action slot — auto-width so 2+ buttons fit */}
        <div className="flex items-center justify-end shrink-0">{right ?? <span className="w-11 h-11" />}</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {eyebrow && (
          <p className="eyebrow mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {typeof eyebrow === "string" ? (
              <LiveText as="span" id={`ph-eyebrow-${eyebrow.replace(/\s+/g, "")}`} defaultText={eyebrow} />
            ) : (
              eyebrow
            )}
          </p>
        )}
        {title && (
          <h1 className="display-font text-[1.75rem] sm:text-[2rem] leading-[1.05] text-foreground break-words hyphens-auto">
            {typeof title === "string" ? (
              <LiveText as="span" id={`ph-title-${title.replace(/\s+/g, "")}`} defaultText={title} />
            ) : (
              title
            )}
          </h1>
        )}
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[34ch]">
            {typeof subtitle === "string" ? (
              <LiveText as="span" id={`ph-subtitle-${subtitle.replace(/\s+/g, "")}`} defaultText={subtitle} />
            ) : (
              subtitle
            )}
          </p>
        )}
      </motion.div>
    </header>
  );
}

function BackButton() {
  return (
    <span className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-foreground/80 hover:text-primary transition-colors">
      <ArrowLeft className="w-5 h-5" />
    </span>
  );
}
