import {UserService} from '../../utils/user.service';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router, UserService)
export class Register {
  userRegister: any = {};
  loading = false;

  constructor(private router: Router,
              private userService: UserService) {
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
