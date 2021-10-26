import React, { useState } from "react"
import View from "./View"
import Modal from "./Modal";
if (typeof window != 'undefined') {
  var QrReader = require('react-qr-reader')
}

const Checkin = ({ checkinType, checkinLocation }) => {

  const [scanActive, setScanActive] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [userFound, setUserFound] = useState(false);

  const [checkinName, setCheckinName] = useState('');

  const [isCheckin, setIsCheckin] = useState(false);

  const [lastnameSearch, setLastnameSearch] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const handleErrorWebCam = (error) => {
    console.log(error);
  }

  const doCheckin = (id) => {
    setShowModal(true);
    fetch(process.env.REACT_APP_API_URL_BASE + `/check/checkin.php?uid=${id}&checkinType=${checkinType}&checkinLocation=${checkinLocation}`)
      .then((res) => res.text())
      .then((text) => {
        console.log("textkwa", text);
        const lookupUser = JSON.parse(text).records[0];
        console.log("lookupUser", lookupUser);
        if (typeof lookupUser.error !== 'undefined') {
          // we didn't find the user
          setUserFound(false);
          setShowModal(true);
          setCheckinName('Not Found');
          setTimeout(() => {
            setShowModal(false);
            setCheckinName('');
          }, 7000);
        } else {
          // we did find the user
          setUserFound(true);
          setShowModal(true);
          setCheckinName(lookupUser.fields.Name);
          setIsCheckin(lookupUser.fields.Checkedin);
          setTimeout(() => {
            setShowModal(false);
            setCheckinName('');
            setSearchResults([]);
          }, 3000)
        }
        console.log("lookupUser", lookupUser);
      });
  };

  const handleScanWebCam = (result) => {
    if (result) {
      //check airtable for user info
      doCheckin(result);
    }
  }

  const handleSubmit = (e) => {
    if (lastnameSearch.length < 3) {
      alert('Please enter at least 3 characters');
    }
    setLastnameSearch('');
    fetch(process.env.REACT_APP_API_URL_BASE + '/check/search.php?term=' + lastnameSearch)
      .then((res) => res.text())
      .then(text => {
        const searchResults = JSON.parse(text);
        console.log("searchResults.records", searchResults.records);
        setSearchResults(searchResults.records);
      })
    e.preventDefault();
  }

  const handlePinCheckin = (e, id) => {
    doCheckin(id);
    e.preventDefault();
  }

  const handleEmail = (e, id) => {
    fetch(process.env.REACT_APP_API_URL_BASE + '/check/email.php?id=' + id)
      .then((res) => res.text())
      .then(text => {
        const emailResults = JSON.parse(text);
        if (typeof emailResults.records !== 'undefined' && emailResults.records.length) {
          alert("Email Sent");
        } else {
          alert("Something went wrong");
        }
      })
    e.preventDefault();
  }

  return (
    <View title="Digital Nest Checkin/out">
      <div>
        <div className="text-gray-700 text-base">
          <ul>
            <li key="kwa1">
              <div className="text-sm"><b>Scan QR Code</b>: </div>
              {scanActive && (
                <>
                  {showModal && (checkinName !== '') && (
                    <Modal
                      userFound={userFound}
                      displayName={checkinName}
                      isCheckin={isCheckin}
                    />
                  )}
                  {showModal && (checkinName === '') && (
                    <Modal
                      loading={true}
                    />
                  )}
                  {!showModal && (
                    <>
                      <QrReader
                        delay={300}
                        style={{ width: '100%', padding: '0 20%' }}
                        onError={handleErrorWebCam}
                        onScan={handleScanWebCam}
                      />
                      <br />
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => setScanActive(false)}>
                        Turn off Camera
                      </button>
                    </>
                  )}
                </>
              )}
              {!scanActive && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setScanActive(true)}>
                  Start Scanning
                </button>
              )}
            </li>
            <li key="kwa2">
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="bg-white flex items-center rounded-full shadow-xl">
                    <input
                      className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                      id="search" type="text"
                      placeholder="Search"
                      value={lastnameSearch}
                      onChange={(e) => {
                        setLastnameSearch(e.target.value);
                      }}
                    />
                    <div className="p-4">
                      <button type="submit" className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center">
                        <i className="material-icons">search</i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              {showModal && (checkinName !== '') && (searchResults.length > 0) && (
                <Modal
                  userFound={userFound}
                  displayName={checkinName}
                  isCheckin={isCheckin}
                />
              )}
              {showModal && (checkinName === '') && (searchResults.length > 0) && (
                <Modal
                  loading={true}
                />
              )}
              {!showModal && (
                <div>
                  {searchResults.map(result => (
                    <div className="flex items-center p-2 rounded-xl shadow-lg">
                      <div className="flex p-4 w-72 space-x-4 rounded-lg w-8/12">
                        <h3>{result.fields["Name"]} - {result.fields["Email"]}</h3>
                      </div>
                      <div className="flex items-center justify-center py-3 px-4 rounded-lg cursor-pointer w-2/12">
                        <a onClick={(e) => handlePinCheckin(e, result.id)}>
                          <span className="material-icons">
                            place
                          </span>
                        </a>
                      </div>
                      <div className="flex items-center justify-center py-3 px-5 rounded-lg cursor-pointer w-2/12">
                        <a onClick={(e) => handleEmail(e, result.id)}>
                          <span className="material-icons">
                            email
                          </span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </View >
  )
}

export default Checkin;
