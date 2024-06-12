import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User.model";



export async function POST(request : Request) {
    await dbConnect()

    try {

        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }),
                { status: 500 }
            );
        }

        const isCodeValid = user.verifyCode = code

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date( )

        if (isCodeValid && isCodeNotExpiry) {
            user.isVerified = true
            await user.save()

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Account verified successfullt"
                }),
                { status: 201 }
            );
        } else if(!isCodeNotExpired){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Incorrect Verification Code"
                }),
                { status: 400 }
            );
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Verification code has expired, please signup again to get a new code"
                }),
                { status: 400 }
            );
        }
        
    } catch (error) {
        console.error("Error verifing user", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error verifing user"
            }),
            { status: 500 }
        );
    }
}