import { AppShell, AppShellHeader, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import React from 'react'
import logo from "@/assets/logos/logo.png"
import AppHeader from '../../components/AppHeader'
import AppNavbar from '../../components/AppNavbar'
import DashboardLayout from '@/components/DashboardLayout'

interface Props {
    children: React.ReactNode
}

export default function Layout(props: Props) {

    return (
        <DashboardLayout>
            {props.children}
        </DashboardLayout>
    )
}
