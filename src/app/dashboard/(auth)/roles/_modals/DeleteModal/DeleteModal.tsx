"use client";
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
import { showNotification } from "@/utils/notifications";
import deleteRole from "@/features/dashboard/roles/actions/deleteRole";

export interface DeleteModalProps {
	data?: {
        id: string,
        name: string,
    };
    onClose: () => void
}

export default function DeleteModal(props: DeleteModalProps) {
	const router = useRouter();

	const [isSubmitting, setSubmitting] = useState(false);

	/**
	 * Closes the modal. It won't close if a submission is in progress.
	 */
	const closeModal = () => {
		if (isSubmitting) return;
		props.onClose()
	};

    const confirmAction = () => {
        if (!props.data?.id) return;
        setSubmitting(true)
        deleteRole(props.data.id)
            .then((response) => {
                if (response.success){
                    showNotification(response.message);
                    setSubmitting(false)
                    props.onClose()
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
		<Modal opened={!!props.data} onClose={closeModal} title={`Delete confirmation`}>
			<Text size="sm">
				Are you sure you want to delete role{" "}
				<Text span fw={700}>
					{props.data?.name}
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
					Delete Role
				</Button>
			</Flex>
		</Modal>
	);
}
