import "./Button.css";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  loading = false,
  loadingText = "Please wait...",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`btn ${variant} ${loading ? "loading" : ""} ${className}`}
    >
      {loading ? loadingText : children}
    </button>
  );
}