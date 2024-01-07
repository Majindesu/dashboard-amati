"use client";

import { signIn } from "next-auth/react";
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
import React from "react";

/**
 * Type definition for login form values.
 */
interface LoginFormType {
	email: string,
	password: string
}

/**
 * LoginPage component: Renders a login form allowing users to authenticate using their credentials.
 * Utilizes Mantine for UI components and Next-Auth for authentication handling.
 * 
 * @returns React functional component representing the login page.
 */
export default function LoginPage() {
	const form = useForm<LoginFormType>({
		initialValues: {
			email: "",
			password: "",
		},
	});

	/**
	 * Handles form submission by calling Next-Auth signIn function with credentials.
	 * 
	 * @param values - Object containing email and password entered by the user.
	 */
	const handleFormSubmit = async (values: LoginFormType) => {
		await signIn("credentials", {
			email: values.email,
			password: values.password,
			callbackUrl: "/"
		})
	}

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Paper radius="md" p="xl" withBorder w={400}>
				<Text size="lg" fw={500} mb={30}>
					Welcome
				</Text>
				<form onSubmit={form.onSubmit(handleFormSubmit)}>
					<Stack>
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
							autoComplete="password"
							{...form.getInputProps("password")}
						/>
					</Stack>

					<Group justify="space-between" mt="xl">
						<Anchor
							component="a"
							type="button"
							c="dimmed"
							size="xs"
							href="/register"
						>
							Don&apos;t have an account? Register
						</Anchor>

                        <Button type="submit" radius="xl">
                            Login
                        </Button>
					</Group>
				</form>
			</Paper>
		</div>
	);
}
