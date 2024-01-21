import { Menu, rem } from '@mantine/core'
import React from 'react'
import { UserMenuItem } from '../../_data/UserMenuItems'

interface Props {
    item: UserMenuItem
}

export default function UserMenuItem({item}: Props) {
  return (
    <Menu.Item
		color={item.color}
		leftSection={
			<item.icon
				style={{ width: rem(16), height: rem(16) }}
				strokeWidth={1.5}
			/>
		}
	>
		{item.label}
	</Menu.Item>
  )
}
