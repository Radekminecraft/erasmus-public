import Header from '@/components/Header/Header';
import Map from '@/components/Map/';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function createParking() {
    const { data: session, status } = useSession()
    const [form, setForm] = useState({
      longtitude: "",
      latitude: ""
    });
    if(status == "loading"){
      return (
        <>
          <h1>Products</h1>
          <div>Loading...</div>
        </>
      ); 
    }
    if(!session) {
      window.location.href = "/login"
    }
    const createParkingSpot = (e, coords) => {
      axios
      .post("/api/createParking", {
        longtitude: form.longtitude,
        latitude: form.latitude,
      }).then((data) => {
        Swal.fire({
          title: 'Success!',
          text: "Created a new parking location!",
          icon: 'success',
          confirmButtonText: 'Ok'
      })
      }).catch(error => {
        Swal.fire({
            title: 'Error!',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        console.error("Error creating parking:", error.response.data.message);
    });;
    }
    const changeFormLongtitude = (e) => {
      setForm({...form, longtitude: e.target.value})
    };
    const changeFormLatitude = (e) => {
      setForm({...form, latitude: e.target.value})
    };
    return (
        <>
          <div className="flex flex-col h-screen">
            <Header session={session}/>
            <div className="flex flex-col h-screen justify-center items-center">
            <div className="border flex-col p-4 border-slate-800 rounded-lg">
              <h1 className="font-bold text-2xl text-center mb-4">Add a parking spot</h1>
              <div className="flex flex-col mb-4">
                <label className="mb-2">Longitude for this parking position</label>
                <input className="border p-2" value={form.longtitude} onChange={(e) => changeFormLongtitude(e)} />
              </div>
              <div className="flex flex-col mb-4">
                <label className="mb-2">Latitude for this parking position</label>
                <input className="border p-2 mb-4" value={form.latitude} onChange={(e) => changeFormLatitude  (e)} />              
                <button onClick={(e) => createParkingSpot(e)} type="submit" className="p-1 bg-green-500 text-white font-medium rounded-lg shadow-lg shadow-green-500/50 transition duration-200 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75">Submit</button>
              </div>
            </div>
          </div>
          </div>
        </>
      );
}