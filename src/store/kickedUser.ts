import { UserName } from '@/app/model/Agora';

class KickedUsers {
  #nicknames: Set<UserName>;

  constructor() {
    this.#nicknames = new Set();
  }

  addUserName(username: UserName) {
    this.#nicknames.add(username);
  }

  removeUserName(username: UserName) {
    this.#nicknames.delete(username);
  }

  hasUserName(username: UserName) {
    return this.#nicknames.has(username);
  }

  reset() {
    this.#nicknames.clear();
  }
}

export const kickedUsers = new KickedUsers();
