import { AppShell, AppShellHeader, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import React from 'react'
import logo from "@/assets/logos/logo.png"
import AppHeader from '../../components/AppHeader'
import AppNavbar from '../../components/AppNavbar'
import DashboardLayout from '@/components/DashboardLayout'
import getUser from '@/features/auth/actions/getUser'
import { redirect } from 'next/navigation'

interface Props {
    children: React.ReactNode
}

export default async function Layout(props: Props) {

    const user = await getUser()

    if (!user){
        redirect("/login")
    }

    return (
        <DashboardLayout>
            {props.children}
        </DashboardLayout>
    )
}
