/* eslint-disable react-hooks/exhaustive-deps */
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
	Skeleton,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React, { useEffect, useState } from "react";
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
import getLinkRequestDataById from "../actions/getLinkRequestDataById";
import { isPagesAPIRouteMatch } from "next/dist/server/future/route-matches/pages-api-route-match";

export interface ModalProps {
	title: string;
	opened: boolean;
	onClose?: () => void;
	type: "create" | "detail" | "waiting" | "input link";
	detailId: string | null;
}

export default function RequestModal(props: ModalProps) {
	const [formState, setFormState] = useState<
		"idle" | "submitting" | "waiting" | "fetching" | "error"
	>("idle");

	const [errorMessage, setErrorMessage] = useState("");

	const closeModal = () => {
		if (formState === "submitting") return; //prevents closing
		//reset state
		setErrorMessage("");
		setFormState("idle");
		form.reset();
		props.onClose ? props.onClose() : "";
	};

	useEffect(() => {
		const fetchDataById = async (id: string) => {
			const { data } = await withServerAction(getLinkRequestDataById, id);
			if (!props.opened) return;
			return data;
		};

		switch (props.type) {
			case "detail":
			case "input link": {
				if (!props.detailId || !props.opened) return;
				setFormState("fetching");
				fetchDataById(props.detailId)
					.then((data) => {
						if (!data) {
							closeModal();
							notifications.show({
								message:
									"The returned data from server is empty. Please try again",
								color: "red",
							});
							return;
						}
						form.setValues({
							numberOfLinks: data.links.length,
							id: data.id,
							details: data.links.map((item) => ({
								activePeriod: item.activePeriod,
								email: item.email,
								endUserQty: item.numberOfUsers,
							})),
						});
					})
					.catch((e) => {
						if (e instanceof Error) {
							setErrorMessage(e.message);
						} else {
							setErrorMessage("Unkown error occured");
						}
					})
					.finally(() => {
						setFormState("idle");
					});
				break;
			}
		}
	}, [props]);

	const form = useForm<RequestLinkForm>({
		initialValues: {
			id: undefined,
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

	const handleSubmit = (values: RequestLinkForm) => {
		const submitableState: (typeof formState)[] = ["idle"];

		if (!submitableState.includes(formState)) return; //prevent submit when not in subitable state

		setFormState("submitting");

		switch (props.type) {
			case "create": {
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
								setErrorMessage(
									`ERROR: ${e.message} (${e.errorCode})`
								);
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
				break;
			}
			case "input link": {
				//TODO: Handle add link
			}
		}
	};

	const disableChange = formState !== "idle";
	const readonly = ["input link", "detail"].includes(props.type)
	const showSkeleton = formState === "fetching";
	const showActivationLink = ["input link", "detail"].includes(props.type)
	const enableInputActivationLink = props.type === "input link"

	return (
		<Modal
			size="sm"
			opened={props.opened}
			title={
				formState === "waiting"
					? "Link Request Detail"
					: "Create New Request"
			}
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

					{errorMessage && <Alert color="red">{errorMessage}</Alert>}

					<Skeleton visible={showSkeleton}>
						<NumberInput
							label="Please input the number of links you request"
							min={1}
							max={3}
							allowDecimal={false}
							clampBehavior="strict"
							leftSection={<TbLink />}
							disabled={disableChange}
							readOnly={readonly}
							{...form.getInputProps("numberOfLinks")}
						/>
					</Skeleton>

					<Divider
						label="End User Information"
						labelPosition="center"
					/>

					<Stack>
						{form.values.details.map((item, i) => (
							<Fieldset key={i} legend={`Information ${i + 1}`}>
								<Stack gap="xs">
									<Skeleton visible={showSkeleton}>
										<TextInput
											leftSection={<TbAt />}
											label="Email"
											readOnly={readonly}
											disabled={disableChange}
											{...form.getInputProps(
												`details.${i}.email`
											)}
										/>
									</Skeleton>
									<Flex gap="md">
										<Skeleton visible={showSkeleton}>
											<Select
												data={
													resellerOffice365Config.activePeriods
												}
												label="Active Period"
												disabled={disableChange}
												readOnly={readonly}
												leftSection={<TbCalendarTime />}
												{...form.getInputProps(
													`details.${i}.activePeriod`
												)}
											/>
										</Skeleton>
										<Skeleton visible={showSkeleton}>
											<NumberInput
												label="End User Quantity"
												leftSection={<TbUsers />}
												min={1}
												max={5}
												disabled={disableChange}
												allowDecimal={false}
												readOnly={readonly}
												clampBehavior="strict"
												{...form.getInputProps(
													`details.${i}.endUserQty`
												)}
											/>
										</Skeleton>
									</Flex>
									{showActivationLink && (
										<Skeleton visible={showSkeleton}>
											<TextInput
												label="Activation Link"
												required
												disabled={disableChange}
												readOnly={!enableInputActivationLink}
												placeholder={enableInputActivationLink ? "Enter link here" : "No link provided"}
											/>
										</Skeleton>
									)}
								</Stack>
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
						{formState === "waiting" && (
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
