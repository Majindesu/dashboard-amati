import {
	Alert,
	Button,
	Divider,
	Fieldset,
	Flex,
	Group,
	Modal,
	NumberInput,
	ScrollArea,
	Select,
	Stack,
	TextInput,
	Loader,
	Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React, { useState } from "react";
import {
	TbAt,
	TbCalendarTime,
	TbDeviceFloppy,
	TbLink,
	TbUser,
	TbUsers,
} from "react-icons/tb";
import resellerOffice365Config from "../config";
import requestLinkFormSchema from "../formSchemas/requestLinkFormSchema";
import withServerAction from "@/modules/dashboard/utils/withServerAction";
import createLinkRequest from "../actions/createLinkRequest";
import { notifications } from "@mantine/notifications";
import DashboardError from "@/modules/dashboard/errors/DashboardError";

export interface ModalProps {
	title: string;
	opened: boolean;
	readonly: boolean;
	onClose?: () => void;
}

export default function RequestModal(props: ModalProps) {
	const [formState, setFormState] = useState<
		"idle" | "submitting" | "waiting"
	>("idle");

	const [errorMessage, setErrorMessage] = useState("");

	const closeModal = () => {
		props.onClose ? props.onClose() : "";
	};

	const form = useForm<RequestLinkForm>({
		initialValues: {
			numberOfLinks: 1,
			details: [
				{
					email: "",
					activePeriod: "2 Years",
					endUserQty: 1,
				},
			],
		},
		validate: zodResolver(requestLinkFormSchema),
		onValuesChange: (values, prev) => {
			// Check if numberOfLinks has changed
			if (values.numberOfLinks !== prev.numberOfLinks) {
				const currentDetails = values.details;
				const targetLength = values.numberOfLinks;

				// Add new detail objects if numberOfLinks has increased
				while (currentDetails.length < targetLength) {
					currentDetails.push({
						email: "",
						activePeriod: "2 Years",
						endUserQty: 1,
					});
				}

				// Remove extra detail objects if numberOfLinks has decreased
				if (currentDetails.length > targetLength) {
					currentDetails.length = targetLength; // Adjusts the array length
				}

				// Update the form values with the adjusted details array
				form.setValues({
					...values,
					details: currentDetails,
				});
			}
		},
	});

	const disableChange = formState !== "idle";

	const handleSubmit = (values: RequestLinkForm) => {
		const submitableState = ["idle"];

		if (!submitableState.includes(formState)) return; //prevent submit

		setFormState("submitting");

		withServerAction(createLinkRequest, values)
			.then((response) => {
				notifications.show({
					message: response.message,
					color: "green",
				});
				setFormState("waiting");
			})
			.catch((e) => {
				if (e instanceof DashboardError) {
					if (e.errorCode === "INVALID_FORM_DATA") {
						if (e.formErrors) {
							form.setErrors(e.formErrors);
						} else {
							setErrorMessage(e.message);
						}
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

				setFormState("idle");
			});
	};

	return (
		<Modal
			size="sm"
			opened={props.opened}
			title={formState === "waiting" ? "Link Request Detail" : "Create New Request"}
			onClose={closeModal}
			scrollAreaComponent={ScrollArea.Autosize}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="md">
					{formState === "waiting" && (
						<Alert color="orange">
							Your request is being processed by administrator
						</Alert>
					)}

					<NumberInput
						label="Please input the number of links you request"
						min={1}
						max={3}
						allowDecimal={false}
						clampBehavior="strict"
						leftSection={<TbLink />}
						disabled={disableChange}
						{...form.getInputProps("numberOfLinks")}
					/>

					<Divider
						label="End User Information"
						labelPosition="center"
					/>

					<Stack>
						{form.values.details.map((item, i) => (
							<Fieldset key={i} legend={`Information ${i + 1}`}>
								<TextInput
									leftSection={<TbAt />}
									label="Email"
									disabled={disableChange}
									{...form.getInputProps(
										`details.${i}.email`
									)}
								/>
								<Flex gap="md">
									<Select
										data={
											resellerOffice365Config.activePeriods
										}
										label="Active Period"
										disabled={disableChange}
										leftSection={<TbCalendarTime />}
										{...form.getInputProps(
											`details.${i}.activePeriod`
										)}
									/>
									<NumberInput
										label="End User Quantity"
										leftSection={<TbUsers />}
										min={1}
										max={5}
										disabled={disableChange}
										allowDecimal={false}
										clampBehavior="strict"
										{...form.getInputProps(
											`details.${i}.endUserQty`
										)}
									/>
								</Flex>
							</Fieldset>
						))}
					</Stack>

					{/* Buttons */}
					<Flex justify="flex-end" align="center" gap="lg" mt="lg">
						<Button
							variant="outline"
							onClick={closeModal}
							disabled={["submitting"].includes(formState)}
						>
							Close
						</Button>
						{(!props.readonly || formState === "waiting") && (
							<Button
								variant="filled"
								leftSection={<TbDeviceFloppy size={20} />}
								type="submit"
								disabled={["submitting", "waiting"].includes(
									formState
								)}
								loading={["submitting"].includes(formState)}
							>
								Make Request
							</Button>
						)}
					</Flex>
				</Stack>
			</form>
		</Modal>
	);
}
