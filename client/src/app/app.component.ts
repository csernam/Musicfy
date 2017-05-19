import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'Musicfy';
  public user: User;
  public new_user: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.new_user = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.url = GLOBAL.url;
  }

  public onSubmit() {
    // Get user data
    this._userService.signup(this.user).subscribe(
      response => {
        const identity = response.user;
        this.identity = identity;

        if (!this.identity._id) {
          alert('User could not be identified!');
        } else {
          // Create element in local storage to maintain user session
          localStorage.setItem('identity', JSON.stringify(identity));

          // Get token to send in requests
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              const token = response.token;
              this.token = token;

              if (this.token.length <= 0) {
                alert('Token could not been generated');
              } else {
                // Create element in local storage to maintain token available
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
              console.log(response);
            },
            error => {
              const errorMessage = <any>error;

              if (errorMessage != null) {
                const body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
        console.log(response);
      },
      error => {
        const errorMessage = <any>error;

        if (errorMessage != null) {
          const body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  public logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear(); // This clear is not mandatory since we are removing manually identity and token

    this.identity = null;
    this.token = null;
  }

  public onSubmitRegister() {
    console.log(this.new_user);

    this._userService.register(this.new_user).subscribe(
      response => {
        let user = response.user;
        this.new_user = user;

        if (!user._id) {
          this.alertRegister = 'User could not be registered!';
        } else {
          this.alertRegister = 'Great, you are registered! Log in with ' + this.new_user.email;
          this.new_user = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        const errorMessage = <any>error;

        if (errorMessage != null) {
          const body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }
}
