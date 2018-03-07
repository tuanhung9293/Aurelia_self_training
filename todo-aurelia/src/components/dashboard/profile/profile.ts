import {autoinject} from 'aurelia-framework';
import {UserService} from '../../../utils/user.service'
import {Router} from 'aurelia-router';

@autoinject()
export class Profile {
  newPassword: any = {};
  current_user: string;

  constructor(private router: Router,
              private userService: UserService) {
  }

  created() {
    this.current_user = this.userService.getCurrentUser();
  }

  changePassword() {
    this.userService.changePassword(this.newPassword)
      .then(
        data => {
          this.router.navigate('/');
          alert('Change password success');
        })
      .catch(() => {
        alert('Change password fail')
      })
  }
}
