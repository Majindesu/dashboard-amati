"use client";

import { auth } from "@/features/auth";
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

interface LoginFormType {
	email: string,
	password: string
}

export default function LoginPage() {
	const form = useForm<LoginFormType>({
		initialValues: {
			email: "",
			password: "",
		},
	});

	const handleFormSubmit = async (values: LoginFormType) => {
		await signIn("credentials", {
			email: values.email,
			password: values.password,
			callbackUrl: "/"
		})
	}

	// const session = await auth()
	// const user = session?.user;

	// console.log("session", session)
	// console.log("user",user);

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
							component="button"
							type="button"
							c="dimmed"
							// onClick={() => toggle()}
							size="xs"
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
