import getUserFromToken from "@/modules/auth/utils/getUserFromToken";
import { User } from "@prisma/client";
import prisma from "@/core/db";
import Bun from "bun";

const intents = {
	listenMyWaitingLinkRequest: "listenMyWaitingLinkRequest",
} as const;

const waitingLinkRequestConnections: Map<
	string,
	Bun.ServerWebSocket<{
		channel: string;
		user: User;
		intent: string;
	}>
> = new Map();

export const server = Bun.serve<{
	channel: string;
	user: User;
	intent: string;
}>({
	async fetch(req, server) {
		const url = new URL(req.url);
		req.headers.getSetCookie();
		const pathname = url.pathname;

		const cookies = req.headers.get("Cookie");

		// Extract the Authorization header
		const authHeader = req.headers.get("Authorization");
		const token = authHeader?.startsWith("Bearer ")
			? authHeader.substring(7, authHeader.length)
			: null;

		const user = token ? await getUserFromToken(token) : null;

		const intent = pathname.substring(1);

		switch (intent) {
			case `/${intents.listenMyWaitingLinkRequest}`: {
				if (!user) {
					return new Response("Unauthorized", { status: 401 });
				}
				const channel = `mwrl-${user.id}`;
				const success = server.upgrade(req, {
					data: { user, channel, intent },
				});
				if (success) return undefined;
				break;
			}
			default: {
				return new Response("");
			}
		}
	},
	websocket: {
		async open(ws) {
			switch (ws.data.intent) {
				case intents.listenMyWaitingLinkRequest: {
					ws.subscribe(ws.data.channel);

					//retrieve user's link requests with status of waiting
					const result = await prisma.office365LinkRequest.findMany({
						where: {
							createdBy: ws.data.user.id,
							status: "WAITING",
						},
						select: {
							id: true,
						},
					});

					server.publish(ws.data.channel, JSON.stringify(result));

					waitingLinkRequestConnections.set(ws.data.channel, ws);
				}
			}
		},

		message(ws, message) {
			// the server re-broadcasts incoming messages to everyone
			// server.publish("the-group-chat", `: ${message}`);
		},
		close(ws) {
			// const msg = ` has left the chat`;
			// server.publish("the-group-chat", msg);
			// ws.unsubscribe("the-group-chat");
			switch (ws.data.intent) {
				case intents.listenMyWaitingLinkRequest: {
					ws.unsubscribe(ws.data.channel);
					waitingLinkRequestConnections.delete(ws.data.channel);
				}
			}
		},
	},
	port: 3001,
});

console.log(`Listening on ${server.hostname}:${server.port}`);
