import dynamic from "next/dynamic";
const Map = dynamic(() => import('./Map'), {
    //disable server side rendering for the map so it won't throw window errors
    ssr: false
})

export default Map;