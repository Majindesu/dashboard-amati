"use client";
import signIn from "@/modules/auth/actions/signInAction";
import {
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Group,
	Anchor,
	Button,
	Alert,
} from "@mantine/core";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const initialState = {
	errors: {
		message: "",
	},
};

export default function LoginPage() {
	const [state, formAction] = useFormState(signIn, initialState);

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Paper radius="md" p="xl" withBorder w={400}>
				<Text size="lg" fw={500} mb={30}>
					Welcome
				</Text>
				<form action={formAction}>
					<Stack>
						{state.errors.message ? (
							<Alert
								variant="filled"
								color="pink"
								title=""
								// icon={icon}
							>
								{state.errors.message}
							</Alert>
						) : null}
						<TextInput
							label="Email"
							placeholder="Enter your email"
							name="email"
							autoComplete="email"
						/>
						<PasswordInput
							label="Password"
							placeholder="Your password"
							name="password"
							autoComplete="password"
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
