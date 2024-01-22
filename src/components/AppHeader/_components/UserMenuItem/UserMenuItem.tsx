import { Menu, rem } from '@mantine/core'
import React from 'react'
import { UserMenuItem } from '../../_data/userMenuItems'

interface Props {
    item: UserMenuItem
}

export default function UserMenuItem({item}: Props) {
  return (
    <Menu.Item
		color={item.color}
        component='a'
		leftSection={
			<item.icon
				style={{ width: rem(16), height: rem(16) }}
				strokeWidth={1.5}
			/>
		}
        href={item.href}
	>
		{item.label}
	</Menu.Item>
  )
}
