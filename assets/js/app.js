
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
                    link_id: attendance_data.linkId,
                    name: attendance_data.name,
                    roll_no: attendance_data.rollNo,
                    timestamp: attendance_data.timestamp
                }
            }
        )
    )
        .catch((err) => {
            console.log(err)
            throw "log Occured! Check The LINK ID maybe.";
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
            throw "log Occured! Check The LINK ID maybe.";
        })

    //*** Do Something ***/
    // console.log(attendancesUnderLinkID);
    return attendancesUnderLinkID;
}

//
const fetchIndex = async (indexName, link_id) => {
    let res = client.query(
        q.Get(q.Match(
            q.Index(indexName),
            link_id
        ))
    )
        .then((ret) => ret.data)
        .catch((err) => console.log(err))

    return res;
};