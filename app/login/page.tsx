'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    function validate(formData: FormData) {
        let valid = true;

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setEmailError("Enter valid email");
            valid = false;
        } else {
            setEmailError("");
        }

        if (password.length <= 5) {
            setPasswordError("Enter password with proper length");
            valid = false;
        } else {
            setPasswordError("");
        }

        return valid;
    }

    async function handleFormSubmit(formData: FormData) {
        if (!validate(formData)) return;

        const res = await fetch("/login-action", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            return;
        }

        //  success message
        alert("Login successful!");
        
        setTimeout(()=>{
            window.location.href=callbackUrl;
        },100)
    }

    return (
        <div>
            <Button variant="ghost" asChild className="mb-8 text-orange-500">
                <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </Button>

            <form
                action={handleFormSubmit}
                className="container mx-auto w-96 border text-center rounded-2xl p-4 flex flex-col gap-4"
            >
                <h1 className="mb-2 font-semibold text-blue-500">Login</h1>

                <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" />
                    {emailError && (
                        <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                </div>

                <div>
                    <Label>Password</Label>
                    <Input name="password" type="password" />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}
                </div>

                <Button type="submit" className="bg-gray-500">
                    Login
                </Button>

                {/*  Signup redirect */}
                <p className="text-sm mt-2">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-blue-500 underline">
                        Create one
                    </Link>
                </p>
            </form>
        </div>
    );
}