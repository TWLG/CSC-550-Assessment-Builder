"use client";
import React from "react";
import {useParams, useRouter} from "next/navigation";

import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../../firebase/clientApp";

export default function TakeAssessment() {
  const router = useRouter();
  const params = useParams();

  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!user) {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  if (!params) {
    return (
      <>
        <div>Invalid URL</div>
      </>
    );
  }

  return (
    <>
      <div className="text-white bg-black">yeah</div>
    </>
  );
}
