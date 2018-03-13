import {autoinject} from 'aurelia-framework';
import {
  ValidationController,
  ValidationControllerFactory,
  validateTrigger,
  ValidationRules,
  RenderedError,
  Rule
} from 'aurelia-validation';
import { validateFilledFieldsWithValidationRules, controllerValidByRules } from '../../utils/validation.utils';
import { User } from '../../utils/models/user';
import {AuthenService} from '../../utils/authen.service';
import {Router} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';

import {Notify} from '../notify/notify';

import * as jQuery from 'jquery';

@autoinject()
export class Login {
  userLogin!: User;
  loading = false;

  public emailErrors!: RenderedError[];
  public passwordErrors!: RenderedError[];

  private validationController: ValidationController;
  private rules!: Rule<User, any>[][];

  constructor(
    private router: Router,
    public dialogService: DialogService,
    private authenService: AuthenService,
    private validationControllerFactory: ValidationControllerFactory
  ) 
  {
    this.validationController = this.validationControllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.changeOrBlur;
  }

  created() {
    this.authenService.logout();
  }

  login() {
    this.loading = true;
    this.authenService.login(this.userLogin.email, this.userLogin.password)
      .then(() => {
          this.router.navigate('dashboard');
          this.loading = false;
        }
      )
      .catch((error) => {
        console.log('Login fail', error);
        this.loading = false;
        this.notify('error', 'Login error, email or password is incorrect!');
      })
  }

  notify(type, text) {
    this.dialogService.open({viewModel: Notify, model: {type: type, text: text}})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          console.log('OK');
        } else {
          console.log('Cancel');
        }
        console.log(response.output);
      });
  }

  // Validation
  public activate(): void {
    this.initUserLogin();
    this.setupValidationRules();
    validateFilledFieldsWithValidationRules(this.rules, this.userLogin, this.validationController);
  }

  public validateEmail(): void {
    validateFilledFieldsWithValidationRules(this.rules, this.userLogin, this.validationController, 'email');
  }

  public validatePassword(): void {
    validateFilledFieldsWithValidationRules(this.rules, this.userLogin, this.validationController, 'password');
  }

  private setupValidationRules(): void {
    this.rules = ValidationRules
      .ensure((userLogin: User) => userLogin.email)
        .required().withMessage('Please provide an email')
        .satisfiesRule('customEmail').withMessage('Please enter a valid email address')
      .ensure((userLogin: User) => userLogin.password)
        .required().withMessage('Please provide a password')
        .minLength(8).withMessage('Your password must be at least 8 characters long')
      .on(this.userLogin).rules;
  }

  private initUserLogin(): void {
    this.userLogin = new User;
  }
}
