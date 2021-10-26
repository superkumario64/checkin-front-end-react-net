import React, { useState, useEffect } from "react"
import Checkin from "./Checkin";
import View from "./View";

const Login = () => {
    const [locations, setLocations] = useState([]);
  const [checkinTypes, setCheckinTypes] = useState([]);
  const [inputPhrase, setInputPhrase] = useState("");
  const [phrases, setPhrases] = useState([]);
  const [phraseMatch, setPhraseMatch] = useState(false);
  const [checkinLocation, setCheckinLocation] = useState("Salinas");
  const [checkinType, setCheckinType] = useState("Member using space");
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL_BASE + '/check/settings.php')
      .then((res) => {
        return res.text()
      })
      .then((text) => {
        console.log("text", text);
        const objSettings = JSON.parse(text);
        const fLocations = [];
        const fTypes = [];
        const fPhrases = [];
        objSettings.records.map(setting => {
          if (setting.fields["Setting Type"] === 'Location') {
            fLocations.push(setting);
          }
          if (setting.fields["Setting Type"] === 'User Type') {
            fTypes.push(setting);
          }
          if (setting.fields["Setting Type"] === 'Front Desk Phrase') {
            fPhrases.push(setting);
          }
        });
        setLocations(fLocations);
        setCheckinTypes(fTypes);
        setPhrases(fPhrases);
      })
      .catch((e) => {
        setFetchError(true);
      });
  }, []);

  const handleSubmit = (e) => {
    let correctPhrase = false;
    phrases.map(phrase => {
      if (inputPhrase === phrase.fields["Value"]) {
        correctPhrase = true;
      }
    });
    setPhraseMatch(correctPhrase);
    e.preventDefault();
  }

  return (
    <div>
      {locations.length > 0 && !phraseMatch && (

        <View title="Login to start Checkin/out">
          <div>
            <form onSubmit={handleSubmit}>
              <label for="location-select"> Location</label>
              <select
                className="w-full border bg-white rounded px-3 py-2 outline-none"
                id="location-select"
                onChange={(e) => {
                  setCheckinLocation(e.target.value);
                }}
                required
              >
                <option className="py-1"></option>
                {locations.map(type => (

                  <option className="py-1">{type.fields["Value"]}</option>
                ))}
              </select>
              <br />
              <br />
              <label for="type-select"> Type</label>
              <select
                className="w-full border bg-white rounded px-3 py-2 outline-none"
                id="type-select"
                onChange={(e) => {
                  setCheckinType(e.target.value);
                }}
                required
              >
                <option className="py-1"></option>
                {checkinTypes.map(type => (

                  <option className="py-1">{type.fields["Value"]}</option>
                ))}
              </select>
              <br />
              <br />
              <label for="passphrase-input">Passphrase</label>
              <input
                id="passphrase-input"
                type='text'
                placeholder="Enter your input here"
                className="w-full mt-2 px-3 py-2 border rounded focus:outline-none focus:border-green-500"
                onChange={(e) => {
                  setInputPhrase(e.target.value);
                }}
                required
              />
              <br />
              <br />
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline" type="submit">
                Sign In
              </button>
            </form>
          </div>

        </View>
      )}
      {fetchError && (
        <View title="Check your internet connection">
          <p>You may be connected to the wrong wifi network.</p>
        </View>
      )}
      {phraseMatch && (
        <Checkin
          checkinType={checkinType}
          checkinLocation={checkinLocation}
        />
      )}
    </div>
  )
};

export default Login;
