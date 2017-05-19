import { Component, OnInit } from '@angular/core';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})

export class UserEditComponent implements OnInit {

  public titulo: string;
  public user: User;
  public identity;
  public token;
  public alertMessage;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(private _userService: UserService) { }

  ngOnInit() {

    this.titulo = 'Update my profile';

    // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.user = this.identity;

    this.url = GLOBAL.url;
  }

  onSubmit() {

    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.alertMessage = 'The user could not be updated';
        } else {
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById('identity_name').innerHTML = this.user.name;

          if (!this.filesToUpload) {
            // Redirect
          } else {
            this.makeFileRequest(this.url + 'upload-image-user/'
              + this.user._id, [], this.filesToUpload).then(
              (result: any) => {
                this.user.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.user));

                const image_path = this.url + 'get-image-user/' + this.user.image;
                document.getElementById('image-logged').setAttribute('src', image_path);
              });

          }
        }
        this.alertMessage = 'User updated';
      },
      error => {
        const errorMessage = <any>error;

        if (errorMessage != null) {
          const body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    let token = this.token;

    return new Promise(function(resolve, reject) {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
}
