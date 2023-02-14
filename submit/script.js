const enterLinkIDBtn = document.querySelector("#enter-link-id");
const submitAttendanceDiv = document.querySelector(".submit-attendance-btn-div");
const submitAttendanceBtn = document.querySelector("#submit-attendance-btn");
const linkIdInput = document.querySelector("#link-id-input");
const nameInput = document.querySelector("#name-input");
const rollNoInput = document.querySelector("#roll-no-input");

let userLatitude = 0;
let userLongitude = 0;
let userLocationDataFetched = false;

// If a LINK ID is passed thought page link query parameter it is placed in LINK ID input

window.onload = (event) => {
    const linkIdInQueryParams = new URLSearchParams(window.location.search).get('id');

    linkIdInput.value = linkIdInQueryParams;
};

// enter link Id to submit attendance
enterLinkIDBtn.addEventListener("click", () => {
    try {
        let linkId = linkIdInput.value;
        if (linkId == "") {
            throw 'Enter LINK ID';
        }

        getLocation();

        submitAttendanceDiv.style.display = "flex";
        enterLinkIDBtn.style.display = "none";

    } catch (err) {
        console.log(err);
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Something went wrong!',
            text: `${err}`
        });
    }
});

submitAttendanceBtn.addEventListener("click", () => {
    submitAttendanceBtn.style.pointerEvents = "none";

    if (userLocationDataFetched) {
        submitAttendance();
    } else {
        setTimeout(() => {
            submitAttendance();
        }, 500);
    }
});

let submitAttendance = async () => {
    try {
        let linkId = linkIdInput.value;
        let name = nameInput.value;
        let rollNo = rollNoInput.value;

        try {
            if (linkId == "") {
                throw 'Enter LINK ID';
            }
            else if (name == "" || rollNo == "") {
                throw 'Enter all fields';
            }
        } catch (err) {
            throw err;
        }

        const timestamp = getTimeStamp();

        const deviceId = await getDeviceId();

        const userData = {
            linkId: linkId,
            name: name,
            rollNo: rollNo,
            timestamp: timestamp.toString(),
            latitude: userLatitude,
            longitude: userLongitude,
            deviceId: deviceId
        };

        const requestedIndex = await fetchIndex('link_ids_by_link_id', linkId);

        if (requestedIndex.name == 'NotFound') {
            throw `LINK ID does not exist!`;
        }

        const requestedIndexForDeviceId = await fetchIndex(`${linkId}_by_device_id`, deviceId);

        if (requestedIndexForDeviceId.name != 'NotFound') {
            throw `You have already responded!`;
        }

        const hostLatitude = requestedIndex.latitude;
        const hostLongitude = requestedIndex.longitude;

        const distanceBetweenUserAndHostInKM = distance(userLatitude, userLongitude, hostLatitude, hostLongitude, "K");
        const distanceBetweenUserAndHostInM = Math.round((distanceBetweenUserAndHostInKM * 1000) * 1000) / 1000;

        if (distanceBetweenUserAndHostInM <= 25) {
            await addAttendanceUnderLinkID(linkId, userData);
        }
        else {
            throw "You are not in the class!";
        }


        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Attendance Submitted!',
                text: 'Your attendance has been recorded!',
                confirmButtonAriaLabel: 'Thumbs up, OK!',
                confirmButtonColor: '#3bb300'
            }).then(() => {
                window.location.replace("/");
            });
        }, 350);

    } catch (err) {
        console.log(err);
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Something went wrong!',
            text: `${err}`
        }).then(() => {
            submitAttendanceBtn.style.pointerEvents = "auto";
        })
    }
}

// function to get timestamp

let getTimeStamp = () => {
    let dt = new Date();
    let currentDate = dt.toLocaleDateString();
    let currentTime = dt.toLocaleTimeString();

    let res = `${currentDate} ${currentTime}`;
    res = res.replace(' ', ' ');

    return res;
}

