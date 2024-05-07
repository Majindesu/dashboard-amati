import { hc } from "hono/client";
import { AppType } from "backend";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL as string | undefined;

console.log(backendUrl);

if (!backendUrl) throw new Error("Backend URL not set");

const client = hc<AppType>(backendUrl, {
	headers: () => ({
		Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
	}),
});

export default client;
