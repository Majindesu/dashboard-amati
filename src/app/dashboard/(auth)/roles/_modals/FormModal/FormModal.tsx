"use client";
import upsertRole from "@/features/dashboard/roles/actions/upsertRole";
import roleFormDataSchema, {
	RoleFormData,
} from "@/features/dashboard/roles/formSchemas/RoleFormData";
import { showNotification } from "@/utils/notifications";
import {
	Flex,
	Modal,
	Stack,
	Switch,
	TextInput,
	Textarea,
	Button,
	ScrollArea,
	Checkbox,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TbDeviceFloppy } from "react-icons/tb";

interface Props {
	title: string;
	readonly?: boolean;
	data: RoleFormData;
	opened: boolean;
	onClose?: () => void;
}

export default function FormModal(props: Props) {
	const router = useRouter();

	const [isSubmitting, setSubmitting] = useState(false);
	const [value, setValue] = useState("");

	const form = useForm<RoleFormData>({
		initialValues: props.data,
		validate: zodResolver(roleFormDataSchema),
		validateInputOnChange: false,
		onValuesChange: (values) => {
			console.log(values);
		},
	});

	const closeModal = () => {
		form.reset();
		props.onClose ? props.onClose() : router.replace("?");
	};

	const handleSubmit = (values: RoleFormData) => {
		upsertRole(values)
			.then((response) => {
				if (response.success){
					showNotification(response.message,"success");
					return closeModal()
				} else {
					form.setErrors(response.errors ?? {});
					if (!response.errors){
						showNotification(response.message, "error")
					}
				}
			})
			.catch(e =>{
				//TODO: Handle Error
				console.log(e)
			}) 
	}

	return (
		<Modal
			opened={props.opened}
			onClose={closeModal}
			title={props.title}
			scrollAreaComponent={ScrollArea.Autosize}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack mt="sm" gap="lg" px="lg">
					{/* ID */}
					{props.data.id ? (
						<TextInput
							label="ID"
							readOnly
							variant="filled"
							{...form.getInputProps("id")}
						/>
					) : (
						<div></div>
					)}

					{/* Code */}
					<TextInput
						data-autofocus
						label="Code"
						readOnly={props.readonly}
						disabled={isSubmitting}
						{...form.getInputProps("code")}
					/>

					{/* Name */}
					<TextInput
						label="Name"
						readOnly={props.readonly}
						disabled={isSubmitting}
						{...form.getInputProps("name")}
					/>

					{/* Description */}
					<Textarea
						label="Description"
						readOnly={props.readonly}
						disabled={isSubmitting}
						{...form.getInputProps("description")}
					/>

					<Checkbox
						label="Active"
						labelPosition="right"
						{...form.getInputProps("isActive", {
							type: "checkbox",
						})}
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
