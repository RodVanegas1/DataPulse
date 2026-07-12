import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'icon';
}

export function Button({ children, icon, variant = 'secondary', className = '', ...props }: ButtonProps) {
  const variantClass = variant === 'primary' ? 'primary-button' : variant === 'icon' ? 'icon-button' : 'secondary-button';
  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {icon}
      {variant !== 'icon' ? children : null}
    </button>
  );
}
