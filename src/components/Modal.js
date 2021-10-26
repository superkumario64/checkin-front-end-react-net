import React from "react"

const Modal = ({ userFound, displayName, isCheckin, loading }) => {
  console.log("hello");

  return (
    <>
      {loading && (
        <h1>Loading...</h1>
      )}
      {userFound && !loading && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="p-8">
              <p className="mt-2 text-gray-500">{isCheckin ? "Welcome" : "Goodbye"} {displayName}</p>
            </div>
          </div>
        </div>
      )}
      {!userFound && !loading && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div>
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">User not found</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal;
