import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User Not Found" },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid Password" },
                { status: 400 }
            );
        }

        const response = NextResponse.json({ success: true });

        response.cookies.set("user", JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
        }));

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}