import FormResponseError from "@/errors/FormResponseError";
import { ClientResponse } from "hono/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlankRecordToNever<T> = T extends any
	? T extends null
		? null
		: keyof T extends never
			? never
			: T
	: never;

async function fetchRPC<T>(
	endpoint: Promise<ClientResponse<T>>
): Promise<BlankRecordToNever<T>> {
	const res = await endpoint;

	if (res.ok) {
		const data = await res.json();
		return data as BlankRecordToNever<T>;
	}

	//TODO: Add error reporting

	const data = (await res.json()) as unknown as {
		message?: string;
		formErrors?: Record<string, string>;
	};

	if (res.status === 422 && data.formErrors) {
		throw new FormResponseError(
			data.message ?? "Something is gone wrong",
			data.formErrors
		);
	}

	throw new Error(data.message ?? "Something is gone wrong");
}

export default fetchRPC;
