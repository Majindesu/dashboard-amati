interface RequestLinkForm {
	id: string | undefined;
	numberOfLinks: number;
	details: {
		email: string;
		activePeriod: (typeof resellerOffice365Config.activePeriods)[number];
		endUserQty: number;
	}[];
}
