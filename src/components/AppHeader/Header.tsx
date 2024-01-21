"use client"
import React from 'react'
import { AppShell, Burger, Group } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import logo from "@/assets/logos/logo-dsg.png"

interface Props {
    openNavbar: boolean,
    toggle: () => void
}

export default function AppHeader(props: Props) {

    return (
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger
                    opened={props.openNavbar}
                    onClick={props.toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Image src={logo} alt='' height={57} />
            </Group>
        </AppShell.Header>
    )
}
