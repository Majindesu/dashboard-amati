"use client";
import { UserFormData } from "@/features/dashboard/users/formSchemas/userFormDataSchema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
	Avatar,
	Button,
	Center,
	Flex,
	Modal,
	ScrollArea,
	Text,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import deleteUser from "@/features/dashboard/users/actions/deleteUser";
import { showNotification } from "@/utils/notifications";

interface Props {
	data: UserFormData;
}

export default function DeleteModal(props: Props) {
	const router = useRouter();

	const [isSubmitting, setSubmitting] = useState(false);

	/**
	 * Closes the modal. It won't close if a submission is in progress.
	 */
	const closeModal = () => {
		if (isSubmitting) return;
		router.replace("?");
	};

    const confirmAction = () => {
        setSubmitting(true)
        deleteUser(props.data.id)
            .then((response) => {
                if (response.success){
                    showNotification(response.message);
                    router.replace("?")
                    return;
                } else {
                    showNotification(response.message, "error")
                }
            })
            .catch(() => {
                //TODO: Handle Error
            })
            .finally(() => {
                setSubmitting(false)
            })
    }

	return (
		<Modal opened onClose={closeModal} title={`Delete confirmation`}>
			<Text size="sm">
				Are you sure you want to delete user{" "}
				<Text span fw={700}>
					{props.data.name}
				</Text>
				? This action is irreversible.
			</Text>
			{/* Buttons */}
			<Flex justify="flex-end" align="center" gap="lg" mt="lg">
				<Button
					variant="outline"
					onClick={closeModal}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button
					variant="subtle"
					// leftSection={<TbDeviceFloppy size={20} />}
					type="submit"
					color="red"
					loading={isSubmitting}
                    onClick={confirmAction}
				>
					Delete User
				</Button>
			</Flex>
		</Modal>
	);
}
