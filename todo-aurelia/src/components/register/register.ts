import { autoinject } from 'aurelia-framework';
import {
  ValidationController,
  ValidationControllerFactory,
  validateTrigger,
  ValidationRules,
  RenderedError,
  Rule
} from 'aurelia-validation';
import { validateFilledFieldsWithValidationRules, controllerValidByRules } from '../../utils/validation.utils';
import { RegisterModel } from '../../utils/models/register-model';
import { UserService } from '../../utils/user.service';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import { Notify } from '../notify/notify';

@autoinject()
export class Register {
  userRegister!: RegisterModel;
  loading = false;

  public emailErrors!: RenderedError[];
  public passwordErrors!: RenderedError[];
  public confirmPasswordErrors!: RenderedError[];

  public validationController: ValidationController;
  private rules!: Rule<RegisterModel, any>[][];

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private userService: UserService,
    private validationControllerFactory: ValidationControllerFactory
  ) {
    this.validationController = this.validationControllerFactory.createForCurrentScope();
    this.validationController.validateTrigger = validateTrigger.changeOrBlur;
  }

  register() {
    this.loading = true;
    this.userService.createUser(this.userRegister)
      .then(() => {
        this.loading = false;
        this.router.navigate('login');
        this.notify('info', 'Register success, please login to use the application!');
      })
      .catch((error) => {
        console.log('Register fail', error);
        this.loading = true;
        this.notify('error', 'Register fail, please try again!');
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

  public activate(): void {
    this.initUserRegister();

    this.setupValidationRules();
    validateFilledFieldsWithValidationRules(this.rules, this.userRegister, this.validationController);
  }

  public validateEmail(): void {
    validateFilledFieldsWithValidationRules(this.rules, this.userRegister, this.validationController, 'email');
  }

  public validatePassword(): void {
    validateFilledFieldsWithValidationRules(this.rules, this.userRegister, this.validationController, 'password');
    this.setupValidationRules();
  }

  public validateConfirmPassword(): void {
    validateFilledFieldsWithValidationRules(this.rules, this.userRegister, this.validationController, 'confirmPassword');
  }

  private setupValidationRules(): void {
    this.rules = ValidationRules
      .ensure((userRegister: RegisterModel) => userRegister.email)
      .required().withMessage('Please provide an email')
      .satisfiesRule('customEmail').withMessage('Please enter a valid email address')

      .ensure((userRegister: RegisterModel) => userRegister.password)
      .required().withMessage('Please provide a password')
      .minLength(8).withMessage('Your password must be at least 8 characters long')

      .ensure((userRegister: RegisterModel) => userRegister.confirmPassword)
      .equals(this.userRegister.password).withMessage('Please enter the same password as above')

      .on(this.userRegister).rules;
  }

  private initUserRegister(): void {
    this.userRegister = new RegisterModel();
  }
}
