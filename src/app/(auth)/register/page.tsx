"use client";

import createUser from "@/features/auth/actions/createUser";
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
import React, { useEffect, useState } from "react";

export interface RegisterFormSchema {
	email: string,
	password: string,
    passwordConfirmation: string,
    name: string,
}

export default function RegisterPage() {

	const [errorMessage, setErrorMessage] = useState("")

	const form = useForm<RegisterFormSchema>({
		initialValues: {
			email: "",
			password: "",
            passwordConfirmation: "",
            name: ""
		},
        validate: {
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value: string) => (value.length >= 6 ? null : 'Password should be at least 6 characters'),
            passwordConfirmation: (value: string, values: RegisterFormSchema) => value === values.password ? null : 'Passwords should match',
            name: (value: string) => (value.length > 0 ? null : 'Name is required'),
        }
	});

	const handleSubmit = async (values: RegisterFormSchema) => {
		const formData = new FormData();
		Object.entries(values)
			.forEach(([key, value]) => {
				formData.append(key, value)
			});

		const response = await createUser(formData);

		if (!response.success){
			setErrorMessage(response.error.message);

			if (response.error.errors){
				const errors = Object.entries(response.error.errors)
					.reduce((prev, [k,v]) => {
						prev[k] = v[0]
						return prev;
					}, {} as {[k: string]: string})

				form.setErrors(errors)
				console.log(form.errors)
			} else {
				form.clearErrors()
			}
		}
	}

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Paper radius="md" p="xl" withBorder w={400}>
				<Text size="lg" fw={500} mb={30}>
					Register
				</Text>
				<form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
							{...form.getInputProps("password")}
						/>
                        <PasswordInput
							label="Repeat Password"
							placeholder="Repeat yout password"
							name="passwordConfirmation"
							autoComplete="new-password"
							{...form.getInputProps("passwordConfirmation")}
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
