import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize | Record<string, ButtonSize>;
  fullWidth?: boolean;
  href?: Url;
  className?: string;
  type?: "submit" | "reset" | "button";
}

const Button: React.FC<ButtonProps> = ({

  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  href,
  className = "",
  type = "button",
    ...props
}) => {
  const baseClasses =
    "font-semibold rounded-full inline-flex items-center justify-center cursor-pointer select-none text-center";

  const paddingMap = {
    sm: "px-5 py-2",
    md: "px-5 py-3",
    lg: "px-5 py-4",
  };

  const textSizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const variantClasses = {
    primary: "bg-theme hover:brightness-105 text-textSecondary",
    secondary: "bg-slate-500 hover:brightness-105 text-textSecondary",
    outline:
      "border border-primary hover:brightness-105 bg-transparent text-textPrimary",
    text: "text-textPrimary hover:brightness-105 bg-transparent",
  };

  const widthClass = fullWidth ? "w-full" : "";

  let sizeClassString = "";

  if (typeof size === "string") {
    sizeClassString = `${paddingMap[size]} ${textSizeMap[size]}`;
  } else {
    sizeClassString = Object.entries(size)
      .map(
        ([breakpoint, sizeKey]) =>
          `${breakpoint}:${paddingMap[sizeKey]} ${breakpoint}:${textSizeMap[sizeKey]}`
      )
      .join(" ");
  }

  const buttonClasses = `${baseClasses} ${sizeClassString} ${variantClasses[variant]} ${widthClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} type={type} {...props}>
      {children}
    </button>
  );
};

export default Button;
