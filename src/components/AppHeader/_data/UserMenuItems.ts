import { ThemeIconProps } from "@mantine/core"
import React from "react"
import { TbLogout, TbSettings } from "react-icons/tb"

export interface UserMenuItem {
    label: string,
    icon: React.FC<any>,
    color?: ThemeIconProps['color']
}

const userMenuItems: UserMenuItem[] = [
    {
        label: "Account Settings",
        icon: TbSettings
    },
    {
        label: "Logout",
        icon: TbLogout,
        color: "red"
    }
];

export default userMenuItems;
