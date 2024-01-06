"use client";

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

export default function LoginPage() {
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},
	});

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Paper radius="md" p="xl" withBorder w={400}>
				<Text size="lg" fw={500} mb={30}>
					Welcome
				</Text>
				<form>
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
							Don't have an account? Register
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
