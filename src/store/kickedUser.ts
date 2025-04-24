class KickedUsers {
  #nicknames: Set<string>;

  constructor() {
    this.#nicknames = new Set();
  }

  addUserName(username: string) {
    this.#nicknames.add(username);
  }

  removeUserName(username: string) {
    this.#nicknames.delete(username);
  }

  hasUserName(username: string) {
    return this.#nicknames.has(username);
  }

  reset() {
    this.#nicknames = new Set();
  }
}

export const kickedUsers = new KickedUsers();
