"use client"
import { Button } from '@mantine/core'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { TbPlus } from 'react-icons/tb'
import { CreateModal } from '../../_modals'

export default function CreateButton() {

    const [isModalOpened, setModalOpened] = useState(false)

  return (
    <>
        <Button leftSection={<TbPlus />} onClick={() => setModalOpened(true)}>New Role</Button>

        <CreateModal opened={isModalOpened} onClose={() => setModalOpened(false)} />
    </>
  )
}
