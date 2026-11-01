import { cn } from '../../lib/utils';

export default function IconButton({
  label,
  onClick,
  disabled,
  href,
  type = 'button',
  className,
  children,
  ...props
}) {
  const classes = cn('glass-icon-btn', className);

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
