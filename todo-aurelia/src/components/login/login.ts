import {AuthenService} from '../../utils/authen.service';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router, AuthenService)
export class Login {
  userLogin: any = {};
  loading = false;

  constructor(private router: Router,
              private authenService: AuthenService) {
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
