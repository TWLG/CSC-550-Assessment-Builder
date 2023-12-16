"use client";

import {useEffect, useState} from "react";
import React from "react";
import {
  DocumentData,
  FirestoreError,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  assessmentsCacheFireRef,
  completedAssessmentsFireRef,
  patientsFireRef,
} from "../../../components/operations/firebaseUtils";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {useParams} from "next/navigation";

export default function AssessmentListPanel({
  patientID,
  selectedCompletedAssessmentId,
  setSelectedCompletedAssessmentId,
}: {
  patientID: string | null;
  selectedCompletedAssessmentId: string | null;
  setSelectedCompletedAssessmentId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}) {
  const [error, setError] = useState<FirestoreError | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>(""); // State for search input

  const patientIDr = useParams();
  const patientsDocRef = doc(patientsFireRef, patientID || "dummyID");
  const [patientDoc, loadingPatient, patientError] =
    useDocument(patientsDocRef);

  const completedAssessmentQuery = patientID
    ? query(
        completedAssessmentsFireRef,
        where("patientID", "==", patientID),
        where("approved", "==", true)
      )
    : null;
  const [
    completedAssessmentSnapshot,
    loadingCompletedAssessments,
    hookErrorCompletedAssessments,
  ] = useCollection(completedAssessmentQuery);

  useEffect(() => {
    setError(hookErrorCompletedAssessments ?? null);
  }, [hookErrorCompletedAssessments]);

  const handleRadioChange = (id: string) => {
    setSelectedCompletedAssessmentId(id);
  };

  if (loadingCompletedAssessments) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const assessmentData = completedAssessmentSnapshot
    ? completedAssessmentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    : [];

  const filteredAssessmentData = searchTitle
    ? assessmentData.filter((assessment: DocumentData) =>
        (
          assessment.metadata[0].title +
          assessment.metadata[0].categories +
          assessment.metadata[0].author +
          assessment.metadata[0].organization +
          assessment.metadata[0].language
        )
          .toLowerCase()
          .includes(searchTitle.toLowerCase())
      )
    : assessmentData;

  return (
    <>
      <div className="">
        {/* Search input */}
        <div className="flex space-x-2 items-center">
          <div className="rounded">
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="p-2 rounded"
            />
          </div>
          <div className="text-[var(--text-color)] px-2 py-2 text-lg font-bold">
            {/* patientDoc?.data()?.name */}
          </div>
        </div>
        {/* Table */}
        <div>
          <div className="rounded-t px-2 py-2 mt-3 text-left text-lg font-bold bg-[var(--secondary-color)] text-[var(--text-color)]">
            Completed Assessments
          </div>
          <div className="bg-[var(--background-color2)] overflow-auto max-h-[260px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 border-solid border-b-2 border-b-gray-500 shadow-md bg-[var(--background-color2)]">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Author</th>
                  <th className="p-2">Upload Date</th>
                  <th className="p-2">Organization</th>
                  <th className="p-2">Categories</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessmentData.map((item: DocumentData) => {
                  return (
                    <tr
                      key={item.id}
                      className={`cursor-pointer border border-1 border-b-gray-200 shadow-sm ${
                        selectedCompletedAssessmentId === item.id
                          ? "bg-[var(--accent-color)] border-x-[var(--accent-color)]"
                          : ""
                      }`}
                      onClick={() => handleRadioChange(item.id)}
                    >
                      <td className="p-2">
                        <input
                          type="radio"
                          name="assessment"
                          value={item.id}
                          checked={selectedCompletedAssessmentId === item.id}
                          onChange={() => handleRadioChange(item.id)}
                          className="form-radio h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300"
                          onClick={(e) => e.stopPropagation()} // Prevent event bubbling on click
                          style={{display: "none"}}
                        />
                        {item.usedAssessment.metadata[0].title}
                      </td>
                      <td className="p-2">
                        {item.usedAssessment.metadata[0].author}
                      </td>
                      <td className="p-2">
                        {item.usedAssessment.uploadDate
                          .toDate()
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </td>
                      <td className="p-2">
                        {item.usedAssessment.metadata[0].organization}
                      </td>
                      <td className="p-2 flex">
                        {item.usedAssessment.metadata[0].categories.map(
                          (item: string, index: number) => {
                            return (
                              <div className="mr-2 last:mr-0" key={index}>
                                {item}{" "}
                              </div>
                            );
                          }
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
