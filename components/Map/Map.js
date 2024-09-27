import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import CarIcon from "@/components/Icons/CarIcon";
import { useEffect, useState } from "react";
import prisma from "@/utils/prisma.client";
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'
import { useRouter } from "next/router";

export default function Map({ session }) {
    let [parkings, setParkings] = useState([])
    const router = useRouter();
    const getFormattedDate = (date) => new Intl.DateTimeFormat('en-CA', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date).replace(',', '').replace(/\//g, '-');
    const [form, setForm] = useState({
        startDate: getFormattedDate(new Date()),
        endDate: getFormattedDate(new Date()),
    })
    const cancelReservation = (e, id) => {
        axios.post("/api/cancelReservation", {
            reservationId: id
        })
        updateData()
        router.reload()
    }
    const updateData = () => {
        axios.get("/api/getParkings").then((data) => {
            setParkings(data.data)
        })
    }
    useEffect(() => {
        updateData()
    }, [])
    const changeFormStartDate = (e) => {
        if(Date.parse(e.target.value) < Date.parse(getFormattedDate(new Date()))) {
            setForm({...form, startDate: getFormattedDate(new Date())})
            return;
        }
        setForm({...form, startDate: e.target.value});
    };
    const changeFormEndDate = (e) => {
        if(Date.parse(e.target.value) < Date.parse(getFormattedDate(new Date()))) {
            setForm({...form, endDate: getFormattedDate(new Date())})
            return;
        }
        setForm({...form, endDate: e.target.value});
    };
    const createReservation = (e, parkingId) => {
        const startDate = new Date(form.startDate);
        const endDate = new Date(form.endDate);
        // Convert to UTC
        const reserveDateStart = startDate.toISOString();
        const reserveDateEnd = endDate.toISOString();
        axios.post("/api/createReservation/", {
            parkingId: parkingId,
            reserveDateStart: reserveDateStart,
            reserveDateEnd: reserveDateEnd,
        }).then(response => {
            console.log("Reservation created successfully:", response.data);
        }).catch(error => {
            Swal.fire({
                title: 'Error!',
                text: error.response.data.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            console.error("Error creating reservation:", error.response.data.message);
        });
        updateData()
        router.reload()
    }
    return (
    <>
        <MapContainer className="w-full h-full" center={[49.195061, 16.606836]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {parkings && parkings.map((parking) => {
                return (
                    <Marker position={[parking.latitude, parking.longtitude]} icon={CarIcon} key={parking.id} className="border-green-700">
                        <Popup>
                        <h1 className={parking.occupied ? "text-center text-red-700 text-xl" : "text-center text-green-700 text-xl"}>{parking.occupied ? "Occupied" : "Free"}</h1>
                            <div className="flex flex-col">
                                <label>Reservations:</label>
                                {parking.reservations.map((reservation) => {
                                    return (
                                        <>
                                            <hr></hr>
                                            <label>Start date: {getFormattedDate(new Date(reservation.reserveDateStart))}</label>
                                            <label>End date: {getFormattedDate(new Date(reservation.reserveDateEnd))}</label>
                                            {reservation.email == session.user.email && (<button onClick={(e) => cancelReservation(e, reservation.id)} className="p-1 bg-red-500 text-white font-medium rounded-lg shadow-lg shadow-red-500/50 transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-75">Cancel reservation</button>)}
                                        </>
                                    )
                                })}
                                <label className="pt-2">Reservation start date</label>
                                <input type="datetime-local" className="border border-slate-700 rounded-lg p-1 mb-2" value={form.startDate} onChange={(e) => changeFormStartDate(e)}/>
                                <label>Reservation end date</label>
                                <input type="datetime-local" className="border border-slate-700 rounded-lg p-1 mb-2" value={form.endDate} onChange={(e) => changeFormEndDate(e)}/>
                                <button onClick={(e) => createReservation(e, parking.id)} type="submit" className="p-1 bg-green-500 text-white font-medium rounded-lg shadow-lg shadow-green-500/50 transition duration-200 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75">Submit</button>
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    </>
    )
}