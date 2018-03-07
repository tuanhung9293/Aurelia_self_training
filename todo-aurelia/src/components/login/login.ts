import {autoinject} from 'aurelia-framework';
import {AuthenService} from '../../utils/authen.service';
import {Router} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';

import {Notify} from '../notify/notify';

import * as jQuery from 'jquery';

@autoinject()
export class Login {
  userLogin: any = {};
  loading = false;

  constructor(private router: Router,
              public dialogService: DialogService,
              private authenService: AuthenService) {
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

  attached() {
    this.renderLoginPage();
  }

  renderLoginPage() {
    let BasePagesLogin = function () {
      let initValidationLogin = function () {
        jQuery('.js-validation-login').validate({
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
            'login-email': {
              required: true,
              email: true
            },
            'login-password': {
              required: true,
              minlength: 8
            }
          },
          messages: {
            'login-email': 'Please enter a valid email address',
            'login-password': {
              required: 'Please provide a password',
              minlength: 'Your password must be at least 8 characters long'
            }
          }
        });
      };

      return {
        init: function () {
          // Init Login Form Validation
          initValidationLogin();
        }
      };
    }();

    // Initialize when page loads
    jQuery(function () {
      BasePagesLogin.init();
    });
  }

}
