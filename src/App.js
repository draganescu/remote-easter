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
  const [currentRoomID, setCurrentRoomID] = React.useState(
    window.location.hash.replace("#", "")
  );
  const [currentRoomData, setCurrentRoomData] = React.useState({});
  const [userID, setUserID] = React.useState(null);
  const [isCreator, setIsCreator] = React.useState(null);
  const [showCrack, setShowCrack] = React.useState(false);
  const isNativeShareEnabled = navigator.share ? true : false;

  function autenticate() {
    console.log("autenticate");
    auth
      .signInAnonymously()
      .catch(function (error) {
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
          const roomData = room.data();
          setCurrentRoomData(room.data());
          if (roomData.creator === userID) {
            console.log("setUserOrGuest: I am the creator");
            setIsCreator(true);
          } else {
            console.log("setUserOrGuest: I am a guest");
            setIsCreator(false);
            if (roomData.oponent === 'undefined') {
              setDBwithOponent();
            }
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
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        window.location.hash = `#${docRef.id}`;
        setCurrentRoomID(docRef.id);
      });
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
                    </div>

                    <div className="middleText">
                      <p>
                        Vrei sa iti vizitezi neamurile si prietenii ca sa
                        ciocniti un ou si nu poti din cauza carantinei?
                      </p>
                      <p>Paste Fericit! Se rezolva :)</p>
                      <p>
                        Aici poti ciocni pe net un ou cu fiecare persoana draga,
                        chiar daca aceasta s-a distantat social de tine.
                      </p>
                      <p>Maioneza o aduceti voi!</p>
                      <p>
                        1. Copiaza link-ul de mai jos <br />
                        2. Trimite-l unui prieten <br />
                        3. Apoi revino aici.
                      </p>
                    </div>
                    <div className="creatorWelcome__action">
                      <input type="text" defautvalue={window.location.href} />
                      {isNativeShareEnabled ? (
                        <button onClick={() => {
                          navigator.share({
                            title: "Hai sa spargem un ou virtual",
                            text: "Aici poti ciocni pe net un ou cu mine",
                            url: window.location.href
                          })
                            .then(() => {
                              console.log("Multumim de share");
                              onCopyAndNext();
                            })
                            .catch(err => {
                              console.log(`N-am putut sa facem share`, err.message);
                            });
                        }}>
                          Apasa aici sa trimiti link-ul
                        </button>
                      ) : (
                          <clipboard-copy
                            class={"clipbutton"}
                            value={window.location.href}
                            onClick={onCopyAndNext}
                          >
                            Copiaza link si mergi mai departe ->
                          </clipboard-copy>
                        )}

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

                      {myOponentColor && (
                        <p>
                          {
                            "Prietenul tau a ales culaorea. Alege si tu o culoare apasand pe unul din oualele de mai jos"
                          }
                        </p>
                      )}
                      {!myOponentColor && (
                        <>
                          <p>
                            {
                              "Ai copiat linkul, bravo! Trimite-l persoanei dragi si revino!"
                            }
                          </p>
                          <p>
                            {
                              "Daca l-ai trimis deja, alege-ti culoarea preferata de mai jos. Odata ce ati ales culoarea amadoi veti trece la urmatorul pas."
                            }
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                      <>
                        <div className="headerText">
                          <p>Paste Fericit!</p>
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
                            veti trece la urmatorul pas!.
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
                      <>
                        <p>Perfect, v-ati ales culorile!</p>
                        <p>
                          Traditia spune ca inainte de a ciocni ouale, trebuie
                          sa se rosteasca “Hristos a inviat” si “Adevarat a
                          inviat”.
                        </p>
                        <p>Pe net nu rostim, ci apasam pe buton :)</p>
                      </>
                    ) : (
                        <>
                          <p>
                            <span aria-label="Iepuras" role="img">
                              🤔💭
                          </span>
                          </p>
                          <p>
                            Urarea ta s-a trimis! Asteptam sa raspunda la urare
                            si apoi "Cioc!"
                        </p>
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
                  {showCrack && <div className="headerText">
                    {myScore > myOponentScore ? (
                      <>
                        <h1>
                          Felicitari, ai oul mai puternic! &nbsp;
                          <span aria-label="Iepuras" role="img">
                            👌
                          </span>
                        </h1>
                        <p>Pacat ca nu poti sa il pastrezi pana la anu' :)</p>
                        <p>
                          Dar in schimb poti sa te joci de cate ori vrei, ouale
                          pe net nu se termina niciodata!
                        </p>
                      </>
                    ) : (
                        <>
                          <h1>
                            Oul tau s-a spart &nbsp;
                          <span aria-label="Iepuras" role="img">
                              🤦🏻‍♀️
                          </span>
                          </h1>
                          <p>Pacat ca nu poti sa il mananci macar :)</p>
                          <p>
                            Dar in schimb poti sa te joci de cate ori vrei, ouale
                            pe net nu se termina niciodata!
                        </p>
                        </>
                      )}
                  </div>}
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
                    {showCrack && <button
                      onClick={() => {
                        window.location.hash = "";
                        window.location.reload();
                      }}
                    >
                      Incepe un joc nou
                    </button>}
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
    </>
  );
}
