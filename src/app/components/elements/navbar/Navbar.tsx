"use client";
import Image from "next/image";
import ThemeButton from "./ThemeButton";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../../../firebase/clientApp";
import {doc, updateDoc} from "firebase/firestore";
import {useDocument} from "react-firebase-hooks/firestore";
import {usersFireRef} from "../../operations/firebaseUtils";
import {signOut} from "firebase/auth";
import {useRouter} from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
  const q = user ? doc(usersFireRef, user.uid) : doc(usersFireRef, "null"); // 'null' or some dummy ID
  const [userDoc, loadingUser, userError] = useDocument(q);

  const handleSignIn = async () => {
    router.push("/");
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      const userDocRef = doc(db, "users", user ? user.uid : "dummyID");
      if (user) {
        try {
          await updateDoc(userDocRef, {
            returnLockChecked: false,
          });
        } catch (updateError) {
          console.error("Error updating document:", updateError);
        }
      }
      router.push("/");
    } catch (error) {
      // An error happened during sign out.
      console.error("Sign out error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (loadingUser) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;

  return (
    <>
      <nav className=" flex justify-between items-center mb-4 px-4 py-1 bg-gradient-to-r from-white via-[var(--primary-color)] to-[var(--primary-color)]">
        <div className="flex items-center space-x-2">
          <Image
            src="/uncw-logo.png"
            alt="UNCW Logo"
            width={45}
            height={45}
            className="rounded-full"
          />

          {userDoc?.exists() && (
            <div className="text-lg font-semibold text-gray-700">
              {userDoc?.data().name}
            </div>
          )}
          {userDoc?.exists() && (
            <div className="text-md font-semibold text-gray-500">
              {userDoc?.data().username}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {userDoc?.exists() && userDoc.data().role === "admin" && (
            <a
              href="/assessment_manager"
              id="assessment_manager_button"
              className="px-3 py-2 text-sm bg-[var(--secondary-color)] text-[var(--text-color)] rounded hover:bg-[var(--accent-color)] transition duration-300 font-bold"
            >
              Assessment Manager
            </a>
          )}

          {user && (
            <a
              href="/dashboard"
              className="px-3 py-2 text-sm bg-[var(--secondary-color)] text-[var(--text-color)] rounded hover:bg-[var(--accent-color)] transition duration-300 font-bold"
            >
              Clinician
            </a>
          )}
          <ThemeButton className="px-2 py-1 inline-flex items-center justify-center bg-[var(--secondary-color)] text-[var(--text-color)] rounded hover:bg-[var(--accent-color)] transition duration-300" />
          {user ? (
            <button
              id="signOut"
              className="px-3 py-2 text-sm bg-[var(--secondary-color)] text-[var(--text-color)] rounded hover:bg-[var(--accent-color)] transition duration-300 font-bold"
              onClick={handleSignOut}
            >
              SIGN OUT
            </button>
          ) : (
            <button
              className="px-3 py-2 text-sm bg-[var(--secondary-color)] text-[var(--text-color)] rounded hover:bg-[var(--accent-color)] transition duration-300 font-bold"
              onClick={handleSignIn}
            >
              SIGN IN
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
