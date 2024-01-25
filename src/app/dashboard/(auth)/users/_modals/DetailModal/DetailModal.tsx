import React from 'react'
import { FormModal } from '..'
import { UserFormData } from '@/features/dashboard/users/formSchemas/userFormDataSchema'

interface Props {
    data: UserFormData
}

export default function DetailModal(props: Props) {
  return <FormModal readonly modalTitle='Detail User' data={props.data} />
}
