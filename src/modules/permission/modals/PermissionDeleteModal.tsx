"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
	Button,
	Flex,
	Modal,
	Text,
	Alert,
} from "@mantine/core";
import { showNotification } from "@/utils/notifications";
import { error } from "console";
import { revalidatePath } from "next/cache";
import withServerAction from "@/modules/dashboard/utils/withServerAction";
import deletePermission from "../actions/deletePermission";
import DashboardError from "@/modules/dashboard/errors/DashboardError";

export interface DeleteModalProps {
	data?: {
		id: string;
		name: string;
	};
	onClose: () => void;
}

export default function DeleteModal(props: DeleteModalProps) {
	const router = useRouter();

	const [isSubmitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	/**
	 * Closes the modal. It won't close if a submission is in progress.
	 */
	const closeModal = () => {
		if (isSubmitting) return;
        setErrorMessage("")
		props.onClose();
	};

	const confirmAction = () => {
		if (!props.data?.id) return;
		setSubmitting(true);

		withServerAction(deletePermission, props.data!.id)
			.then((response) => {
				showNotification(
					response.message ?? "Permission deleted successfully"
				);
				setSubmitting(false);
                props.onClose()
			})
			.catch((e) => {
                if (e instanceof DashboardError){
                    setErrorMessage(`ERROR: ${e.message} (${e.errorCode})`)
                }
                else if (e instanceof Error) {
                    setErrorMessage(`ERROR: ${e.message}`)
				} else {
                    setErrorMessage(`Unkown error is occured. Please contact administrator`)
                }
			})
            .finally(() => {
                setSubmitting(false)
            });
	};

	return (
		<Modal
			opened={!!props.data}
			onClose={closeModal}
			title={`Delete confirmation`}
		>
			<Text size="sm">
				Are you sure you want to delete permission{" "}
				<Text span fw={700}>
					{props.data?.name}
				</Text>
				? This action is irreversible.
			</Text>

			{errorMessage && <Alert color="red">{errorMessage}</Alert>}
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
					Delete Permission
				</Button>
			</Flex>
		</Modal>
	);
}