export const emailInputCheck = (email) => {
  if (email !== null && email.length >= 50) {
    return { isError: true, message: "maximum character 50" };
  }
  switch (email) {
    case null:
      return { isError: true, message: "email field can't empty" };
    default:
      return { isError: false, message: "" };
  }
};

export const nameInputCheck = (name) => {
  if (name !== null && name.length >= 25) {
    return { isError: true, message: "maximum character 25" };
  }
  switch (name) {
    case null:
      return { isError: true, message: "name field can't empty" };
    default:
      return { isError: false, message: "" };
  }
};

export const userNameInputCheck = (userName) => {
  if (userName !== null && userName.length >= 25) {
    return { isError: true, message: "maximum character 25" };
  }
  switch (userName) {
    case null:
      return { isError: true, message: "user name field can't empty" };
    default:
      return { isError: false, message: "" };
  }
};

export const passwordInputCheck = (password) => {
  if (password !== null && password.length >= 25) {
    return { isError: true, message: "maximum character 25" };
  }
  switch (password) {
    case null:
      return { isError: true, message: "password field can't empty" };
    default:
      return { isError: false, message: "" };
  }
};
