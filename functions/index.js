// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// https://github.com/firebase/firebase-tools/issues/1451
const functions = require("firebase-functions");
const dayjs = require("dayjs");
require("dayjs/locale/ja");
dayjs.locale("ja");

const generateMatrix = require("./generateMatrix");
const generateUserTime = require("./generateTime");
const getUserData = require("./firebaseFunctions").getUserData;
const putUserData = require("./firebaseFunctions").putUserData;

// firebase init
const admin = require("firebase-admin");
admin.initializeApp({
  apiKey: "AIzaSyBAy86coDxFbO-hgNCOAHXo9qkgjDzX6y4",
  authDomain: "standy.firebaseapp.com",
  databaseURL: "https://standy.firebaseio.com",
  projectId: "standy",
  storageBucket: "standy.appspot.com",
  messagingSenderId: "510620536324",
  appId: "1:510620536324:web:5d90b5ee12a689d5"
});
// firestore init
const firestore = admin.firestore();

const buildMatrix = async (user, date) => {
  // get data from firebase
  const userData = await getUserData(firestore, user, date);

  return {
    date: date,
    time: generateUserTime(userData),
    matrix: generateMatrix(userData)
  };
};

// returns the userMatrix as a JSON
exports.userMatrix = functions.https.onRequest(async (request, response) => {
  // clean input
  const date = dayjs(request.query.date || "20190713").format("YYYY-MM-DD");
  const user = request.query.email || "tliqun@gmail.com";
  const isComplete = request.query.date && request.query.email;

  // build output
  const output = {
    type: isComplete ? "live query used" : "dummy query used",
    query: {
      date: date,
      user: user
    },
    data: await buildMatrix(user, date)
  };

  // send
  response.send(output);
});

// updates the database with userMatrix
exports.updateUserMatrixOnDatabase = functions.https.onRequest(
  async (request, response) => {
    // mark time
    const timestamp = dayjs();

    // clean input
    const date = dayjs(request.query.date || "20190713").format("YYYY-MM-DD");
    const user = request.query.email || "tliqun@gmail.com";
    const isComplete = request.query.date && request.query.email;

    // DUMMY slow async update
    const slowUpdate = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2500);
      });
    };
    await slowUpdate();

    // get data from firebase
    const userData = await getUserData(firestore, user, date);
    // generate matrix from day
    const userMatrix = generateMatrix(userData);
    //

    console.log("userData: ");
    console.log(JSON.stringify(userData));

    // build output
    const output = {
      hour: "0100",
      userMatrix: userMatrix
    };

    const now = (dayjs() - timestamp) / 1000;
    response.send({
      message: `done! time taken: ${now} seconds`,
      data: output
    });
  }
);
