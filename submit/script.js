const enterLinkIDBtn = document.querySelector("#enter-link-id");
const submitAttendanceDiv = document.querySelector(".submit-attendance-btn-div");
const submitAttendanceBtn = document.querySelector("#submit-attendance-btn");
const linkIdInput = document.querySelector("#link-id-input");
const nameInput = document.querySelector("#name-input");
const rollNoInput = document.querySelector("#roll-no-input");

// If a LINK ID is passed thought page link query parameter it is placed in LINK ID input

const linkIdInQueryParams = new URLSearchParams(window.location.search).get('id');

linkIdInput.value = linkIdInQueryParams;

//
enterLinkIDBtn.addEventListener("click", () => {
    try {
        let linkId = linkIdInput.value;
        if (linkId == "") {
            throw 'Enter LINK ID';
        }
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
    submitAttendance();
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

        let timestamp = getTimeStamp();


        let userData = {
            linkId: linkId,
            name: name,
            rollNo: rollNo,
            timestamp: timestamp.toString()
        };

        await addAttendanceUnderLinkID(linkId, userData);

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

