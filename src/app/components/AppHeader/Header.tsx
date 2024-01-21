"use client"
import React from 'react'
import { AppShell, Burger, Group } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import logo from "@/assets/logos/logo.png"

export default function AppHeader() {

    const [openNavbar, { toggle }] = useDisclosure()

    return (
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger
                    opened={openNavbar}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Image src={logo} alt='' height={30} />
            </Group>
        </AppShell.Header>
    )
}
