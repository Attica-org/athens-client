const errorMessage = (() => {
  let message: string = '';

  return {
    setMessage: (msg: string) => {
      message = msg;
    },
    getMessage: () => message,
    clearMessage: () => {
      message = '';
    },
  };
})();

export default errorMessage;
