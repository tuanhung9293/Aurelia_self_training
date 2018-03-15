import { PLATFORM } from 'aurelia-framework';

export function configure(aurelia): void {
  aurelia
    .globalResources([
      PLATFORM.moduleName('./input-field/input-field'),
      PLATFORM.moduleName('./input-select/input-select'),
    ]);
}
