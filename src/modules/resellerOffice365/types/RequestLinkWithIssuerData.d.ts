import { Office365LinkRequestStatus, Prisma } from "@prisma/client";

export default interface RequestLinkWithIssuerData {
	id: string;
	status: Office365LinkRequestStatus;
	requestedAt: Date;
	creator: {
		id: string;
		name: string | null;
		email: string | null;
		photoProfile: string | null;
	};
    userCount: number
}
