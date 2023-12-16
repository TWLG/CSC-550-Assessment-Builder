"use client";
import {useEffect, useState} from "react";
import React from "react";
import {DocumentData, doc, query, where} from "firebase/firestore";
import {assessmentsFireRef} from "../../../components/operations/firebaseUtils";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../../../firebase/clientApp";

export default function AssessmentListPanel({
  selectedAssessmentId,
  setSelectedAssessmentId,
}: {
  selectedAssessmentId: string | null;
  setSelectedAssessmentId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [assessmentData, setAssessmentData] = useState<Object[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>(""); // State for search input

  const [user, loadingUser, userError] = useAuthState(auth);

  const userDocRef = doc(db, "users", user ? user.uid : "dummyID");
  const [userDoc, userLoading, userDocError] = useDocument(userDocRef);

  const published = query(assessmentsFireRef, where("published", "==", true));
  const all = query(assessmentsFireRef);
  const [snapshot, loading, error] = useCollection(
    userDoc?.data()?.role !== "admin" ? published : all
  );

  useEffect(() => {
    if (snapshot) {
      const assessments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssessmentData(assessments);
    }
  }, [snapshot]);

  // Filter assessmentData based on the searchTitle input
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleRadioChange = (id: string) => {
    setSelectedAssessmentId(id);
  };

  return (
    <>
      <form className="rounded">
        {/* Search input */}
        <div className="rounded">
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="p-2 rounded"
          />
        </div>

        {/* Table */}
        <div className="">
          <div className="rounded-t px-2 py-2 mt-3 text-left text-lg font-bold bg-[var(--secondary-color)] text-[var(--text-color)]">
            Available Assessments
          </div>
          <div className="bg-[var(--background-color2)] overflow-auto max-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 border-solid border-b-2 border-b-gray-500 shadow-md bg-[var(--background-color2)]">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Author</th>
                  <th className="p-2">Organization</th>
                  <th className="p-2">Upload Date</th>
                  <th className="p-2">Language</th>
                  <th className="p-2">Categories</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessmentData.map((item: DocumentData) => (
                  <tr
                    key={item.id}
                    className={`cursor-pointer border border-1 border-b-gray-200 shadow-sm ${
                      selectedAssessmentId === item.id
                        ? "bg-[var(--accent-color)] border-x-[var(--accent-color)]"
                        : ""
                    }`}
                    onClick={() => handleRadioChange(item.id)} // Moved click handler to the row
                  >
                    <td className="p-2">
                      <input
                        type="radio"
                        id={`assessment-${item.id}`}
                        name="assessment"
                        value={item.id}
                        checked={selectedAssessmentId === item.id}
                        onChange={() => handleRadioChange(item.id)}
                        className="form-radio h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300"
                        style={{display: "none"}}
                      />
                      {item.metadata[0].title}
                    </td>
                    <td className="p-2">{item.metadata[0].author}</td>
                    <td className="p-2">{item.metadata[0].organization}</td>
                    <td className="p-2">
                      {`${new Date(item.uploadDate.toDate()).toLocaleString(
                        "default",
                        {month: "short"}
                      )} ${new Date(
                        item.uploadDate.toDate()
                      ).getDate()} ${new Date(
                        item.uploadDate.toDate()
                      ).getFullYear()}`}
                    </td>
                    <td className="p-2">{item.metadata[0].language}</td>
                    <td className="p-2 flex">
                      {item.metadata[0].categories.map(
                        (item: string, index: number) => {
                          return (
                            <div className="mr-2 last:mr-0" key={index}>
                              {item}
                            </div>
                          );
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </>
  );
}
