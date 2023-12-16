"use client";
import {useEffect, useState} from "react";
import {
  completedAssessmentsFireRef,
  patientsFireRef,
} from "../../../components/operations/firebaseUtils";
import {doc, DocumentData} from "firebase/firestore";
import {useDocument} from "react-firebase-hooks/firestore";

/**
 * Uses search params from the document in fireStore to display information on each question and the corresponding answer
 * @param param0
 * @returns
 */

export default function CompletedAssessment({
  patientID,
  assessmentID,
}: {
  patientID: string;
  assessmentID: string;
}) {
  const [assessment, setAssessment] = useState<DocumentData>({});
  const [answers, setAnswers] = useState<DocumentData>({});
  const [patient, setPatient] = useState<DocumentData>({});

  const assessmentDocRef = doc(completedAssessmentsFireRef, assessmentID);
  const [assessmentDoc, loading, error] = useDocument(assessmentDocRef);

  const patientsDocRef = doc(patientsFireRef, patientID);
  const [patientDoc, loadingPatient, errorPatient] =
    useDocument(patientsDocRef);

  useEffect(() => {
    if (assessmentDoc?.exists()) {
      const assessmentData = assessmentDoc.data();
      setAssessment(assessmentData);
      setAnswers(assessmentData?.answers || {});
      console.log("CompletedAssessment Fetch");
    }
    if (patientDoc?.exists()) {
      const patientData = patientDoc.data();
      setPatient(patientData);
      console.log("CompletedAssessment Fetch");
    }
  }, [assessmentDoc]);

  const renderAnswer = (
    answer: any,
    questionIndex: number,
    question: string
  ) => {
    if (!answer) return null;
    if (typeof answer === "number") return null;
    if (!answer.type) return null;

    try {
      return (
        <div className="bg-white p-4 rounded-lg shadow space-y-1">
          <div className="font-medium">
            <div className="font-bold">
              {questionIndex + 1}
              {": "}
              {question}
            </div>

            {/* CHECKBOX */}
            {answer.type === "checkbox" && (
              <ul className="">
                {answer.response.map((ans: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    <div className="flex items-center">
                      <div className="mr-2">
                        {"Response: " + ans.replace(/-\d+$/, "")}
                      </div>
                      <div className="ml-1">
                        {"Weight: " + answer.weights[index]}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* RADIO */}
            {answer.type === "radio" && (
              <>
                <div className="text-gray-700">
                  {(("Response: " + answer.response) as string).replace(
                    /-\d+$/,
                    ""
                  )}
                </div>
                <div className="text-gray-700">
                  {"Weight: " +
                    answer.weights[answer.response.replace(/^.*-/, "")]}
                </div>
              </>
            )}

            {/* TEXT */}
            {answer.type === "text" && (
              <div className="text-gray-700">
                {"Response: " + answer.response}
              </div>
            )}

            {/* SLIDER / RANGE */}
            {answer.type === "range" && (
              <>
                {answer.response ? (
                  <>
                    <div className="text-gray-700">
                      {"Response: " + answer.response}
                    </div>
                    <div className="text-gray-700">
                      {"Weight: " + answer.weights[Number(answer.response) - 1]}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-gray-700">
                      {"Response: " + Math.floor(answer.answers.length / 2)}
                    </div>
                    <div className="text-gray-700">
                      {"Weight: " +
                        answer.weights[Math.floor(answer.answers.length / 2)]}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <ul className="text-sm text-gray-500">
            {answer.group?.map((group: string, index: number) => (
              <li key={index} className="text-gray-700">
                {group}
              </li>
            ))}
          </ul>
          <div className="text-sm text-gray-500">{answer.time}ms</div>
          <div className="text-sm text-gray-500">{formatTime(answer.time)}</div>
        </div>
      );
    } catch (error: any) {
      return (
        <div className="text-red-500 text-center p-4">
          <div className="bg-white p-4 rounded-lg shadow space-y-1">
            <div className="font-medium">
              <div className="font-bold">
                Error Parsing Question
                {questionIndex + 1}: {error.message || error}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  /**
   * Calculates the total weights for each group based on the answers
   * @param answers The answers object
   * @returns An object containing the total weights for each group
   */
  const calculateGroupWeights = (answers: DocumentData) => {
    const groupTotals: Record<string, number> = {};

    try {
      Object.entries(answers).forEach(([questionID, answer]) => {
        if (answer.group && answer.weights) {
          // Handle different answer types
          if (answer.type === "checkbox" && Array.isArray(answer.response)) {
            answer.response.forEach((response: string) => {
              const weightIndex = parseInt(response.split("-")[1]);
              const weight = parseFloat(answer.weights[weightIndex]) || 0; // Add zero if weight is null/undefined
              answer.group.forEach((group: string) => {
                groupTotals[group] = (groupTotals[group] || 0) + weight;
              });
            });
          } else if (["radio", "range", "text"].includes(answer.type)) {
            const weightIndex =
              answer.type === "range"
                ? parseInt(answer.response) - 1
                : parseInt(answer.response.split("-")[1]);
            const weight = parseFloat(answer.weights[weightIndex]) || 0; // Add zero if weight is null/undefined
            answer.group.forEach((group: string) => {
              groupTotals[group] = (groupTotals[group] || 0) + weight;
            });
          }
        }
      });
    } catch (error) {
      console.log("Error calculating group weights: ", error);
    }

    console.log("groupTotals: ", groupTotals);
    return groupTotals;
  };

  /**
   * milliseconds to hours, minutes, seconds
   * @param milliseconds milliseconds
   * @returns string hours, minutes, seconds
   */
  const formatTime = (milliseconds: number) => {
    let totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center p-4">Error: {error.message}</div>
    );

  return (
    <div className="container mx-auto px-4">
      {assessment && (
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-white p-4 rounded-lg shadow">
            {assessment.usedAssessment?.metadata[0].title}
            {" for "}
            {patient.name}
          </h2>
          <div className="mb-4 bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">
              Total Weights by Group:
            </h3>

            {Object.keys(calculateGroupWeights(answers)).map((group, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-2"
              >
                <span className="text-lg font-semibold">{group}</span>
                <span className="font-medium">
                  {calculateGroupWeights(answers)[group]}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between mt-6 pt-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-medium">
                {Object.values(calculateGroupWeights(answers)).reduce(
                  (sum, current) => sum + current,
                  0
                )}
              </span>
            </div>
            {assessment.answers?.totalAssessmentTime && (
              <div className="flex items-center justify-between mt-2 text-gray-500">
                <span className="text-lg font-medium">Total Time:</span>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-small">
                    {assessment.answers.totalAssessmentTime}ms
                  </span>{" "}
                  <span className="text-lg font-small">
                    {formatTime(assessment.answers.totalAssessmentTime)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <ul className="space-y-2">
            {assessment.answers &&
              typeof assessment.answers === "object" &&
              Object.entries(assessment.answers).map(
                ([key, question]: [string, any], index) => (
                  <li key={key}>
                    {renderAnswer(
                      question,
                      index,
                      assessment.usedAssessment?.questionList[index]?.query
                    )}
                  </li>
                )
              )}
          </ul>
        </div>
      )}
    </div>
  );
}
