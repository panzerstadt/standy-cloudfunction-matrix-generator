const functions = require("firebase-functions");
const dayjs = require("dayjs");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const admin = require("firebase-admin");
admin.initializeApp();

exports.readDB = functions.https.onRequest(async (request, response) => {
  const firestore = admin.firestore();

  console.log("\n\nstarting!\n\n");
  let date = request.query.date || "20190713";
  date = dayjs(date).format("YY-MM-DD");

  const user = request.query.email || "tliqun@gmail.com";

  console.log("date: ", date);
  console.log("user: ", user);

  const isComplete = request.query.date && request.query.email;

  let res = [];
  await firestore
    .collection("userTimeBin")
    .doc(user)
    .collection(date)
    .get()
    .then(querySnapshot => {
      console.log("querySnapshot: ");
      return querySnapshot.forEach(doc => {
        res.push(doc.data());
        return;
      });
    })
    .catch(e => console.error(e));

  console.log("result");
  console.log(res);

  const output = {
    type: isComplete ? "live" : "dummy",
    data: res
  };

  response.send(output);
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
