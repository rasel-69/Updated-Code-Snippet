'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "@/lib/auth-client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export default function SignupPage() {

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    function validate(formData: FormData) {
        let valid = true;

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setEmailError("Input Valid Email");
            valid = false;
        } else {
            setEmailError("");
        }

        if (password.length <= 5) {
            setPasswordError("Password must be more than 5 characters");
            valid = false;
        } else {
            setPasswordError("");
        }

        return valid;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget); // Add this line

        if (!validate(formData)) return; // Add validation call

        const res = await fetch("/signup-action", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            return;
        }
        alert("Successfully Registered!");
    
        window.location.href = "/login";
    }


    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-6 bg-white shadow-xl rounded-xl border">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <span className="text-lg font-medium text-gray-700">Loading...</span>
                </div>
            </div>
        );
    }



    return (
        <div className="mt-14">
            <Button variant="ghost" asChild className="mb-8 text-orange-500">
                <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </Button>

            <form
                onSubmit={handleSubmit}
                className="container mx-auto w-96 border text-center rounded-2xl p-4 flex flex-col gap-4"
            >
                <h1 className="mb-2 font-semibold text-xl text-green-500">Please Sign Up</h1>

                <div>
                    <Label>Name</Label>
                    <Input name="name" />
                </div>

                <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                </div>

                <div>
                    <Label>Password</Label>
                    <Input name="password" type="password" />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                </div>

                <Button type="submit" className="bg-gray-500">Sign Up</Button>
                <div className="relative flex items-center">
                    <div className="grow border-t border-amber-600"></div>
                    <span className=" mx-4 text-gray-400 text-sm">OR</span>
                    <div className="grow border-t border-amber-600"></div>
                </div>

                <Button type="button" className="bg-gray-500" disabled >Sign Up With GitHub</Button>
            </form>
        </div>
    );
}