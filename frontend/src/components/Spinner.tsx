import { twMerge } from "tailwind-merge";

interface SpinnerProps {
  className?: string;
  spinnerSize: "sm" | "md" | "lg";
}

export const Spinner = ({ spinnerSize, className }: SpinnerProps) => {
  return (
    <div
      className={twMerge(
        "animate-spin inline-block border-2 border-current border-t-transparent text-foreground rounded-full",
        spinnerSize === "sm" && "size-3.5",
        spinnerSize === "md" && "size-4.5",
        spinnerSize === "lg" && "size-5.5",
        className
      )}
      role="status"
      aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};
