"use server"

import { redirect } from "next/navigation";
import getUser from "./getUser"

export default async function guestOnly(){

    const user = await getUser();

    if (user){
        redirect("dashboard")
    }
}
