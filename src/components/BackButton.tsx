import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type BackButtonProps = {
  fallbackTo?: string;
  className?: string;
  label?: string;
};

export default function BackButton({ fallbackTo = "/", className = "", label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the back button on the site's home page
  if (location.pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo, { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:border-[var(--gold)] hover:text-[var(--text)] ${className}`}
      aria-label="Go back"
      title="Go back"
    >
      <ArrowLeft size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}