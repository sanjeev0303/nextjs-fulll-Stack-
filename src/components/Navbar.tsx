'use client'

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

// Assuming Button is a custom component or imported from a library
// import Button from "./Button"; // Adjust the import path as needed

const Navbar = () => {
    const { data: session } = useSession();

    // Optional chaining and type assertion
    const user: User | undefined = session?.user as User | undefined;

    return (
        <nav>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a className="text-xl font-bold mb-4 md:mb-0" href="#">Mystry Message</a>
                {
                    session ? (
                        <>
                            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
                            <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className='w-full md:w-auto'>Login</Button>
                        </Link>
                    )
                }
            </div>
         </nav>
    );
}

export default Navbar;