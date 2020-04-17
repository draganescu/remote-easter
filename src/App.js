import React from "react";
import "./styles.css";

import { Link } from "./components/link";
import { Carton } from "./components/carton";
import { Greet } from "./components/greet";
import { Smash } from "./components/smash";
import { Egg } from "./components/egg";

import { db, auth } from "./firebase";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function App() {
  const [rooms, setRooms] = React.useState([]);
  const [currentRoomID, setCurrentRoomID] = React.useState(
    window.location.hash.replace("#", "")
  );
  const [currentRoomData, setCurrentRoomData] = React.useState({});
  const [userID, setUserID] = React.useState(null);
  const [isCreator, setIsCreator] = React.useState(null);
  const [color, setColor] = React.useState(null);
  const [fightStatus, setFightStatus] = React.useState(null);
  const [crack, setCrack] = React.useState(false);

  function getAllRooms() {
    db.collection("rooms").onSnapshot(snapshot => {
      const allRooms = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      setRooms(allRooms);
    });
  }
  function autenticate() {
    console.log("autenticate");
    auth
      .signInAnonymously()
      .catch(function(error) {
        console.log("Error authenticating", error);
      })
      .then(user => {
        setUserID(user.user.uid);
        console.log(user.user.uid);
      });
  }

  function setDBwithOponent() {
    db.collection("rooms")
      .doc(currentRoomID)
      .set(
        {
          oponent: userID
        },
        { merge: true }
      );
  }

  function setCreatorOrGuestForRoom() {
    console.log("setUserOrGuestForRoom");
    if (userID) {
      if (currentRoomID) {
        const roomDb = db.collection("rooms").doc(currentRoomID);
        roomDb.onSnapshot(snapshot => {
          console.log("Changed");
          setCurrentRoomData(snapshot.data());
        });
        roomDb.get().then(room => {
          setCurrentRoomData(room.data());
          if (room.data().creator === userID) {
            console.log("setUserOrGuest: I am the creator");
            setIsCreator(true);
          } else {
            console.log("setUserOrGuest: I am a guest");
            setIsCreator(false);
            setDBwithOponent();
          }
        });
      } else {
        console.log("setUserOrGuest: No room created yet");
        setIsCreator(true);
      }
    } else {
      console.log("Hold your horses");
    }
  }

  React.useEffect(setCreatorOrGuestForRoom, [userID, currentRoomID]);

  React.useEffect(autenticate, []);

  React.useEffect(getAllRooms, []);

  async function addRoom() {
    const docRef = await db.collection("rooms").add({
      creator: userID
    });
    console.log("Document written with ID: ", docRef.id);
    window.location.hash = `#${docRef.id}`;
    setCurrentRoomID(docRef.id);
    return docRef.id;
  }

  function onColorChange(option) {
    console.log(option);
    option = option || option.target.value;
    console.log("Option", option);
    const key = isCreator ? "creator_color" : "guest_color";
    db.collection("rooms")
      .doc(currentRoomID)
      .set(
        {
          [key]: option
        },
        { merge: true }
      );
    setColor(option);
  }

  async function onFightChanged(option) {
    option = option || option.target.value;
    console.log("Option", option);
    const keyFightStatus = isCreator ? "creator_fighting" : "guest_fighting";
    const keyScoreNumber = isCreator ? "creator_score" : "guest_score";
    await db
      .collection("rooms")
      .doc(currentRoomID)
      .set(
        {
          [keyFightStatus]: option,
          [keyScoreNumber]: randomIntFromInterval(0, 10000)
        },
        { merge: true }
      );
    setFightStatus(option);
  }

  const mySelectedColor = isCreator
    ? currentRoomData.creator_color
    : currentRoomData.guest_color;

  const myOponentColor = isCreator
    ? currentRoomData.guest_color
    : currentRoomData.creator_color;

  const myFightStatus = isCreator
    ? currentRoomData.creator_fighting
    : currentRoomData.guest_fighting;

  const myOponentFightStatus = isCreator
    ? currentRoomData.guest_fighting
    : currentRoomData.creator_fighting;

  const myScore = isCreator
    ? currentRoomData.creator_score
    : currentRoomData.guest_score;

  const myOponentScore = isCreator
    ? currentRoomData.guest_score
    : currentRoomData.creator_score;

  console.log({ myscore: myScore, opponent: myOponentScore });

  return (
    <div className="App">
      <div className="stage">
        {!currentRoomID && <Link onClick={addRoom} />}
        {currentRoomID && !color && (
          <Carton
            onEggSelect={color => {
              onColorChange(color);
            }}
          />
        )}
        {color && (!myOponentScore || !myScore) && (
          <Greet onClick={onFightChanged} isCreator={isCreator} />
        )}
        {myFightStatus && myOponentFightStatus && (
          <Smash showCrack={setCrack}>
            <Egg
              color={myOponentColor}
              crack={crack}
              isCracked={myScore > myOponentScore}
            />
            <Egg
              color={mySelectedColor}
              crack={crack}
              isCracked={myScore < myOponentScore}
            />
          </Smash>
        )}
      </div>
    </div>
  );
}
