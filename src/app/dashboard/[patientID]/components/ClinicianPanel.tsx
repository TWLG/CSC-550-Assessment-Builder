"use client";

import React, {lazy, useState} from "react";
import {doc} from "firebase/firestore";
import AssessmentListPanel from "./AssessmentList";
import {useDocument} from "react-firebase-hooks/firestore";
import {
  patientsFireRef,
  usersFireRef,
} from "../../../components/operations/firebaseUtils";
import {useRouter} from "next/navigation";
import CachedAssessmentList from "./CachedAssessmentList";

const CompletedAssessmentList = lazy(() => import("./CompletedAssessmentList"));

export default function ClinicianPanel({
  userID,
  patientID,
  returnBtn,
}: {
  userID: string;
  patientID: string;
  returnBtn: () => void;
}) {
  const router = useRouter();

  const usersDocRef = doc(usersFireRef, userID);
  const [userDoc, loadingUser, userError] = useDocument(usersDocRef);

  const patientsDocRef = doc(patientsFireRef, patientID);
  const [patientDoc, loadingPatient, patientError] =
    useDocument(patientsDocRef);

  const [completedPanel, setCompletedPanel] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | null
  >(null);

  const [selectedCompletedAssessmentId, setSelectedCompletedAssessmentId] =
    useState<string | null>(null);

  const handleTakeAssessmentClick = () => {
    if (selectedAssessmentId && patientID) {
      window.open(
        `/takeAssessment/${selectedAssessmentId}/${patientID}/start`,
        "_blank"
      ); // Navigate to the generated URL
    } else {
      alert("Please select an assessment.");
    }
  };

  const handleCompletedAssessmentClick = () => {
    if (selectedCompletedAssessmentId && patientID) {
      router.push(
        `/viewCompletedAssessment/${selectedCompletedAssessmentId}/${patientID}`
      );
    } else {
      alert("Please select an assessment.");
    }
  };

  const handleTogglePanel = () => {
    setCompletedPanel(!completedPanel);
  };

  if (loadingUser || loadingPatient)
    return <div className="text-[var(--text-color2)]">Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;
  if (patientError) return <div>Error: {patientError.message}</div>;
  if (!userDoc?.exists()) return <div>User not found</div>;
  if (!patientDoc?.exists()) return <div>Patient {patientID} not found</div>;

  return (
    <>
      <div className="w-full rounded">
        <div className="">
          {completedPanel ? (
            <>
              <CompletedAssessmentList
                patientID={patientID}
                selectedCompletedAssessmentId={selectedCompletedAssessmentId}
                setSelectedCompletedAssessmentId={
                  setSelectedCompletedAssessmentId
                }
              />
            </>
          ) : (
            <>
              <AssessmentListPanel
                selectedAssessmentId={selectedAssessmentId}
                setSelectedAssessmentId={setSelectedAssessmentId}
              />
            </>
          )}
        </div>
        <div className="flex justify-between items-center pt-2 mt-1 w-full">
          <div className="flex">
            {/* Toggle panel button */}
            <button
              onClick={handleTogglePanel}
              className="mr-2 px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300"
            >
              {completedPanel ? "New Assessment" : "View Completed"}
            </button>

            {/* View or take assessment button */}
            <button
              onClick={
                completedPanel
                  ? handleCompletedAssessmentClick
                  : handleTakeAssessmentClick
              }
              className="mr-2 px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300"
            >
              {completedPanel ? "View Selected" : "Take Selected"}
            </button>
          </div>

          {/* Return button */}
          <button
            onClick={returnBtn}
            className="px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300"
          >
            Return
          </button>
        </div>
        <div>
          <CachedAssessmentList patientID={patientID} />
        </div>
      </div>
    </>
  );
}
