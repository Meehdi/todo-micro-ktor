import { Directive, Input, HostBinding } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)]',
        destructive: 'bg-[var(--color-danger)] text-white hover:opacity-90 focus-visible:ring-[var(--color-danger)]',
        outline: 'border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]',
        secondary: 'bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] hover:opacity-80',
        ghost: 'hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]',
        link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective {
  @Input() variant: ButtonVariants['variant'] = 'default';
  @Input() size: ButtonVariants['size'] = 'default';

  @HostBinding('class')
  get classes() {
    return buttonVariants({ variant: this.variant, size: this.size });
  }
}
