
//****** fauna db ******/ 

const faunadb = window.faunadb
const q = faunadb.query

const client = new faunadb.Client({
    secret: env.secret,
    domain: env.domain,
    scheme: env.scheme,
});

// Create a new LINK ID (Create a new Collection)
const createLinkID = async (link_id) => {
    await client.query(
        q.If(
            q.Exists(q.Collection(`${link_id}`)),
            null,
            q.CreateCollection({ name: `${link_id}` })
        )
    )
        .catch((err) => console.log(err))

    //*** Do Something ***/
    // location.reload();
};

// Add a person's attendance under a specific LINK ID (Create a document in a Collection)
const addAttendanceUnderLinkID = async (link_id, attendance_data) => {
    // let attendance_data = JSON.parse(attendance_details);
    await client.query(
        q.Create(
            q.Collection(`${link_id}`),
            {
                data: {
                    // link_id: attendance_data.linkId,
                    name: attendance_data.name,
                    roll_no: attendance_data.rollNo,
                    timestamp: attendance_data.timestamp,
                    // latitude: attendance_data.userLatitude,
                    // longitude: attendance_data.userLongitude,
                    device_id: attendance_data.deviceId
                }
            }
        )
    )
        .catch((err) => {
            console.log(err)
            throw "Error Occured! Check The LINK ID maybe.";
        })

    //*** Do Something ***/
    // location.reload();
}

const addNewLinkIDWithUid = async (link_id, uid, timestamp, userLatitude, userLongitude) => {
    await client.query(
        q.Create(
            q.Collection(`link_ids`),
            {
                data: {
                    link_id: link_id,
                    uid: uid,
                    timestamp: timestamp,
                    latitude: userLatitude,
                    longitude: userLongitude
                }
            }
        )
    )
        .catch((err) => {
            console.log(err)
        })

    //*** Do Something ***/
    // location.reload();
}

// Delete an existing LINK ID (Delete an existing Collection)

const deleteLinkID = async (link_id) => {
    await client.query(
        q.If(
            q.Exists(q.Collection(`${link_id}`)),
            q.Delete(q.Collection(`${link_id}`)),
            null
        )
    )
        .catch((err) => console.log(err))

    //*** Do Something ***/
    // location.reload();
};

// Fetch all the attendance present under a specific LINK ID (Read all the documents in a specific Collection)
const fetchAttendanceUnderLinkID = async (link_id) => {
    if (link_id == 'link_ids') {
        throw 'This LINK ID is not available!';
    }
    let attendancesUnderLinkID = await client.query(
        q.Map(
            q.Paginate(q.Documents(q.Collection(`${link_id}`)), { size: 250 }),
            q.Lambda('ref', q.Get(q.Var('ref')))
        )
    )
        .then((res) => res.data)
        .catch((err) => {
            console.log(err)
            throw "Error Occured! Check The LINK ID maybe.";
        })

    //*** Do Something ***/
    // console.log(attendancesUnderLinkID);
    return attendancesUnderLinkID;
}


const createIndex = async (indexName, indexSourceCollection, indexSearchParam) => {
    await client.query(
        q.CreateIndex(
            {
                name: indexName,
                source: q.Collection(indexSourceCollection),
                terms: [
                    { field: ["data", indexSearchParam] },
                ],
            },
        )
    )
        .catch((err) => console.error(err))
}

// get value from an index
const fetchIndex = async (indexName, indexSearchParam) => {
    let res = await client.query(
        q.Get(q.Match(
            q.Index(indexName),
            indexSearchParam
        ))
    )
        .then((ret) => ret.data)
        .catch((err) => {
            console.log(err)
            return err;
        })

    return res;
};

// Delete an existing LINK ID (Delete an existing Document in a Collection)

const deleteLinkIDUserDoc = async (link_id) => {
    let res = await client.query(
        q.Get(q.Match(
            q.Index('link_ids_by_link_id'),
            link_id
        ))
    )
        .then((ret) => ret)
        .catch((err) => console.log(err))
    console.log(res)

    const refId = res.ref.id;

    client.query(
        q.Delete(q.Ref(q.Collection('link_ids'), refId))
    )
        .catch((err) => console.error(err))
};