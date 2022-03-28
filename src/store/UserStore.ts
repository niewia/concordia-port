import { action, computed, makeAutoObservable, observable } from 'mobx';
import { User } from 'firebase/auth';

export interface IUserStore {
  isAuthenticated: boolean;
}

export class UserStore implements IUserStore {
  @observable user?: User;

  constructor() {
    makeAutoObservable(this);
  }

  @action login(user: User) {
    this.user = user;
  }

  @action logout() {
    delete this.user;
  }

  @computed get isAuthenticated() {
    return !!this.user;
  }
}
