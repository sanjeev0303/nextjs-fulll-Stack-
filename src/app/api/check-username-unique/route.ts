import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url); // Corrected typo: `serarchParams` to `searchParams`
        const queryParam = {
            username: searchParams.get("username")
        };

        // Validate with Zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        // console.log(result); // remove
        // console.log(result.data);
        

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];

            return new Response(
                JSON.stringify({
                    success: false,
                    message: usernameError.length > 0 ? usernameError.join(', ') : "Invalid query parameters",
                }),
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Username is unique"
            }),
            { status: 201 }
        );

    } catch (error) {
        console.error("Error checking username", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error checking username"
            }),
            { status: 500 }
        );
    }
}