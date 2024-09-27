import Image from "next/image";
import Map from "@/components/Map";
import Header from "@/components/Header/Header";
import { useSession } from "next-auth/react";
import prisma from "@/utils/prisma.client";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession()
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
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header session={session} />
        {<div className="flex-grow">
          <Map session={session}/>
        </div>}
      </div>
    </>
  );
}
