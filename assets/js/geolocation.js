
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

const errorFunc = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

let getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locatePosition, errorFunc,options);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

let locatePosition = (position) => {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    userLatitude = latitude;
    userLongitude = longitude;
    userLocationDataFetched = true;

    // const lat = 22.510475;
    // const lon = 88.4128996;

    // const distance_in_km = distance(position.coords.latitude, position.coords.longitude, lat, lon, 'K');
    // // distance_in_km = Math.round(distance_in_km * 1000) / 1000;

    // const distance_in_m = Math.round((distance_in_km * 1000) * 1000) / 1000;

    // console.log(distance_in_m);
}

let distance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}

// getLocation();