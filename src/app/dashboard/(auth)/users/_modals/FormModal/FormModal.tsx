"use client";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import {
	Avatar,
	Button,
	Center,
	Flex,
	Modal,
	ScrollArea,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { TbDeviceFloppy } from "react-icons/tb";
import editUser from "@/features/dashboard/users/actions/editUser";
import userFormDataSchema, {
	UserFormData,
} from "@/features/dashboard/users/formSchemas/userFormDataSchema";
import { showNotification } from "@/utils/notifications";
import stringToColorHex from "@/utils/stringToColorHex";
import { zodResolver } from "@mantine/form";

interface Props {
	readonly?: boolean;
	modalTitle: string;
	data: UserFormData;
}

export default function FormModal(props: Props) {
	const router = useRouter();

	const [isSubmitting, setSubmitting] = useState(false);

	const form = useForm<UserFormData>({
		initialValues: props.data,
		validate: zodResolver(userFormDataSchema),
	});

	/**
	 * Closes the modal. It won't close if a submission is in progress.
	 */
	const closeModal = () => {
		if (isSubmitting) return;
		router
			.replace("?")
	};

	/**
	 * Handles the form submission.
	 *
	 * @param data The data from the form.
	 */
	const handleSubmit = (data: UserFormData) => {
		setSubmitting(true);
		editUser(data)
			.then((response) => {
				if (response.success) {
					showNotification(response.message);
					router.replace("?")
					return;
				} else {
					if (response.errors) {
						form.setErrors(response.errors);
						return;
					}
					showNotification(response.message, "error");
					return;
				}
			})
			.catch(() => {
				//TODO: Handle Error
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	return (
		<Modal
			opened
			onClose={closeModal}
			title={<Title order={3}>{props.modalTitle}</Title>}
			scrollAreaComponent={ScrollArea.Autosize}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack mt="sm" gap="lg" px="lg">
					{/* Avatar */}
					<Center>
						<Avatar
							color={stringToColorHex(props.data.id)}
							src={props.data.photoProfileUrl}
							size={120}
						>
							{props.data.name?.[0].toUpperCase()}
						</Avatar>
					</Center>

					{/* ID */}
					<TextInput
						label="ID"
						readOnly
						variant="filled"
						{...form.getInputProps("id")}
					/>

					{/* Name */}
					<TextInput
						data-autofocus
						label="Name"
						readOnly={props.readonly}
						disabled={isSubmitting}
						{...form.getInputProps("name")}
					/>

					{/* Email */}
					<TextInput
						label="Email"
						readOnly={props.readonly}
						disabled={isSubmitting}
						{...form.getInputProps("email")}
					/>

					{/* Buttons */}
					<Flex justify="flex-end" align="center" gap="lg" mt="lg">
						<Button
							variant="outline"
							onClick={closeModal}
							disabled={isSubmitting}
						>
							Close
						</Button>
						{!props.readonly && (
							<Button
								variant="filled"
								leftSection={<TbDeviceFloppy size={20} />}
								type="submit"
								loading={isSubmitting}
							>
								Save
							</Button>
						)}
					</Flex>
				</Stack>
			</form>
		</Modal>
	);
}
