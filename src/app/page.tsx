"use client";
import React, {FormEvent, useState} from "react";
import {auth} from "../../firebase/clientApp";
import {signInWithEmailAndPassword} from "firebase/auth";
import {useRouter} from "next/navigation";
import {FirebaseError} from "firebase/app";
import {useAuthState} from "react-firebase-hooks/auth";

function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [user, loading, error] = useAuthState(auth);

  if (user) {
    router.push("/dashboard");
    return <div className="text-[var(--text-color)]">Redirecting...</div>;
  }

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          setErrorMessage("Incorrect email/password. Please try again.");
        } else {
          setErrorMessage("Error signing in: " + error.message);
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded">
          <h1 className="text-2xl font-bold mb-4">Sign In</h1>

          <div className="text-black">
            <ul>
              <li className="font-bold">admin</li>
              <li>
                email: <div>jeff123@gmail.com</div>
              </li>
            </ul>
            <div>--------------</div>
            <ul>
              <li className="font-bold">clinician</li>
              <li>
                email: <div>dave7@gmail.com</div>
              </li>
            </ul>
            <div>--------------</div>
            <ul className="mb-4">
              <li>passwords: password</li>
            </ul>
          </div>
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              id="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </button>
          </form>
          <div>{errorMessage}</div>
        </div>
      </div>
    </>
  );
}

export default SignInScreen;
