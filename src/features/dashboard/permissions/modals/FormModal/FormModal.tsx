/* eslint-disable react-hooks/exhaustive-deps */
import DashboardError from "@/features/dashboard/errors/DashboardError";
import getPermissionById from "@/features/dashboard/permissions/actions/getPermissionById";
import upsertPermission from "@/features/dashboard/permissions/actions/upsertPermission";
import permissionFormDataSchema, {
	PermissionFormData,
} from "@/features/dashboard/permissions/formSchemas/PermissionFormData";
import withErrorHandling from "@/features/dashboard/utils/withServerAction";
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
	Skeleton,
	Fieldset,
	Alert,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { TbDeviceFloppy } from "react-icons/tb";

export interface ModalProps {
	title: string;
	readonly?: boolean;
	id?: string;
	opened: boolean;
	onClose?: () => void;
}

/**
 * A component for rendering a modal with a form to create or edit a permission.
 *
 * @param props - The props for the component.
 * @returns The rendered element.
 */
export default function FormModal(props: ModalProps) {
	const router = useRouter();
	const [isSubmitting, setSubmitting] = useState(false);
	const [isFetching, setFetching] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm<PermissionFormData>({
		initialValues: {
			code: "",
			description: "",
			id: "",
			isActive: false,
			name: "",
		},
		validate: zodResolver(permissionFormDataSchema),
		validateInputOnChange: false,
		onValuesChange: (values) => {
			console.log(values);
		},
	});

	/**
	 * Fetches permission data by ID and populates the form if the modal is opened and an ID is provided.
	 */
	useEffect(() => {
		if (!props.opened || !props.id) {
			return;
		}

		setFetching(true);
		getPermissionById(props.id)
			.then((response) => {
				if (response.success) {
					const data = response.data;
					form.setValues({
						code: data.code,
						description: data.description,
						id: data.id,
						isActive: data.isActive,
						name: data.name,
					});
				}
			})
			.catch((e) => {
				//TODO: Handle error
				console.log(e);
			})
			.finally(() => {
				setFetching(false);
			});
	}, [props.opened, props.id]);

	const closeModal = () => {
		props.onClose ? props.onClose() : router.replace("?");
	};

	const handleSubmit = (values: PermissionFormData) => {
		setSubmitting(true);
		withErrorHandling(() => upsertPermission(values))
			.then((response) => {
				showNotification(response.message!, "success");
				closeModal();
			})
			.catch((e) => {
				if (e instanceof DashboardError) {
					if (e.errorCode === "INVALID_FORM_DATA") {
						form.setErrors(e.formErrors ?? {});
					} else {
						setErrorMessage(`ERROR: ${e.message} (${e.errorCode})`);
					}
				} else if (e instanceof Error) {
					setErrorMessage(`ERROR: ${e.message}`);
				} else {
					setErrorMessage(
						`Unkown error is occured. Please contact administrator`
					);
				}
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	return (
		<Modal
			opened={props.opened}
			onClose={closeModal}
			title={props.title}
			scrollAreaComponent={ScrollArea.Autosize}
			size="xl"
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack mt="sm" gap="lg" px="lg">
					{errorMessage && <Alert color="red">{errorMessage}</Alert>}
					{/* ID */}
					{form.values.id ? (
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
					<Skeleton visible={isFetching}>
						<TextInput
							data-autofocus
							label="Code"
							readOnly={props.readonly}
							disabled={isSubmitting}
							{...form.getInputProps("code")}
						/>
					</Skeleton>

					{/* Name */}
					<Skeleton visible={isFetching}>
						<TextInput
							label="Name"
							readOnly={props.readonly}
							disabled={isSubmitting}
							{...form.getInputProps("name")}
						/>
					</Skeleton>

					{/* Description */}
					<Skeleton visible={isFetching}>
						<Textarea
							label="Description"
							readOnly={props.readonly}
							disabled={isSubmitting}
							{...form.getInputProps("description")}
						/>
					</Skeleton>

					<Skeleton visible={isFetching}>
						<Checkbox
							label="Active"
							labelPosition="right"
							{...form.getInputProps("isActive", {
								type: "checkbox",
							})}
						/>
					</Skeleton>

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
