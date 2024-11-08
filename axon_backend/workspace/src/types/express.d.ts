import type { IJwtUser } from "../middleware/auth.middleware";

declare global {
	namespace Express {
		interface Request {
			user: IJwtUser;
		}
	}
}
