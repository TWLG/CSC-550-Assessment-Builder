"use client";

import {useEffect, useState} from "react";
import React from "react";
import {
  DocumentData,
  FirestoreError,
  deleteDoc,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  assessmentsCacheFireRef,
  completedAssessmentsFireRef,
} from "../../../components/operations/firebaseUtils";
import {useCollection} from "react-firebase-hooks/firestore";

export default function CachedAssessmentListPanel({
  patientID,
}: {
  patientID: string | null;
}) {
  const [error, setError] = useState<FirestoreError | null>(null);

  const [selectedCachedAssessmentId, setSelectedCachedAssessmentId] = useState<
    string | null
  >(null);

  const [selectedCompletedAssessmentId, setSelectedCompletedAssessmentId] =
    useState<string | null>(null);

  const [reopenAssessmentId, setReOpenAssessmentId] = useState<string | null>(
    null
  );

  const cacheQuery = patientID
    ? query(assessmentsCacheFireRef, where("patientID", "==", patientID))
    : null;
  const [cacheSnapshot, loadingCache, hookErrorCache] =
    useCollection(cacheQuery);

  useEffect(() => {
    setError(hookErrorCache ?? null);
  }, [hookErrorCache]);

  const handleRadioChange = (
    id: string,
    completedID: string,
    setReopenAssessmentId: string
  ) => {
    setSelectedCachedAssessmentId(id);
    setSelectedCompletedAssessmentId(completedID);

    setReOpenAssessmentId(setReopenAssessmentId);
  };

  const handleDelete = () => {
    console.log(selectedCachedAssessmentId);
    if (!selectedCachedAssessmentId) return;
    try {
      deleteDoc(doc(assessmentsCacheFireRef, selectedCachedAssessmentId));
      setSelectedCachedAssessmentId(null);
      setSelectedCompletedAssessmentId(null);
      setReOpenAssessmentId(null);
    } catch (error) {
      console.error("(handleDelete): Error writing document: ", error);
    }
  };

  const handleApprove = () => {
    console.log(selectedCachedAssessmentId);
    if (!selectedCompletedAssessmentId || !selectedCachedAssessmentId) return;
    try {
      setDoc(
        doc(completedAssessmentsFireRef),
        {
          approved: true,
        },
        {merge: true}
      );
      deleteDoc(doc(assessmentsCacheFireRef, selectedCachedAssessmentId));
      setSelectedCachedAssessmentId(null);
      setSelectedCompletedAssessmentId(null);
    } catch (error) {
      console.error("(handleApprove): Error writing document: ", error);
    }
  };

  const handleReopenAssessmentClick = () => {
    if (reopenAssessmentId && selectedCachedAssessmentId && patientID) {
      window.open(
        `/takeAssessment/${reopenAssessmentId}/${patientID}/continue-${selectedCachedAssessmentId}`,
        "_blank"
      ); // Navigate to the generated URL
    } else {
      alert("Please select an assessment.");
    }
  };
  if (loadingCache) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const cacheData = cacheSnapshot
    ? cacheSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    : [];

  return (
    <>
      {cacheData?.length > 0 && (
        <div>
          <div className="rounded-t px-2 py-2 mt-3 text-left text-lg font-bold bg-[var(--secondary-color)] text-[var(--text-color)]">
            Ongoing Assessments
          </div>
          <div className="bg-[var(--background-color2)] overflow-auto max-h-[260px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 border-solid border-b-2 border-b-gray-500 shadow-md bg-[var(--background-color2)]">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Current Question</th>
                  <th className="p-2">#Answered</th>
                </tr>
              </thead>
              <tbody>
                {cacheData.map((item: DocumentData) => {
                  type Answer = {
                    response: string | any[];
                  };
                  let count = 0;
                  Object.keys(item.answers).forEach((key) => {
                    const currentItem = item.answers[key] as Answer; // Assuming Answer type is defined as before
                    if (
                      currentItem?.response !== "" &&
                      !(
                        Array.isArray(currentItem?.response) &&
                        currentItem?.response.length === 0
                      )
                    ) {
                      count++;
                    }
                  });

                  return (
                    <tr
                      key={item.id}
                      className={`cursor-pointer border border-1 border-b-gray-200 shadow-sm ${
                        selectedCachedAssessmentId === item.id
                          ? "bg-[var(--accent-color)] border-x-[var(--accent-color)]"
                          : ""
                      }`}
                      onClick={() =>
                        handleRadioChange(
                          item.id,
                          item.submittedID,
                          item.assessmentID
                        )
                      }
                    >
                      <td className="p-2">
                        <input
                          type="radio"
                          name="assessment"
                          value={item.id}
                          checked={selectedCachedAssessmentId === item.id}
                          onChange={() =>
                            handleRadioChange(
                              item.id,
                              item.submittedID,
                              item.assessmentID
                            )
                          }
                          className="form-radio h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300"
                          onClick={(e) => e.stopPropagation()} // Prevent event bubbling on click
                          style={{display: "none"}}
                        />
                        {item.title}
                      </td>
                      <td className="p-2">{item.currentIndex + 1}</td>
                      <td className="p-2">
                        {!(count === Object.keys(item.answers).length) ? (
                          <>
                            {count - 1} /{Object.keys(item.answers).length - 1}
                          </>
                        ) : (
                          <div>Completed</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-between">
            <button
              onClick={handleReopenAssessmentClick}
              className="px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300"
            >
              Reopen Selected
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => handleApprove()}
                className="px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
