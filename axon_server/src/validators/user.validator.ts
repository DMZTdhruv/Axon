import type { TValidateResponse } from "../types/types.js";
import type { TUser } from "../types/types.js";
import { errorMessage } from "./errorResponse.js";

const validateEmail = (email: string): boolean => {
	const emailRegex = /[a-zA-Z]+([-+.'][a-zA-Z]+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
	return emailRegex.test(email);
};

export const validateSingUpDetails = (userData: TUser): TValidateResponse => {
	if (Object.keys(userData).length === 0) {
		return errorMessage(
			true,
			"Incomplete details for sign up, missing username email and password",
		);
	}
	if (!userData.username || !userData.email || !userData.password) {
		return errorMessage(true, "incomplete details provided");
	}
	if (
		userData.username.trim() === "" ||
		userData.email.trim() === "" ||
		userData.password === ""
	) {
		return errorMessage(true, "incomplete details provided");
	}

	if (!validateEmail(userData.email)) {
		return errorMessage(true, "invalid email provided");
	}

	return errorMessage(false, "");
};

export const validateUserLogin = (userData: TUser) => {
	if (Object.keys(userData).length === 0) {
		return errorMessage(
			true,
			"Incomplete details for sign up, missing username email and password",
		);
	}

	if (!userData.email || !userData.password) {
		return errorMessage(true, "incomplete details provided");
	}

	if (!validateEmail(userData.email)) {
		return errorMessage(true, "invalid email provided");
	}

	return errorMessage(false, "");
};

// import Joi from 'joi';

// // Define the schema for user login
// const userLoginSchema = Joi.object({
//   email: Joi.string().email().required().messages({
//     'string.email': 'Invalid email format',
//     'any.required': 'Email is required',
//   }),
//   password: Joi.string().required().messages({
//     'any.required': 'Password is required',
//   }),
// });

// export const validateUserLogin = (userData: TUser) => {
//   const { error } = userLoginSchema.validate(userData, { abortEarly: false });

//   if (error) {
//     return {
//       error: true,
//       errorMessage: error.details.map(detail => detail.message).join(', '),
//     };
//   }

//   return {
//     error: false,
//     errorMessage: '',
//   };
// };
