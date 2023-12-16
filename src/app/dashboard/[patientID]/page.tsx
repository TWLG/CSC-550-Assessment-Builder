"use client";
import Navbar from "../../components/elements/navbar/Navbar";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../../firebase/clientApp";
import ClinicianPanel from "./components/ClinicianPanel";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {doc} from "firebase/firestore";
import {useDocument} from "react-firebase-hooks/firestore";

export default function ClinicianPage() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const {patientID} = useParams();
  const [patientExists, setPatientExists] = useState<boolean | null>(null);

  const userDocRef = doc(db, "users", user ? user.uid : "dummyId");
  const [userDoc, userLoading, userError] = useDocument(userDocRef);

  useEffect(() => {
    if (userDoc?.exists()) {
      const patientIds = userDoc.data().patients;
      setPatientExists(patientIds.includes(patientID));
    }
  }, [userDoc, patientID]);

  const returnButton = () => {
    router.push("/dashboard");
  };

  if (loading || userLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (userError) return <div>Error: {userError.message}</div>;
  if (patientExists === null) return <div>Loading patient data...</div>;
  if (!patientExists) {
    // Handle the case where the patient does not exist
    return <p>Patient does not exist</p>;
  }
  if (!user) {
    router.push("/");
    return <div>Redirecting...</div>;
  }
  if (!userDoc?.exists()) {
    return <div>Invalid User</div>; // Ensure a value is returned
  }
  return (
    <>
      <div className="p-3 bg-[var(--primary-color)] w-full md:w-3/4 lg:w-3/4 xl:w-3/4 rounded shadow-lg">
        <ClinicianPanel
          userID={user.uid as string}
          patientID={patientID as string}
          returnBtn={returnButton}
        />
      </div>
    </>
  );
}
