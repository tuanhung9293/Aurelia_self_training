import { PLATFORM } from 'aurelia-framework';

export function configure(aurelia): void {
  aurelia
    .globalResources([
      PLATFORM.moduleName('./input-field/input-field'),
      PLATFORM.moduleName('./input-select/input-select'),
      PLATFORM.moduleName('./table-loader/table-loader.element'),
    ]);
}
