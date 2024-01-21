import React from 'react'

export default async function Dashboard() {

    const session = await auth();

    const user = session?.user;

    console.log("session", session);

    console.log("user", user);
    
    return (
        <div>Dashbaord</div>
    )
}
