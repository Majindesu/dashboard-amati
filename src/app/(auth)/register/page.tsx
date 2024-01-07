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
import React, { useEffect } from "react";
import { api } from "@/trpc/utils";

interface RegisterFormType {
	email: string,
	password: string,
    passwordConfirmation: string,
    name: string,
}

export default function RegisterPage() {

    const {data, isLoading} = api.auth.register.useQuery();

    useEffect(() => {
        console.log("data", data)
    }, [data])

	const form = useForm<RegisterFormType>({
		initialValues: {
			email: "",
			password: "",
            passwordConfirmation: "",
            name: ""
		},
        validate: {
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value: string) => (value.length > 6 ? null : 'Password should be at least 6 characters'),
            passwordConfirmation: (value: string, values: RegisterFormType) => value === values.password ? null : 'Passwords should match',
            name: (value: string) => (value.length > 0 ? null : 'Name is required'),
        }
	});

	const handleFormSubmit = async (values: RegisterFormType) => {
		// await 
        
	}

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Paper radius="md" p="xl" withBorder w={400}>
				<Text size="lg" fw={500} mb={30}>
					Register
				</Text>
				<form onSubmit={form.onSubmit(handleFormSubmit)}>
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
