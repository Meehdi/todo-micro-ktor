import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'input[type="checkbox"][appCheckbox]',
  standalone: true,
})
export class CheckboxDirective {
  @HostBinding('class')
  get classes() {
    return 'peer h-4 w-4 shrink-0 rounded-sm border border-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-50';
  }
}
