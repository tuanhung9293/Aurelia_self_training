import { PLATFORM } from 'aurelia-framework';

export function configure(aurelia): void {
  aurelia
    .globalResources([
      PLATFORM.moduleName('./data-table/data-table.element'),
    ]);
}
