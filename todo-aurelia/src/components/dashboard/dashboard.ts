import {inject} from 'aurelia-framework';
import {UserService} from '../../utils/user.service'
import {RouterConfiguration, Router} from 'aurelia-router';

@inject(UserService)
export class DashBoard {
  router: Router;
  current_user: string;

  constructor(private userService: UserService) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Dashboard';
    config.map([
      {route: 'tasklists', moduleId: 'components/dashboard/tasklists/tasklists', nav: true, name: 'tasklists', title: 'Tasklists'},
      {route: 'profile',   moduleId: 'components/dashboard/profile/profile',     nav: true, name: 'profile',   title: 'Profile'},
      {route: '', redirect: 'tasklists' },
    ]);

    this.router = router;
  }

  created() {
    this.current_user = this.userService.getCurrentUser();
  }
}
