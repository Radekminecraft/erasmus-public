import prisma from "@/utils/prisma.client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    if(req.method != "GET") return res.status(400).json({ message: "Wrong request type" });
    const session = await getServerSession(req, res, authOptions)
    if(!session) return res.status(401).json({ message: "Unauthorized"});
    //Deletes expired reservations
    await prisma.reservation.deleteMany({
        where: {
          reserveDateEnd: {
            lt: new Date(),
          },
        },
    });
    let parkings = await prisma.parking.findMany({
      include: {
        reservations: true
      }
    });
    //check if the parking is free
    parkings = parkings.map(parking => {
      let occupied = false;
      let activeReservation = null;

      parking.reservations.forEach(reservation => {
          const now = Date.now();
          const reserveDateStart = Date.parse(reservation.reserveDateStart);
          const reserveDateEnd = Date.parse(reservation.reserveDateEnd);
          if (now >= reserveDateStart && now <= reserveDateEnd) {
              occupied = true;
              activeReservation = reservation;
          }
      });
      return {
          ...parking,
          occupied,
          activeReservation, 
      };
  });
    return res.status(200).json(parkings)
}