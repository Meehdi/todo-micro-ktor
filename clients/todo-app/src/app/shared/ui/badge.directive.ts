import { Directive, Input, HostBinding } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-primary)] text-white',
        secondary: 'bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]',
        destructive: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
        success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
        outline: 'border border-[var(--color-border)] text-[var(--color-text-primary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
  selector: '[appBadge]',
  standalone: true,
})
export class BadgeDirective {
  @Input() variant: BadgeVariants['variant'] = 'default';

  @HostBinding('class')
  get classes() {
    return badgeVariants({ variant: this.variant });
  }
}
