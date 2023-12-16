"use client";
import {useParams, useRouter} from "next/navigation";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../../firebase/clientApp";
import {useDocument} from "react-firebase-hooks/firestore";
import {doc} from "firebase/firestore";
import {assessmentsFireRef} from "../../components/operations/firebaseUtils";

export default function ViewAssessment() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const params = useParams();
  const q = doc(assessmentsFireRef, params.assessmentID as string);

  const [assessment, loadingAssessment, assessmentError] = useDocument(q);

  if (loading || loadingAssessment) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (assessmentError) return <div>Error: {assessmentError.message}</div>;

  if (!user) {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <pre>
        <code>{JSON.stringify(assessment?.data(), null, 2)}</code>
      </pre>
    </>
  );
}
