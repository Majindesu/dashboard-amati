import { User } from "@prisma/client";

type UserClaims = {
	id: User["id"];
};

export default UserClaims;
