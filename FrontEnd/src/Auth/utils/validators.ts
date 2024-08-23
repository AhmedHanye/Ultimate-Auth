const validateUsername = (username: string) => {
  if (username.length < 3) {
    return "Username must be at least 3 characters long.";
  }
  if (username.length > 25) {
    return "Username must be no more than 25 characters long.";
  }
  if (/^[_.]/.test(username)) {
    return "Username must not start with an underscore or dot.";
  }
  if (/[_.]$/.test(username)) {
    return "Username must not end with an underscore or dot.";
  }
  if (/[_]{2,}|[.]{2,}/.test(username)) {
    return "Username must not have multiple underscores or dots in a row.";
  }
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return "Username can only contain letters, numbers, underscores, and dots.";
  }
  return "";
};

const validateEmail = (email: string) => {
  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailPattern.test(email) === false || email.length > 320) {
    return "Invalid email format.";
  }
  return "";
};

const validatePassword = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (password.length > 128) {
    return "Password must not exceed 128 characters.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[!@#$%^&*()\-\_=+\[\]{};:'",.<>?/\\|`~]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return "";
};

export const validateInput = (key: string, value: string) => {
  value = value.trim();
  if (value) {
    switch (key) {
      case "username":
        return validateUsername(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  } else {
    return "";
  }
};
