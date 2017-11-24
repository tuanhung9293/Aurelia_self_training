import {RouterConfiguration, Router} from 'aurelia-router';

export class DashBoard {
  router: Router;
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Dashboard';
    config.map([
      {route: 'tasklists', moduleId: 'components/dashboard/tasklists/tasklists', nav: true, name: 'tasklists', title: 'Tasklists'},
      {route: 'profile',   moduleId: 'components/dashboard/profile/profile',     nav: true, name: 'profile',   title: 'Profile'},
      {route: '', redirect: 'tasklists' },
    ]);

    this.router = router;
  }
}
