const getUserData = async (firestoreInstance, user, date) => {
  return await firestoreInstance
    .collection("userTimeBin")
    .doc(user)
    .collection(date)
    .get()
    .then(querySnapshot => {
      console.log("size: ", querySnapshot.size);
      if (querySnapshot.docs.length === 0) {
        console.error("no querysnapshots found!");
        console.log(
          "if this function is run locally for development, it will not return anything from the database (because the db is mocked"
        );
        return [];
      }

      return querySnapshot.docs.map(doc => {
        return doc.data();
      });
    })
    .catch(e => console.error(e));
};

const putUserData = (firestoreInstance, user) => {};

module.exports = {
  getUserData,
  putUserData
};
