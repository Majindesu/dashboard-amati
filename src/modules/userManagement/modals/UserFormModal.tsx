/* eslint-disable react-hooks/exhaustive-deps */
import { showNotification } from "@/utils/notifications";
import {
	Flex,
	Modal,
	Stack,
	TextInput,
	Button,
	ScrollArea,
	Skeleton,
	Alert,
	Center,
	Avatar,
	PasswordInput,
	MultiSelect,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TbDeviceFloppy } from "react-icons/tb";
import userFormDataSchema, {
	UserFormData,
} from "../formSchemas/userFormSchema";
import getUserDetailById from "../actions/getUserDetailByIdAction";
import withServerAction from "@/modules/dashboard/utils/withServerAction";
import upsertUserAction from "../actions/upsertUserAction";
import ClientError from "@/core/error/ClientError";
import stringToColorHex from "@/core/utils/stringToColorHex";
import getAllRolesAction from "@/modules/role/actions/getAllRolesAction";
import Role from "@/modules/role/types/Role";

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
export default function UserFormModal(props: ModalProps) {
	const router = useRouter();
	const [isSubmitting, setSubmitting] = useState(false);
	const [isFetching, setFetching] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [roles, setRoles] = useState<Role[]>([]);

	const form = useForm<UserFormData>({
		initialValues: {
			id: "",
			email: "",
			name: "",
			photoProfileUrl: "",
			password: "",
			roles: [],
		},
		validate: zodResolver(userFormDataSchema),
		validateInputOnChange: false,
	});

	/**
	 * Fetches permission data by ID and populates the form if the modal is opened and an ID is provided.
	 */
	useEffect(() => {
		if (!props.opened || !props.id) {
			return;
		}

		setFetching(true);
		withServerAction(getUserDetailById, props.id)
			.then((response) => {
				if (response.success) {
					const data = response.data;
					form.setValues({
						email: data.email,
						id: data.id,
						name: data.name,
						photoProfileUrl: data.photoProfileUrl,
						roles: data.roles.map(role => role.code)
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

	// Fetch Roles
	useEffect(() => {
		withServerAction(getAllRolesAction)
			.then((response) => {
				setRoles(response.data);
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	const closeModal = () => {
		form.reset();
		props.onClose ? props.onClose() : router.replace("?");
	};

	const handleSubmit = (values: UserFormData) => {
		setSubmitting(true);
		withServerAction(upsertUserAction, values)
			.then((response) => {
				showNotification(response.message!, "success");
				closeModal();
			})
			.catch((e) => {
				if (e instanceof ClientError) {
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
			size="md"
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack mt="sm" gap="lg" px="lg">
					{errorMessage && <Alert>{errorMessage}</Alert>}
					{/* Avatar */}
					<Skeleton visible={isFetching}>
						<Center>
							<Avatar
								color={stringToColorHex(form.values.id ?? "")}
								src={form.values.photoProfileUrl}
								size={120}
							>
								{form.values.name?.[0]?.toUpperCase()}
							</Avatar>
						</Center>
					</Skeleton>

					{/* ID */}
					{form.values.id && (
						<TextInput
							label="ID"
							readOnly
							variant="filled"
							disabled={isSubmitting}
							{...form.getInputProps("id")}
						/>
					)}

					{/* Name */}
					<Skeleton visible={isFetching}>
						<TextInput
							data-autofocus
							label="Name"
							readOnly={props.readonly}
							disabled={isSubmitting}
							{...form.getInputProps("name")}
						/>
					</Skeleton>

					{/* Email */}
					<Skeleton visible={isFetching}>
						<TextInput
							label="Email"
							readOnly={props.readonly}
							disabled={isSubmitting}
							{...form.getInputProps("email")}
						/>
					</Skeleton>

					{/* Password */}
					{!form.values.id && !isFetching && (
						<PasswordInput
							label="Password"
							readOnly={props.readonly}
							disabled={isSubmitting}
							{...form.getInputProps("password")}
						/>
					)}

					{/* Role */}
					<MultiSelect
						label="Roles"
						readOnly={props.readonly}
						disabled={isSubmitting}
						value={form.values.roles}
						onChange={(values) =>
							form.setFieldValue("roles", values)
						}
						data={roles.map((role) => role.code)}
						error={form.errors.roles}
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
