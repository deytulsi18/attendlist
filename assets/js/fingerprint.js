
const getDeviceId = async () => {
    const deviceId = await import('https://openfpcdn.io/fingerprintjs/v3')
        .then(FingerprintJS => FingerprintJS.load())

        .then(fp => fp.get())
        .then(result => {
            const visitorId = result.visitorId;
            // console.log(visitorId)
            return visitorId;
        })

    return deviceId;
};