import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Group,
	Button,
	Alert,
} from "@mantine/core";
import client from "../../honoClient";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

export const Route = createLazyFileRoute("/login/")({
	component: LoginPage,
});

type FormSchema = {
	username: string;
	password: string;
};

const formSchema = z.object({
	username: z.string().min(1, "This field is required"),
	password: z.string().min(1, "This field is required"),
});

export default function LoginPage() {
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const { isAuthenticated, saveAuthData } = useAuth();

	const form = useForm<FormSchema>({
		initialValues: {
			username: "",
			password: "",
		},
		validate: zodResolver(formSchema),
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate({
				to: "/dashboard",
				replace: true,
			});
		}
	}, [navigate, isAuthenticated]);

	const loginMutation = useMutation({
		mutationFn: async (values: FormSchema) => {
			const res = await client.auth.login.$post({
				form: values,
			});

			if (res.ok) {
				return await res.json();
			}

			throw res;
		},

		onSuccess: (data) => {
			saveAuthData(
				{
					id: data.user.id,
					name: data.user.name,
					permissions: data.user.permissions,
				},
				data.accessToken
			);
		},

		onError: async (error) => {
			console.log("error!");
			if (error instanceof Response) {
				const body = await error.json();
				setErrorMessage(body.message as string);
				return;
			}
			console.log("bukan error");
		},
	});

	const handleSubmit = (values: FormSchema) => {
		loginMutation.mutate(values);
	};

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Paper radius="md" p="xl" withBorder w={400}>
				<Text size="lg" fw={500} mb={30}>
					Welcome
				</Text>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack>
						{errorMessage ? (
							<Alert
								variant="filled"
								color="pink"
								title=""
								// icon={icon}
							>
								{errorMessage}
							</Alert>
						) : null}
						<TextInput
							label="Username or Email"
							placeholder="Enter your username or email"
							name="username"
							autoComplete="username"
							disabled={loginMutation.isPending}
							{...form.getInputProps("username")}
						/>
						<PasswordInput
							label="Password"
							placeholder="Your password"
							name="password"
							autoComplete="password"
							disabled={loginMutation.isPending}
							{...form.getInputProps("password")}
						/>
					</Stack>

					<Group justify="space-between" mt="xl">
						{/* <Anchor
							component="a"
							type="button"
							c="dimmed"
							size="xs"
							href="/register"
						>
							Don&apos;t have an account? Register
						</Anchor> */}
						<div />

						<Button
							type="submit"
							radius="xl"
							disabled={loginMutation.isPending}
						>
							Login
						</Button>
					</Group>
				</form>
			</Paper>
		</div>
	);
}
