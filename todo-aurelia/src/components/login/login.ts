import {AuthenService} from '../../utils/authen.service';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

import * as jQuery from 'jquery';

@inject(Router, AuthenService)
export class Login {
  userLogin: any = {};
  loading = false;

  constructor(private router: Router,
              private authenService: AuthenService) {
  }

  renderLoginPage() {
   let BasePagesLogin = function() {
      // Init Login Form Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
      let initValidationLogin = function(){
        jQuery('.js-validation-login').validate({
          errorClass: 'help-block text-right animated fadeInDown',
          errorElement: 'div',
          errorPlacement: function(error, e) {
            jQuery(e).parents('.form-group > div').append(error);
          },
          highlight: function(e) {
            jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
            jQuery(e).closest('.help-block').remove();
          },
          success: function(e) {
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
    jQuery(function(){ BasePagesLogin.init(); });
  }

  attached() {
    this.renderLoginPage();
  }

  created() {
    this.authenService.logout();
  }

  login() {
    this.loading = true;
    this.authenService.login(this.userLogin.email, this.userLogin.password)
      .then((response) => {
          this.router.navigate('dashboard');
        }
      )
  }
}
