/******  Copy to clip board *****/

const copyToClipboard = () => {

    let dummy = document.createElement('input');
    let copyText = document.querySelector('#attendance-link').text;

    document.body.appendChild(dummy);
    dummy.value = copyText;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    let linkCopied = document.querySelector('.copy-link');
    let copyLinkBtn = document.querySelector('#copy-icon');

    linkCopied.style.backgroundColor = 'hsl(60, 100%, 45%)';
    copyLinkBtn.style.color = '#000';

    setTimeout(() => {
        linkCopied.style.backgroundColor = '#333';
        copyLinkBtn.style.color = '#fff';
    }, 1500);
}

/********************************/

const downloadAttendanceBtn = document.querySelector("#download-attendance");
const downloadTXTBtn = document.querySelector("#download-txt");
const downloadPDFBtn = document.querySelector("#download-pdf");
const deleteBtn = document.querySelector("#delete-btn");
const downloadOptionsDiv = document.querySelector(".download-options-div");
const deleteOptionsDiv = document.querySelector(".delete-options-div");
const downloadDivNoteInfo = document.querySelector(".download-div-note-info");
const linkIdInput = document.querySelector("#link-id-input-box");

downloadAttendanceBtn.addEventListener("click", () => {
    try {
        if ((userIsSignedIn && userID != '')) {
            let linkId = linkIdInput.value;
            if (linkId == "") {
                throw 'Enter LINK ID';
            }
            downloadAttendanceData(linkId);
        } else {
            Swal.fire({
                icon: 'info',
                confirmButtonColor: '#1f74b6',
                confirmButtonText: 'OK',
                title: 'You are not Signed In!',
                text: 'You need to sign in to use this page.'
            });
        }
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

const createAttendanceLinkIDBtn = document.querySelector("#create-link-id")

createAttendanceLinkIDBtn.addEventListener("click", () => {
    if (userIsSignedIn && userID != '') {
        createAttendanceLinkIDBtn.style.pointerEvents = "none";

        generateLinkID();
    } else {
        Swal.fire({
            icon: 'info',
            confirmButtonColor: '#1f74b6',
            confirmButtonText: 'OK',
            title: 'You are not Signed In!',
            text: 'You need to sign in to use this page.'
        });
    }
});

let generateLinkID = async () => {
    try {

        // let randNumb = Math.floor(100000 + Math.random() * 900000);

        alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
        nanoid = customAlphabet(alphabet, 6);

        const number = nanoid();

        let generatedId = number.toString();

        await createLinkID(generatedId);
        await addNewLinkIDWithUid(generatedId, userID, getTimeStamp());

        let linkId = generatedId;
        let attendanceLink = document.querySelector("#attendance-link");
        let attendanceCode = document.querySelector("#attendance-code");

        let submitAttendancePageUrl = window.location + `submit/index.html?id=${linkId}`;
        submitAttendancePageUrl = String(submitAttendancePageUrl).replace('#', '');
        submitAttendancePageUrl = String(submitAttendancePageUrl).replace('create/', '');

        attendanceLink.innerText = submitAttendancePageUrl;
        attendanceLink.href = submitAttendancePageUrl;
        attendanceCode.innerText = linkId;

        let linkBox = document.querySelector('.display-link-div');
        linkBox.style.backgroundColor = `hsl(200, 100%, 40%)`;

        let linkIdInputBox = document.querySelector("#link-id-input-box");

        linkIdInputBox.value = generatedId;

        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Link Creation Successful!',
                text: 'Your attendance link and code is ready!',
                confirmButtonAriaLabel: 'Thumbs up, OK!',
                confirmButtonColor: '#3bb300'
            })
        }, 350);
    } catch (err) {
        console.log(err);
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#ffa333',
            confirmButtonText: 'OK',
            title: 'Something went wrong!'
        });
    }
};

let downloadAttendanceData = async (linkId) => {
    try {

        if (linkId == 'link_ids') {
            throw 'This LINK ID does not exist!';
        }

        const response = await fetchIndex('link_ids_by_link_id', linkId);

        if (response === undefined) {
            throw 'This LINK ID does not exist!'
        } else if (response.uid == userID) {

            let res = await fetchAttendanceUnderLinkID(linkId);

            prepareDownload(res, linkId);
            downloadOptionsDiv.style.display = "flex";
            deleteOptionsDiv.style.display = "flex";
            downloadDivNoteInfo.style.display = "flex";
            downloadAttendanceBtn.style.pointerEvents = "none";
            downloadAttendanceBtn.style.display = "none";
        }
        else {
            throw "This LINK ID does not belong to you!"
        }
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
};

// Download the attendance in a txt file or a pdf file
let prepareDownload = (jsonData, linkId) => {

    // txt file generation
    const fileName = `attendance-${linkId}.txt`;

    let content = "";

    content += `Download Timestamp: ${getTimeStamp()}\n\n[Roll No], [Name], [timestamp]\n`;

    jsonData.forEach(elem => {
        content += `\n${elem.data.roll_no}, ${elem.data.name}, ${elem.data.timestamp}`;
    });

    let file = new Blob([content], { type: 'text/plain' });
    downloadTXTBtn.href = URL.createObjectURL(file);
    downloadTXTBtn.download = fileName;
    
    // pdf file generation
    downloadPDFBtn.addEventListener("click", () => {
        const doc = new jsPDF()
        doc.text(`${content}`, 10, 10);
        doc.save(`attendance-${linkId}.pdf`);
    })
}

//delete button for LINK ID deletion
deleteOptionsDiv.addEventListener("click", () => {
    try {
        if ((userIsSignedIn && userID != '')) {
            let linkId = linkIdInput.value;
            if (linkId == "") {
                throw 'Enter LINK ID';
            }
            deleteAttendanceData(linkId);
        } else {
            Swal.fire({
                icon: 'info',
                confirmButtonColor: '#1f74b6',
                confirmButtonText: 'OK',
                title: 'You are not Signed In!',
                text: 'You need to sign in to use this page.'
            });
        }
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

let deleteAttendanceData = async (linkId) => {
    try {

        if (linkId == 'link_ids') {
            throw 'This LINK ID does not exist!';
        }

        const response = await fetchIndex('link_ids_by_link_id', linkId);

        if (response === undefined) {
            throw 'This LINK ID does not exist!'
        } else if (response.uid == userID) {

            await deleteLinkID(linkId);

            deleteBtn.style.pointerEvents = "none";
            deleteBtn.style.display = "none";

            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Attendance Data Deleted!',
                    text: 'The attendance has been deleted!',
                    confirmButtonAriaLabel: 'Thumbs up, OK!',
                    confirmButtonColor: '#3bb300'
                }).then(() => {
                    window.location.replace("/");
                });
            }, 350);
        }
        else {
            throw "This LINK ID does not belong to you!"
        }
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
};

// function to get timestamp

let getTimeStamp = () => {
    let dt = new Date();
    let currentDate = dt.toLocaleDateString();
    let currentTime = dt.toLocaleTimeString();

    let res = `${currentDate} ${currentTime}`;
    res = res.replace(' ', ' ');

    return res;
}