"use client";
import {useState} from "react";
import AdminControlPanel from "./components/AdminControlPanel";
import AssessmentUpload from "./components/AssessmentUpload";

import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase/clientApp";
import {useRouter} from "next/navigation";
import {doc} from "firebase/firestore";
import {useDocument} from "react-firebase-hooks/firestore";
import {usersFireRef} from "../components/operations/firebaseUtils";

export default function AssesmentManager() {
  const router = useRouter();

  const [displayUpload, setDisplayUpload] = useState(false);
  const [user, loading, error] = useAuthState(auth);

  const q = user ? doc(usersFireRef, user.uid) : doc(usersFireRef, "null"); // 'null' or some dummy ID
  const [userDoc, loadingUser, userError] = useDocument(q);

  const toggleDisplayUpload = () => {
    setDisplayUpload(!displayUpload);
    console.log("toggleDisplayUpload");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (loadingUser) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;

  if (!user) {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  if (!userDoc?.exists() || userDoc?.data()?.role !== "admin") {
    router.push("/");
    return <div>No access, redirecting...</div>;
  }
  return (
    <>
      <div
        className={
          displayUpload
            ? "bg-[var(--background-color)] w-full h-full rounded shadow-lg overflow-hidden"
            : "bg-[var(--primary-color)] w-full h-full rounded shadow-lg md:w-3/4 lg:w-3/4 xl:w-3/4 "
        }
      >
        {displayUpload ? (
          <AssessmentUpload panelToggle={toggleDisplayUpload} />
        ) : (
          <AdminControlPanel panelToggle={toggleDisplayUpload} />
        )}
      </div>
    </>
  );
}
