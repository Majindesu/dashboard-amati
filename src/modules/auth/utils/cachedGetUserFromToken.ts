import { cache } from "react";
import getUserFromToken from "./getUserFromToken";

const cachedGetUserFromToken = cache(getUserFromToken);

export default cachedGetUserFromToken;
