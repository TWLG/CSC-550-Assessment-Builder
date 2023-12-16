"use client";
import React, {useEffect, useState} from "react";
import {
  doc,
  collection,
  query,
  where,
  documentId,
  DocumentData,
} from "firebase/firestore";
import {db} from "../../../../firebase/clientApp";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {useRouter} from "next/navigation";

export default function PatientPanel({
  userID,
  returnLock,
  lockChecked,
}: {
  userID: string;
  returnLock: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  lockChecked: boolean;
}) {
  const router = useRouter();

  const [checkedItemId, setCheckedItemId] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>(""); // State for search input
  const userDocRef = doc(db, "users", userID);
  const [userDoc, userLoading, userError] = useDocument(userDocRef);
  const patientIds = userDoc?.data()?.patients || [];
  const [patientData, setPatientData] = useState<DocumentData[]>([]);

  const patientsCollectionRef = collection(db, "patients");
  const patientsQuery = query(
    patientsCollectionRef,
    where(documentId(), "in", patientIds.length > 0 ? patientIds : ["dummyId"])
  );
  const [patientsSnapshot, patientsLoading, patientsError] =
    useCollection(patientsQuery);

  useEffect(() => {
    if (!patientsLoading && !patientsError && patientsSnapshot) {
      const patients = patientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatientData(patients);
    }
  }, [patientsSnapshot, patientsLoading, patientsError]);

  const handleRadioChange = (id: string) => {
    setCheckedItemId(id);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedPatient = patientData.find(
      (patient) => patient.id === checkedItemId
    );
    if (selectedPatient) router.push("/dashboard/" + selectedPatient.id);
  };

  // Filter patientData based on the searchName input
  const filteredPatientData = searchName
    ? patientData.filter((patient) =>
        patient.name.toLowerCase().includes(searchName.toLowerCase())
      )
    : patientData;

  if (userLoading || patientsLoading) return <div>Loading...</div>;
  if (userError || patientsError) return <div>Error loading data</div>;

  return (
    <>
      <form className="rounded p-3" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between w-full bg-[var(--primary-color)]  rounded">
          {/* Search input */}
          <div className="flex items-center ">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="p-2 rounded"
            />
          </div>

          {/* Return lock checkbox */}
          <div className="flex items-center space-x-2 p-2 bg-[var(--secondary-color)] rounded hover:bg-[var(--accent-color)] transition duration-300">
            <label
              htmlFor="returnLock"
              className="text-lg font-bold text-[var(--text-color)]"
            >
              Lock Return
            </label>
            <input
              id="returnLock"
              name="returnLock"
              type="checkbox"
              checked={lockChecked}
              onChange={returnLock}
              className="form-checkbox h-6 w-6 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
            />
          </div>
        </div>
        <div className="pt-1">
          <div className="rounded-t px-2 py-2 mt-2 text-left text-lg font-bold bg-[var(--secondary-color)] text-[var(--text-color)]">
            Patients
          </div>
          <div className="bg-[var(--background-color2)] overflow-auto max-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 border-solid border-b-2 border-b-gray-500 shadow-md bg-[var(--background-color2)]">
                <tr>
                  <th className="p-2 w-1/2">Name</th>
                  {!filteredPatientData.some((patient) =>
                    patient.name.toLowerCase().includes("testpatient")
                  ) ? (
                    <th className="p-2 w-1/2">Dob</th>
                  ) : (
                    <th className="p-2 w-1/2"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredPatientData.map((item) => (
                  <tr
                    key={item.id}
                    className={`cursor-pointer border border-1 border-b-gray-200 shadow-sm ${
                      checkedItemId === item.id
                        ? "bg-[var(--accent-color)] border-x-[var(--accent-color)]"
                        : ""
                    }`}
                    onClick={() => handleRadioChange(item.id)}
                  >
                    <td className="p-2 text-[var(--text-color)]">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="patient"
                          value={item.id}
                          checked={checkedItemId === item.id}
                          onChange={() => {}}
                          hidden
                        />
                        <span>{item.name}</span>
                      </label>
                    </td>
                    <td className="p-2">
                      <span>{item?.dob}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="mt-4 mb-1 px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300"
          >
            Select Patient
          </button>
        </div>
      </form>
    </>
  );
}
