interface RequestLinkForm {
	numberOfLinks: number;
	details: {
		email: string;
		activePeriod: (typeof resellerOffice365Config.activePeriods)[number];
		endUserQty: number;
	}[];
}
