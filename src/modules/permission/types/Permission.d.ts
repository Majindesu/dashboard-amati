type Permission = {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
	roleCount: number;
	userCount: number;
};

export default Permission;
