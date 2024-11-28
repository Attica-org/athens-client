class AccessMessageConfig {
  #accessMessageChatId: number;

  constructor() {
    this.#accessMessageChatId = 0;
  }

  #reduceAccessMessageChatId() {
    if (this.#accessMessageChatId === -Number.MAX_SAFE_INTEGER) {
      this.#accessMessageChatId = 0;
    }

    this.#accessMessageChatId -= 1;
  }

  getAccessMessageChatId() {
    this.#reduceAccessMessageChatId();

    return this.#accessMessageChatId;
  }
}

const accessMessageConfig = new AccessMessageConfig();

export default accessMessageConfig;
