import {UserService} from '../../utils/user.service';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

import * as jQuery from 'jquery'

@inject(Router, UserService)
export class Register {
  userRegister: any = {};
  loading = false;

  constructor(private router: Router,
              private userService: UserService) {
  }

  renderRegisterPage() {
    let BasePagesRegister = function () {
      // Init Register Form Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
      let initValidationRegister = function () {
        jQuery('.js-validation-register').validate({
          errorClass: 'help-block text-right animated fadeInDown',
          errorElement: 'div',
          errorPlacement: function (error, e) {
            jQuery(e).parents('.form-group > div').append(error);
          },
          highlight: function (e) {
            jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
            jQuery(e).closest('.help-block').remove();
          },
          success: function (e) {
            jQuery(e).closest('.form-group').removeClass('has-error');
            jQuery(e).closest('.help-block').remove();
          },
          rules: {
            'register-email': {
              required: true,
              email: true
            },
            'register-password': {
              required: true,
              minlength: 8
            },
            'register-password2': {
              required: true,
              equalTo: '#register-password'
            }
          },
          messages: {
            'register-email': 'Please enter a valid email address',
            'register-password': {
              required: 'Please provide a password',
              minlength: 'Your password must be at least 8 characters long'
            },
            'register-password2': {
              required: 'Please provide a password',
              minlength: 'Your password must be at least 8 characters long',
              equalTo: 'Please enter the same password as above'
            }
          }
        });
      };

      return {
        init: function () {
          // Init Register Form Validation
          initValidationRegister();
        }
      };
    }();

    // Initialize when page loads
    jQuery(function () {
      BasePagesRegister.init();
    });
  }

  attached() {
    this.renderRegisterPage();
  }

  register() {
    this.loading = true;
    this.userService.createUser(this.userRegister)
      .then(() => {
        alert('Register successfully, please Login.')
        this.router.navigate('login');
      })
      .catch(() => alert('Register got failure!'))
  }
}
