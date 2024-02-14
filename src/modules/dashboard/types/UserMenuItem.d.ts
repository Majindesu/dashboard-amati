export interface UserMenuItem {
	label: string;
	icon: React.FC<any>;
	color?: ThemeIconProps["color"];
	href?: string;
}
