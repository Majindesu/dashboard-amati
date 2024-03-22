import checkPermission from '@/modules/auth/utils/checkPermission'
import dashboardConfig from '@/modules/dashboard/dashboard.config'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Dashboard() {

    if (!await checkPermission("authenticated-only")) redirect(`${dashboardConfig.baseRoute}/login`)

    return (
        <div>
            <h1 className='font-bold bg-red-500'>Dashboard</h1>
        </div>
    )
}
