"use client"
import { AppShell, AppShellHeader, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import React from 'react'
import logo from "@/assets/logos/logo.png"
import AppHeader from '../components/AppHeader'
import AppNavbar from '../components/AppNavbar'

interface Props {
    children: React.ReactNode
}

export default function layout(props: Props) {

    const [openNavbar, { toggle }] = useDisclosure(false)

    return (
        <AppShell
            padding="md"
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !openNavbar } }}
        >
            {/* Header */}
            <AppHeader />

            {/* Navbar */}
            <AppNavbar />

            <AppShell.Main>{props.children}</AppShell.Main>
        </AppShell>
    )
}
