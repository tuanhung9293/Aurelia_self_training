import {NavigationInstruction, Next, PipelineStep, Redirect, RouterConfiguration, Router} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Login';
    config.addAuthorizeStep(AuthorizeStep);
    config.map([
      {route: 'login',     moduleId: 'components/login/login',          nav: true, name: 'login',     title: 'Login',     settings: { roles: [] }},
      {route: 'register',  moduleId: 'components/register/register',    nav: true, name: 'register',  title: 'Register',  settings: { roles: [] }},
      {route: 'dashboard', moduleId: 'components/dashboard/dashboard',  nav: true, name: 'dashboard', title: 'Dashboard', settings: { roles: ['admin'] }},
      {route: 'welcome', moduleId: 'welcome',  nav: true, name: 'welcome', title: 'Welcome', settings: { roles: [] }},
      {route: '', redirect: 'login'},
    ]);

    this.router = router;
  }
}

class AuthorizeStep implements PipelineStep {
  public run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1)) {
      let isAdmin = /* insert magic here */true;
      if (!isAdmin) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}
