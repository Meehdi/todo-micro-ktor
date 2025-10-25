import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'input[appInput], textarea[appInput]',
  standalone: true,
})
export class InputDirective {
  @HostBinding('class')
  get classes() {
    return 'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  }
}

@Directive({
  selector: 'textarea[appTextarea]',
  standalone: true,
})
export class TextareaDirective {
  @HostBinding('class')
  get classes() {
    return 'flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  }
}

@Directive({
  selector: '[appLabel]',
  standalone: true,
})
export class LabelDirective {
  @HostBinding('class')
  get classes() {
    return 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  }
}
