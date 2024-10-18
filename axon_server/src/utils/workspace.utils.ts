import { ErrorMessageReturn, TPrivileges } from "../types/types";
import { errorMessage } from "../validators/errorResponse.js";

export function checkIfUserIsPrivileged(
	users: TPrivileges[] | undefined,
	userId: string,
): ErrorMessageReturn {
	const privilegedUser = users?.find(
		(user) => user.userId.toString() === userId,
	);
	if (!privilegedUser) {
		return errorMessage(
			true,
			"user doesn't have the authority to edit the width of workspace",
		);
	}

	const { role } = privilegedUser;
	const allowedRoles = ["owner", "friend"];
	if (!allowedRoles.includes(role)) {
		return errorMessage(
			true,
			"User doesn't have the authority to edit the width of workspace",
		);
	}

	return errorMessage(false, "");
}
