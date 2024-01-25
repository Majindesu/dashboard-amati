import React from 'react'
import { FormModal } from '..'
import { UserFormData } from '@/features/dashboard/users/formSchemas/userFormDataSchema'

interface Props {
    data: UserFormData
}

export default function EditModal(props: Props) {
  return <FormModal modalTitle='Edit User' data={props.data} />
}
