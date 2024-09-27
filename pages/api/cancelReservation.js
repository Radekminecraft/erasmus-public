import prisma from "@/utils/prisma.client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    if(req.method != "POST") return res.status(400).json({ message: "Wrong request type" });
    let body = JSON.parse(JSON.stringify(req.body))
    const session = await getServerSession(req, res, authOptions)
    if(!session) return res.status(401).json({ message: "Unauthorized"});
    if(!body.reservationId) return res.status(401).json({ message: "Missing an argument!"});
    let reservation = await prisma.reservation.findUnique({
        where: {
            id: body.reservationId
        }
    })
    if(!reservation) return res.status(404).json({ message: "Reservation not found!"})
    if(reservation.email != session.user.email) return res.status(401).json({ message: "No permission"})
    await prisma.reservation.delete({
        where: {
            id: body.reservationId
        }
    })
    res.status(200).json({ name: "Reservation deleted!" });
}
  