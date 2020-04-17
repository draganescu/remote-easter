import React from "react";
import "./styles.scss";
import "@github/clipboard-copy-element";
import { db, auth } from "./firebase";

import Carton from "./components/Carton/Carton";
import Egg from "./components/Egg/Egg";
import Smash from "./components/Smash/Smash";
import { Footer } from "./components/Footer";

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
  const [showCrack, setShowCrack] = React.useState(false);

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
        addRoom();
      }
    } else {
      console.log("Hold your horses");
    }
  }

  function addRoom() {
    console.log("addRoom");
    db.collection("rooms")
      .add({
        creator: userID
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        window.location.hash = `#${docRef.id}`;
        setCurrentRoomID(docRef.id);
      });
  }

  function changeRoom(id) {
    window.location.hash = `#${id}`;
    setCurrentRoomID(id);
  }

  function onCopyAndNext() {
    db.collection("rooms")
      .doc(currentRoomID)
      .set(
        {
          isLinkShared: true
        },
        { merge: true }
      );
  }

  function onColorChange(color) {
    console.log("onColorChange", color);
    const key = isCreator ? "creator_color" : "guest_color";
    db.collection("rooms")
      .doc(currentRoomID)
      .set(
        {
          [key]: color
        },
        { merge: true }
      );
  }

  function onFightChanged(value) {
    const keyFightStatus = isCreator ? "creator_fighting" : "guest_fighting";
    const keyScoreNumber = isCreator ? "creator_score" : "guest_score";
    db.collection("rooms")
      .doc(currentRoomID)
      .set(
        {
          [keyFightStatus]: value,
          [keyScoreNumber]: randomIntFromInterval(0, 10000)
        },
        { merge: true }
      );
  }

  React.useEffect(setCreatorOrGuestForRoom, [userID, currentRoomID]);

  React.useEffect(autenticate, []);

  React.useEffect(getAllRooms, []);

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

  const isLinkShared = currentRoomData.isLinkShared;

  function GuestCarton() {
    return (
      <Carton
        isForGuests={true}
        onEggSelect={color => {
          console.log(
            `You should not click here, but since you want to know, you clicked a ${color} egg`
          );
        }}
        activeColor={myOponentColor}
      />
    );
  }

  /*
  1: CreatorWelcome 
  2: GuestWelcome
  3: WaitingColor
  4: WaitingFight
  5: Results

  */

  const isLoaded =
    userID !== null && currentRoomID !== null && isCreator !== null;

  const renderCreatorWelcome = isCreator && !isLinkShared;

  const renderWaitingColor =
    (!isCreator || (isCreator && isLinkShared)) &&
    (myOponentColor === undefined || mySelectedColor === undefined);

  const renderWaitingFights =
    myOponentColor !== undefined &&
    mySelectedColor !== undefined &&
    (myFightStatus === undefined || myOponentFightStatus === undefined);

  const renderResults =
    myFightStatus !== undefined && myOponentFightStatus !== undefined;

  console.log({
    isLoaded,
    renderCreatorWelcome,
    renderWaitingColor,
    renderWaitingFights,
    renderResults
  });

  const colorOptions = ["red", "blue", "yellow"];
  console.log({ myFightStatus });
  return (
    <>
      <div className="app">
        <div className="app-content">
          {isLoaded ? (
            <>
              {renderCreatorWelcome && (
                <>
                  <div className="creatorWelcome">
                    <div className="headerText">
                      <h1>
                        Sparge un ou virtual cu prietenii{" "}
                        <span aria-label="Iepuras" role="img">
                          🐰
                        </span>
                      </h1>
                      <p>
                        Vrei sa iti vizitezi neamurile si prietenii ca sa
                        ciocniti un ou si nu poti din cauza carantinei?
                      </p>
                      <p>Paste Fericit!</p>
                      <p>
                        Aici poti ciocni pe net un ou cu fiecare persoana draga,
                        chiar daca aceasta s-a distantat social de tine. Sau tu
                        de ea. .. In fine.
                      </p>
                      <p>Maioneza o aduceti voi!</p>
                    </div>

                    <div className="middleText">
                      <p>
                        Copiaza link-ul de mai jos si trimite-l unui prieten.
                        Intre timp poti alege culoare oului tau.
                      </p>
                    </div>
                    <div className="creatorWelcome__action">
                      <input type="text" value={window.location.href} />
                      <clipboard-copy
                        class={"clipbutton"}
                        value={window.location.href}
                        onClick={onCopyAndNext}
                      >
                        Copiaza si alege culoarea oului
                      </clipboard-copy>
                    </div>
                  </div>
                </>
              )}
              {renderWaitingColor && (
                <>
                  <GuestCarton />
                  {isCreator ? (
                    <div className="middleText">
                      <h1>Alege-ti culoarea oului</h1>
                      <span aria-label="Ceas" role="img">
                        🕞
                      </span>
                      <p>
                        {myOponentColor
                          ? `Prietenul tau a ales culaorea. Alege si tu o culoare apasand pe unul din oualele de mai jos.`
                          : `Asteptam pe cineva! I-ai trimis linkul?
                          Intre timp alege-ti si tu culoarea preferata. Odata ce
                        ati ales culoarea amadoi veti trece la pasul 2!`}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="headerText">
                        <p>Paste Fericit</p>
                        <h1>
                          Cineva vrea sa ciocneasca un ou cu tine!
                          <span aria-label="Iepuras" role="img">
                            🐰
                          </span>
                        </h1>
                      </div>
                      <div className="middleText">
                        <p>
                          Alege-ti culoarea preferata. Odata ce ati ales amadoi
                          veti trece la pasul 2!.
                        </p>
                      </div>
                    </>
                  )}
                  <Carton
                    onEggSelect={onColorChange}
                    activeColor={mySelectedColor}
                  />
                </>
              )}

              {renderWaitingFights && (
                <>
                  <GuestCarton />
                  <div className="middleText">
                    <h1>
                      {!isCreator ? "Hristos a inviat" : "Adevarat a inviat"}
                    </h1>
                    {myFightStatus === undefined ? (
                      <p>
                        Traditia spune ca inainte de a ciocnii ouale, trebuie sa
                        se rosteasca “Hristos a inviat” si “Adevarat a inviat”
                        de catre cei doi jucatori. Aici trebuie doar sa apesi pe
                        butonul de mai jos.
                      </p>
                    ) : (
                      <>
                        <p>
                          <span aria-label="Iepuras" role="img">
                            🤔💭
                          </span>
                        </p>
                        <p>Asteptam sa raspunda la uarare si apoi "Cioc!"</p>
                      </>
                    )}
                    <button
                      className="fightButton"
                      disabled={myFightStatus}
                      onClick={() => onFightChanged(true)}
                    >
                      {isCreator ? "Hristos a inviat" : "Adevarat a inviat"}
                    </button>
                  </div>
                  <Carton
                    onEggSelect={onColorChange}
                    activeColor={mySelectedColor}
                  />
                </>
              )}

              {renderResults && (
                <>
                  <div className="headerText">
                    {myScore > myOponentScore ? (
                      <>
                        <h1>
                          Felicitari, ai castigat!
                          <span aria-label="Iepuras" role="img">
                            👌
                          </span>
                        </h1>
                      </>
                    ) : (
                      <>
                        <h1>
                          Ai pierdut
                          <span aria-label="Iepuras" role="img">
                            🤦🏻‍♀️
                          </span>
                        </h1>
                      </>
                    )}
                  </div>
                  <div className="smash-wrapper">
                    <Smash showCrack={setShowCrack}>
                      <Egg
                        color={myOponentColor}
                        crack={showCrack}
                        isCracked={myScore > myOponentScore}
                      />
                      <Egg
                        color={mySelectedColor}
                        crack={showCrack}
                        isCracked={myScore < myOponentScore}
                      />
                    </Smash>
                  </div>
                  <div className="middleText">
                    <button
                      onClick={() => {
                        window.location.hash = "";
                        window.location.reload();
                      }}
                    >
                      Incepe un joc nou
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <Footer />
      </div>

      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <></>
      <div className="stuff">
        {userID !== null && currentRoomID !== null && isCreator !== null ? (
          <div>
            <p>Userid: {userID}</p>
            <p>
              {isCreator ? <strong>Creator</strong> : <strong>Guest</strong>}
              <button onClick={onCopyAndNext}>Share</button>
              {currentRoomID === ""
                ? " on nothing."
                : ` on room: ${currentRoomID}`}
            </p>

            {currentRoomID !== "" && (
              <>
                <label htmlFor="option_color">Select color: </label>
                <select
                  id="option_color"
                  onChange={e => {
                    onColorChange(e.target.value);
                  }}
                  value={mySelectedColor}
                  name="color"
                  placeholder="Select color"
                >
                  <option>Please select something</option>
                  {colorOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {myOponentColor && mySelectedColor && (
                  <>
                    <br />
                    <br />
                    <label>
                      Fight:{" "}
                      <input
                        onChange={e => {
                          onFightChanged(e.target.value);
                        }}
                        type="checkbox"
                        name="fight"
                      />
                    </label>
                  </>
                )}
                {myOponentColor ? (
                  <>
                    <p>Oponent color: {myOponentColor}</p>
                    <p>Oponent fight status: {myOponentFightStatus}</p>
                    <p>My fight status: {myFightStatus}</p>

                    <p>Oponent score: {myOponentScore}</p>
                    <p>My score: {myScore}</p>
                  </>
                ) : (
                  <p>Waiting for oponent to select color</p>
                )}

                {myOponentScore && myScore && (
                  <h1>
                    {myOponentScore < myScore
                      ? "You are a winner 🥇"
                      : "You lost 😭"}
                  </h1>
                )}
              </>
            )}
            <br />
            <hr />
            <button onClick={addRoom}>Create new Room</button>
            <hr />
            <h3>Rooms</h3>
            <ul>
              {rooms.map(room => (
                <li
                  onClick={() => {
                    changeRoom(room.id);
                  }}
                  key={room.id}
                >
                  {room.id === currentRoomID ? (
                    <strong>{room.id} </strong>
                  ) : (
                    <span>{room.id}</span>
                  )}
                  <br /> Creator:{" "}
                  {room.creator === userID ? "You" : room.creator}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>{userID === null && isCreator !== true && <p>Loading</p>}</>
        )}
      </div>
    </>
  );
}
