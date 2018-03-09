import { autoinject } from 'aurelia-framework';
import { ValidationRules } from 'aurelia-validation';
import { NavigationInstruction, Next, PipelineStep, Redirect, RouterConfiguration, Router } from 'aurelia-router';
import { customEmailValidationRule } from './rules/custom-email.rule';

@autoinject()
export class AppViewModel {
    private router: Router;

    constructor() {
        this.configureValidationRules();
    }

    configureRouter(config: RouterConfiguration, router: Router) {
      config.title = 'Login';
      config.addAuthorizeStep(AuthorizeStep);
      config.map([
        {route: 'login',     moduleId: 'components/login/login',          nav: true, name: 'login',     title: 'Login',     settings: { roles: [] }},
        {route: 'register',  moduleId: 'components/register/register',    nav: true, name: 'register',  title: 'Register',  settings: { roles: [] }},
        {route: 'dashboard', moduleId: 'components/dashboard/dashboard',  nav: true, name: 'dashboard', title: 'Dashboard', settings: { roles: ['admin'] }},
        {route: '', redirect: 'login'},
      ]);
  
      this.router = router;
    }

    private configureValidationRules(): void {
        ValidationRules.customRule('customEmail', customEmailValidationRule, '');
    }
}

class AuthorizeStep implements PipelineStep {
    public run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1)) {
            let isAdmin = localStorage.getItem('authenIsOk');
            if (!isAdmin) {
                return next.cancel(new Redirect('login'));
            }
        }

        return next();
    }
}