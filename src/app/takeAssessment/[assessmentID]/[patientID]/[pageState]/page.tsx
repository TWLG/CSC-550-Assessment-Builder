"use client";
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../../../firebase/clientApp";
import {usersFireRef} from "@/app/components/operations/firebaseUtils";
import {doc} from "firebase/firestore";
import {useDocument} from "react-firebase-hooks/firestore";
import PinModalAssessment from "../components/PinModalAssessment";
import AssessmentContainer from "../components/AssessmentContainer";
import {resetCacheQuestionIndex} from "../components/formFunctions";

export default function AssessmentCompleted() {
  const router = useRouter();
  const {
    assessmentID,
    patientID,
    pageState,
  }: {assessmentID: string; patientID: string; pageState: string} = useParams();
  const [patientExists, setPatientExists] = useState<boolean | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [user, loading, error] = useAuthState(auth);
  const q = user ? doc(usersFireRef, user.uid) : doc(usersFireRef, "null"); // 'null' or some dummy ID
  const [userDoc, loadingUser, userError] = useDocument(q);

  const [started, setStarted] = useState(false);

  // Check if patient existence is determined
  useEffect(() => {
    if (userDoc?.exists()) {
      const patientIds = userDoc.data().patients;
      setPatientExists(patientIds.includes(patientID));
    }
  }, [userDoc, patientID]);

  if (!userDoc?.exists()) {
    return <div>Invalid User</div>; // Ensure a value is returned
  }

  const handlePinModalClick = (item: any) => {
    setIsModalOpen(true);
  };

  const handleStart = () => {
    setStarted(true);
  };

  if (loading || loadingUser) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (patientExists === null) return <div>Loading patient data...</div>;
  if (!patientExists) {
    // Handle the case where the patient does not exist
    return <p>Patient does not exist</p>;
  }

  if (!user) {
    router.push("/");
    return (
      <div className="text-center text-lg text-[var(--text-color)] my-5">
        Redirecting...
      </div>
    );
  }

  if (!userDoc?.exists()) {
    return (
      <div className="text-center text-lg text-[var(--text-color)] my-5">
        Invalid User
      </div>
    );
  }

  const handleReady = () => {
    router.push(
      `/takeAssessment/${assessmentID}/${patientID}/take-${
        Math.floor(Math.random() * 900000000) + 100000000
      }`
    );
  };

  const handleContinue = () => {
    try {
      resetCacheQuestionIndex(pageState.split("-")[1]);
      router.push(
        `/takeAssessment/${assessmentID}/${patientID}/take-${
          pageState.split("-")[1]
        }`
      );
    } catch (error) {
      console.error(
        "(handleContinue) Failed to reset cache question index: ",
        error
      );
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between h-screen w-screen ">
        {isModalOpen && (
          <PinModalAssessment
            pin={userDoc.data().pin}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <div className="flex-grow flex justify-center items-center ">
          {pageState === "start" ? (
            <div className="flex justify-center items-center ">
              <button
                onClick={handleReady}
                className={`bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300 ${
                  started
                    ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                    : ""
                }`}
                accessKey="Enter"
              >
                Start Assessment
              </button>
            </div>
          ) : pageState === "completed" ? (
            <div className="text-center my-5 text-[var(--text-color2)]">
              <h1 className="text-2xl font-semibold">Assessment Completed</h1>
              <div className="text-md mt-2">
                Please return the device to your Clinician.
              </div>
            </div>
          ) : pageState === "interrupted" ? (
            <div className="text-center my-5 text-[var(--text-color2)]">
              <h1 className="text-2xl font-semibold">Assessment Interrupted</h1>
              <div className="text-md mt-2">
                Please return the device to your Clinician.
              </div>
            </div>
          ) : pageState.split("-")[0] === "take" ? (
            <div className="w-full h-full">
              <AssessmentContainer
                cacheKey={pageState.split("-")[1]}
                patientID={patientID}
                assessmentID={assessmentID}
              />
            </div>
          ) : pageState.split("-")[0] === "continue" ? (
            <div className="flex justify-center items-center ">
              <button
                onClick={handleContinue}
                className={`bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300 ${
                  started
                    ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                    : ""
                }`}
                accessKey="Enter"
              >
                Continue Assessment
              </button>
            </div>
          ) : (
            <div className="flex flex-col m-4 px-4 py-2 justify-center items-center bg-white rounded font-bold text-red-700">
              <div>Invalid Data</div>
              <div>Contact Admin</div>
            </div>
          )}
        </div>
        {pageState.split("-")[0] !== "take" && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handlePinModalClick}
              className="bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300"
              accessKey="Esc"
            >
              Clinician Panel
            </button>
          </div>
        )}
      </div>
    </>
  );
}
