import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import exp from "constants";
import mongoose from "mongoose";




export async function GET(request : Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id)

    try {

        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" }, 
            { $sort: "messages.createdAt": -1 }, 
            { $group: {_id: '$_id', messages: {$push: '$messages'}} }, 

        ])

        if (!user || user.length === 0 ) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify({
                success: true,
                messages: user[0].messages
            }),
            { status: 200 }
        );

        
    } catch (error) {
        console.log("An unexpected message occure: ", error);
        
        return new Response(
            JSON.stringify({
                success: false,
                message: "An unexpected message occure"
            }),
            { status: 500 }
        );
    }



}