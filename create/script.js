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
const downloadOptionsDiv = document.querySelector(".download-options-div");
const linkIdInput = document.querySelector("#link-id-input-box");

downloadAttendanceBtn.addEventListener("click", () => {
    try {
        if ((userIsSignedIn && userEmail != '')) {
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
    if (userIsSignedIn && userEmail != '') {
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

        await createLinkID(generatedId, userEmail);

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

        const response = await fetchIndex('link_ids_by_email', 'abc123');

        if (response === undefined) {
            throw 'This LINK ID does not exist!'
        } else if (response.email == userEmail) {

            let res = await fetchAttendanceUnderLinkID(linkId);

            downloadTXT(res, `attendance-${linkId}.txt`, 'text/plain');
            // downloadOptionsDiv.style.display = "flex";
            downloadTXTBtn.style.display = "flex";
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

// Download the attendance in a txt file
let downloadTXT = (jsonData, fileName, contentType) => {
    let content = "";

    content += `\n[Roll No], [Name], [timestamp]`;

    jsonData.forEach(elem => {
        content += `\n${elem.data.roll_no}, ${elem.data.name}, ${elem.data.timestamp}`;
    });

    let file = new Blob([content], { type: contentType });
    downloadTXTBtn.href = URL.createObjectURL(file);
    downloadTXTBtn.download = fileName;
}