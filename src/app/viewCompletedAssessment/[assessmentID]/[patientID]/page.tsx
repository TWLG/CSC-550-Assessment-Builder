"use client";
import {useParams, useRouter} from "next/navigation";
import CompletedAssessment from "../../../dashboard/[patientID]/components/ViewCompletedAssessment";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../../firebase/clientApp";

export default function ViewCompletedAssessment() {
  const router = useRouter();
  const params = useParams();

  const [user, loading, error] = useAuthState(auth);

  if (loading)
    return <div className="text-[var(--text-color)]">Loading...</div>;
  if (error)
    return (
      <div className="text-[var(--text-color)]">Error: {error.message}</div>
    );

  if (!user) {
    router.push("/");
    return <div className="text-[var(--text-color)]">Redirecting...</div>;
  }

  if (!params) {
    return (
      <>
        <div className="text-[var(--text-color)]">Invalid URL</div>
      </>
    );
  }

  return (
    <>
      <div>
        <CompletedAssessment
          assessmentID={params.assessmentID as string}
          patientID={params.patientID as string}
        />
      </div>
    </>
  );
}
