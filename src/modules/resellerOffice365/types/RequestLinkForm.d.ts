interface RequestLinkForm {
	id: string | undefined;
	numberOfLinks: number;
	details: {
		id?: string;
		email: string;
		activePeriod: (typeof resellerOffice365Config.activePeriods)[number];
		endUserQty: number;
		link: string
	}[];
}
