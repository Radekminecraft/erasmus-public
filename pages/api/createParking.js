import prisma from "@/utils/prisma.client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    if(req.method != "POST") return res.status(400).json({ message: "Wrong request type" });
    let body = JSON.parse(JSON.stringify(req.body))
    const session = await getServerSession(req, res, authOptions)
    if(!session) return res.status(401).json({ message: "Unauthorized"});
    if(!body.longtitude || !body.latitude) return res.status(401).json({ message: "Missing a argument!"});
    let parking = await prisma.parking.findUnique({
        where: {
            latitude: parseFloat(body.latitude),
            longtitude: parseFloat(body.longtitude)
        }
    })
    console.log(parking)
    if(parking) return res.status(409).json({ message: "Parking spot already existing!"});
    await prisma.parking.create({
        data: {
            latitude: parseFloat(body.latitude),
            longtitude: parseFloat(body.longtitude),
        }
    })
    res.status(200).json({ name: "Success" });
}
  