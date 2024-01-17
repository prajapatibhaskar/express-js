export const createUserValidationSchema = {
  username: {
    isLength: {
      options: { min: 5, max: 32 },
      errorMessage: "Username must not be empty",
    },
    notEmpty: {
      errorMessage: "Username must be atleast 5-32 characters",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "DisplayName must not be empty",
    },
  },
};

export const getAllUsersValidation = {
  filter: {
    notEmpty: {
      errorMessage: "Filter Value Must not be empty",
    },
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "Filter Value Must be atleast 3-10 characters",
    },
  },
};
