"use client";

import createUserAction from "@/modules/auth/actions/createUserAction";
import createUser from "@/modules/auth/actions/createUserAction";
import { CreateUserSchema } from "@/modules/auth/formSchemas/CreateUserFormSchema";
import DashboardError from "@/modules/dashboard/errors/DashboardError";
import withServerAction from "@/modules/dashboard/utils/withServerAction";
import {
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Group,
	Anchor,
	Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useState } from "react";

export default function RegisterPage() {
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm<CreateUserSchema>({
		initialValues: {
			email: "",
			plainPassword: "",
			plainPasswordConfirmation: "",
			name: "",
		},
		validate: {
			email: (value: string) =>
				/^\S+@\S+$/.test(value) ? null : "Invalid email",
			plainPassword: (value: string) =>
				value.length >= 6
					? null
					: "Password should be at least 6 characters",
			plainPasswordConfirmation: (value: string, values: CreateUserSchema) =>
				value === values.plainPassword ? null : "Passwords should match",
			name: (value: string) =>
				value.length > 0 ? null : "Name is required",
		},
	});

	const handleSubmit = async (values: CreateUserSchema) => {
		withServerAction(createUserAction, form.values)
			.then((response) => {
				showNotification({message: "Register Success", color: "green"})
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
	};

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Paper radius="md" p="xl" withBorder w={400}>
				<Text size="lg" fw={500} mb={30}>
					Register
				</Text>
				<form
					onSubmit={form.onSubmit((values) => handleSubmit(values))}
				>
					<Stack>
						<TextInput
							label="Name"
							placeholder="Enter your name"
							name="name"
							autoComplete="name"
							{...form.getInputProps("name")}
						/>
						<TextInput
							label="Email"
							placeholder="Enter your email"
							name="email"
							autoComplete="email"
							{...form.getInputProps("email")}
						/>
						<PasswordInput
							label="Password"
							placeholder="Your password"
							name="password"
							autoComplete="new-password"
							{...form.getInputProps("plainPassword")}
						/>
						<PasswordInput
							label="Repeat Password"
							placeholder="Repeat yout password"
							name="passwordConfirmation"
							autoComplete="new-password"
							{...form.getInputProps("plainPasswordConfirmation")}
						/>
					</Stack>

					<Group justify="space-between" mt="xl">
						<Anchor
							component="a"
							type="button"
							c="dimmed"
							// onClick={() => toggle()}
							size="xs"
							href="/login"
						>
							Already have an account? Login
						</Anchor>

						<Button type="submit" radius="xl">
							Register
						</Button>
					</Group>
				</form>
			</Paper>
		</div>
	);
}
