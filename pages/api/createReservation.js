import prisma from "@/utils/prisma.client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    if(req.method != "POST") return res.status(400).json({ message: "Wrong request type" });
    let body = JSON.parse(JSON.stringify(req.body))
    const session = await getServerSession(req, res, authOptions)
    if(!session) return res.status(401).json({ message: "Unauthorized"});
    if(!body.reserveDateStart || !body.reserveDateEnd || !body.parkingId) return res.status(401).json({ message: "Missing a argument!"});
    //Deletes expired reservations
    let parking = await prisma.parking.findUnique({
        where: {
            id: body.parkingId
        }
    })
    if(!parking) return res.status(404).json({ message: "Parking not found!"})
    //Check for reservation conflicts
    let reservations = await prisma.reservation.findMany({
        where: {
            parkingId: body.parkingId   
        }
    })
    let conflict = false;
    reservations.forEach(reservation => {
        let reserveDateStart = Date.parse(reservation.reserveDateStart);
        let reserveDateEnd = Date.parse(reservation.reserveDateEnd);
        let bodyReserveDateStart = Date.parse(body.reserveDateStart)
        let bodyReserveDateEnd = Date.parse(body.reserveDateEnd)
        if(bodyReserveDateStart <= reserveDateEnd && bodyReserveDateStart >= reserveDateStart) conflict = true  
        if(bodyReserveDateEnd <= reserveDateEnd && bodyReserveDateEnd >= reserveDateStart) conflict = true
    });
    if(conflict) return res.status(401).json({ message: "Reservation conflicts with an existing reservation." });
    let reservation = await prisma.reservation.create({
        data: {
            reserveDateStart: body.reserveDateStart,
            reserveDateEnd: body.reserveDateEnd,
            parkingId: body.parkingId,
            email: session.user.email
        }
    })
    let parkings = await prisma.parking.findMany();
    return res.status(200).json(reservation)
}