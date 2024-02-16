import { z } from "zod";
import resellerOffice365Config from "../config";

const requestLinkFormSchema = z.object({
	numberOfLinks: z.number().min(1), // Assuming you need at least one link
	details: z.array(
		z.object({
			email: z.string().email(), // Validate string as an email
			activePeriod: z.enum(resellerOffice365Config.activePeriods), // Validate against the specific allowed values
			endUserQty: z.number().min(1), // Assuming you need at least one end user
		})
	),
});

export default requestLinkFormSchema;
