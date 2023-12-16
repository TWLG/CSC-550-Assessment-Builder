"use client";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../firebase/clientApp";
import PatientPanel from "./components/PatientPanel";
import {useRouter} from "next/navigation";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useDocument} from "react-firebase-hooks/firestore";
import PinModal from "./components/PinModal";
import {useEffect, useState} from "react";

export default function ClinicianPage() {
  const [user, loading, error] = useAuthState(auth);
  const [locked, setLocked] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const userDocRef = doc(db, "users", user ? user.uid : "dummyID");
  const [userDoc, userLoading, userError] = useDocument(userDocRef);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const lockStatus = docSnapshot.data().returnLockChecked || false;
          setIsChecked(lockStatus);
          setLocked(lockStatus); // Set initial locked state based on the fetched data
        }
      });
    }
  }, [user]);

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsChecked(event.target.checked);

    if (user) {
      try {
        await updateDoc(userDocRef, {
          returnLockChecked: event.target.checked,
        });
      } catch (updateError) {
        console.error("Error updating document:", updateError);
      }
    }
  };

  const closeModal = () => {
    setLocked(false);
  };

  if (loading || userLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (userError) return <div>Error: {userError.message}</div>;

  if (!user || !userDoc?.exists()) {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <div className="bg-[var(--primary-color)] w-full md:w-3/4 lg:w-3/4 xl:w-3/4 rounded shadow-lg">
        {locked ? (
          <PinModal pin={userDoc.data()?.pin as string} onClose={closeModal} />
        ) : (
          <>
            <div className="w-full rounded">
              <div className="bg-[var(--primary-color)] rounded">
                <PatientPanel
                  userID={user.uid}
                  returnLock={handleCheckboxChange}
                  lockChecked={isChecked}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
