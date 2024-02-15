import {
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
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

export interface ModalProps {
	title: string;
	opened: boolean;
	readonly: boolean;
	onClose?: () => void;
}

interface FormType {
	numberOfLinks: number;
	details: {
		email: string;
		activePeriod: (typeof resellerOffice365Config.activePeriods)[number];
		endUserQty: number;
	}[];
}

export default function RequestModal(props: ModalProps) {
	const [formState, setFormState] = useState<
		"idle" | "submitting" | "waiting"
	>("idle");

	const closeModal = () => {
		props.onClose ? props.onClose() : "";
	};

	const form = useForm<FormType>({
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

	const handleSubmit = (values: FormType) => {
		const submitableState = ["idle"];

		if (!submitableState.includes(formState)) return; //prevent submit

		setFormState("submitting");
	};

	return (
		<Modal
			size="sm"
			opened={props.opened}
			title={props.title}
			onClose={closeModal}
			scrollAreaComponent={ScrollArea.Autosize}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="md">
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
								loading={["submitting", "waiting"].includes(
									formState
								)}
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
