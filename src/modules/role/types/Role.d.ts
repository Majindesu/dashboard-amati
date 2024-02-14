export default interface Role {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
	permissionCount: number;
	userCount: number;
}
