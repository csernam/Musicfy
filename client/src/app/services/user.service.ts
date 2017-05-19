import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UserService {

  public identity;
  public token;
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  public signup(user_to_login, gethash = null) {
    if (gethash != null) {
      user_to_login.gethash = gethash;
    }

    const json = JSON.stringify(user_to_login);
    const params = json;

    const headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.post(this.url + 'login', params, { headers: headers }).map(res => res.json());
  }

  public register(user_to_register) {
    const json = JSON.stringify(user_to_register);
    const params = json;

    const headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.post(this.url + 'register', params, { headers: headers }).map(res => res.json());
  }

  public updateUser(user_to_update) {
    const json = JSON.stringify(user_to_update);
    const params = json;

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });

    return this._http.put(this.url + 'update-user/' + user_to_update._id,
      params, { headers: headers }).map(res => res.json());
  }

  public getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity'));

    if (identity !== 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken() {
    const token = localStorage.getItem('token');

    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }
}
