import type { TValidateResponse } from "../types/types.js";
import type { TUser } from "../types/types.js";
import { errorMessage } from "./errorResponse.js";

/*
	THESE ARE ALL THE VALIDATORS FOR [USER], KINDLY GO THROUGH THEM, THE SYNTAX IS CLEAR AND EASY TO UNDERSTAND
*/

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

export const changePasswordValidator = (
	userId: string,
	currentPassword: string,
	newPassword: string,
) => {
	if (!userId || !currentPassword || !newPassword) {
		return errorMessage(true, "incomplete data provided");
	}
	return errorMessage(false, "");
};
