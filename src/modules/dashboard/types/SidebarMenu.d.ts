export default interface SidebarMenu {
	label: string;
	icon: React.FC<any>;
	children?: {
		label: string;
		link: string;
	}[];
	color?: ThemeIconProps["color"];
}