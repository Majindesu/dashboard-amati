import { AppShell, ScrollArea } from '@mantine/core'
import React from 'react'
import allMenu from './_data/allMenu'
import MenuItem from './_components/MenuItem'

export default function AppNavbar() {

    const menus = allMenu.map((menu, i) => <MenuItem menu={menu} key={i} />)

    return (
        <AppShell.Navbar p="md">
            <ScrollArea style={{flex: "1"}}>
                <div>
                    {menus}
                </div>
            </ScrollArea>
        </AppShell.Navbar>
    )
}
