/* eslint-disable react-hooks/exhaustive-deps */
import DashboardError from "@/features/dashboard/errors/DashboardError";
import getAllPermissions from "@/features/dashboard/permissions/actions/getAllPermissions";
import getRoleById from "@/features/dashboard/roles/actions/getRoleById";
import upsertRole from "@/features/dashboard/roles/actions/upsertRole";
import roleFormDataSchema, {
	RoleFormData,
} from "@/features/dashboard/roles/formSchemas/RoleFormData";
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
	Chip,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TbDeviceFloppy } from "react-icons/tb";
import { string } from "zod";

export interface ModalProps {
	title: string;
	readonly?: boolean;
	id?: string;
	opened: boolean;
	onClose?: () => void;
}

/**
 * A component for rendering a modal with a form to create or edit a role.
 *
 * @param props - The props for the component.
 * @returns The rendered element.
 */
export default function FormModal(props: ModalProps) {
	const router = useRouter();
	const [isSubmitting, setSubmitting] = useState(false);
	const [isFetching, setFetching] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [allPermissions, setAllPermissions] = useState<
		{ code: string; name: string }[] | undefined
	>(undefined);

	const form = useForm<RoleFormData>({
		initialValues: {
			code: "",
			description: "",
			id: "",
			isActive: false,
			name: "",
			permissions: [],
		},
		validate: zodResolver(roleFormDataSchema),
		validateInputOnChange: false,
		onValuesChange: (values) => {
			console.log(values);
		},
	});

	//Fetch Permissions
	useEffect(() => {
		setFetching(true);
		withErrorHandling(getAllPermissions)
			.then((response) => {
				setAllPermissions(response.data);
			})
			.catch((e) => {
				if (e instanceof DashboardError) {
					setErrorMessage(`ERROR: ${e.message} (${e.errorCode})`);
				} else if (e instanceof Error) {
					setErrorMessage(`ERROR: ${e.message}`);
				} else {
					setErrorMessage(
						`Unkown error is occured. Please contact administrator`
					);
				}
			})
			.finally(() => {
				setFetching(false);
			});
	}, []);

	/**
	 * Fetches role data by ID and populates the form if the modal is opened and an ID is provided.
	 */
	useEffect(() => {
		if (!props.opened || !props.id) {
			return;
		}

		setFetching(true);
		withErrorHandling(getRoleById, props.id)
			.then((response) => {
				const data = response.data;
				form.setValues({
					code: data.code,
					description: data.description,
					id: data.id,
					isActive: data.isActive,
					name: data.name,
					permissions: data.permissions.map(
						(permission) => permission.code
					),
				});
			})
			.catch((e) => {
				if (e instanceof DashboardError) {
					setErrorMessage(`ERROR: ${e.message} (${e.errorCode})`);
				} else if (e instanceof Error) {
					setErrorMessage(`ERROR: ${e.message}`);
				} else {
					setErrorMessage(
						`Unkown error is occured. Please contact administrator`
					);
				}
			})
			.finally(() => {
				setFetching(false);
			});
	}, [props.opened, props.id]);

	const closeModal = () => {
		props.onClose ? props.onClose() : router.replace("?");
		form.reset();
	};

	const handleSubmit = (values: RoleFormData) => {
		setSubmitting(true);
		withErrorHandling(upsertRole, values)
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

					<Fieldset legend="Permissions">
						<Chip.Group
							multiple
							value={form.values.permissions}
							onChange={(values) =>
								!props.readonly &&
								form.setFieldValue("permissions", values)
							}
						>
							<Flex wrap="wrap" gap="md">
								{allPermissions?.map((permission) => (
									<div key={permission.code}>
										<Chip
											disabled={isSubmitting}
											value={permission.code}
										>
											{permission.code}
										</Chip>
									</div>
								))}
							</Flex>
						</Chip.Group>
					</Fieldset>

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
