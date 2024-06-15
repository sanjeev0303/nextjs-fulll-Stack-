import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";




export async function DELETE(request : Request, {params}: {params: {messageid: string}}) {

    const messageId = params.messageid

    await dbConnect()

    const session = await getServerSession( authOptions )

    const user: User = session?.user as User

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated"
            }),
            { status: 401 }
        );
}

try {
    const updateResult = await UserModel.updateOne(
        { _id: user._id }
        { $pull: {messages: { _id: messageId }} }
    )

    if (updateResult.modifiedCount == 0) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Message not found or already delete"
            }),
            { status: 404 }
        );
    }

    return new Response(
        JSON.stringify({
            success: true,
            message: "Message delete successfully"
        }),
        { status: 201 }
    );


} catch (error) {
    console.error("Error in deleting message route: ", error);
    
    return new Response(
        JSON.stringify({
            success: false,
            message: "Error deleting message"
        }),
        { status: 500 }
    );
}


}