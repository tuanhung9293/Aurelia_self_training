import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {PLATFORM} from 'aurelia-pal';

export async function configure(aurelia: Aurelia): Promise<void> {
  aurelia.use
    .standardConfiguration()

    .plugin(PLATFORM.moduleName('jquery-validation'))

    .plugin(PLATFORM.moduleName('datatables'))

    .plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
      config.useDefaults();
      config.settings.startingZIndex = 1005;
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
    })

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app.vm'));
}
