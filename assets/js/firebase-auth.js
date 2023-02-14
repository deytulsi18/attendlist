//****** firebase auth ******/

let userIsSignedIn = false;
// let userEmail = ``;
let userID = ``;

firebase.initializeApp(firebaseConfig);

function toggleSignInWIthPopup() {
    if (!firebase.auth().currentUser) {
        let provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then((result) => {
            if (result.credential) {
                let token = result.credential.accessToken;
                // console.log(`Token: ${token}`);
                console.log(`Auth Token Found`);
            } else {
                console.log(`Auth Token Not Found`);
            }
            let user = result.user;
        }).catch(function (error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            let email = error.email;
            let credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
            } else {
                console.error(error);
            }
        });
    } else {
        firebase.auth().signOut();
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}

const initAuth = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const userDetailsString =
                `{"displayName": "${user.displayName}",
                "email": "${user.email}",
                "emailVerified": "${user.emailVerified}",
                "isAnonymous": "${user.isAnonymous}",
                "uid": "${user.uid}"}`
            document.getElementById('quickstart-sign-in').textContent = 'Sign Out';
            document.getElementById('quickstart-sign-in').style.backgroundColor = 'hsl(0, 100%, 30%)'

            const username = (user.email).replace('@gmail.com', '');

            // const dicebearAvatarUrl = `https://avatars.dicebear.com/api/gridy/${username}.svg`;
            // console.log(dicebearAvatarUrl)

            document.querySelector("#user-avatar").src = `${user.photoURL}`;
            // document.querySelector("#user-avatar").src = `${dicebearAvatarUrl}`;

            document.querySelector("#user-name").innerText = `${user.displayName}`;
            document.querySelector("#user-email").innerText = `${user.email}`;

            userIsSignedIn = true;
            // userEmail = `${user.email}`;
            userID = `${user.uid}`;
        } else {
            createAttendanceLinkIDBtn.style.pointerEvents = 'auto';
            // console.log("Not Signed In");
            document.getElementById('quickstart-sign-in').textContent = 'Sign In';
            document.getElementById('quickstart-sign-in').style.backgroundColor = 'hsl(100, 100%, 30%)';
            document.querySelector("#user-name").innerText = `Not Signed In!`;
            document.querySelector("#user-email").innerText = `No email found!`;
            document.querySelector("#user-avatar").src = `https://avatars.dicebear.com/api/gridy/random.svg`

            userIsSignedIn = false;
            // userEmail = ``;
        }
        document.getElementById('quickstart-sign-in').disabled = false;
    });

    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignInWIthPopup, false);
}

// window.onload = () => {
//     initAuth();
// };