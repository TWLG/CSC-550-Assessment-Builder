"use client";
import React, {useEffect, useState} from "react";
import {DocumentData, Timestamp, doc} from "firebase/firestore";

import {
  assessmentsCacheFireRef,
  assessmentsFireRef,
} from "../../../../components/operations/firebaseUtils";
import MediaDisplayFunction from "./MediaDisplayFunction";
import {useDocument} from "react-firebase-hooks/firestore";
import {useRouter} from "next/navigation";
import {it} from "node:test";
import {
  populateCache,
  updateCache,
  updateCacheAssessmentTime,
  updateCacheQuestionIndex,
  uploadFinishedAssessment,
} from "./formFunctions";
import TextQuestion from "./questionTypes/TextQuestion";
import RadioCheckboxQuestion from "./questionTypes/RadioCheckboxQuestion";
import RangeSliderQuestion from "./questionTypes/RangeSliderQuestion";

export default function AssessmentForm({
  cacheKey,
  patientID,
  assessmentID,
}: {
  cacheKey: string;
  patientID: string;
  assessmentID: string;
}) {
  const router = useRouter();
  const [assessment, setAssessment] = useState<DocumentData>({});
  const [questionStartTime, setQuestionStartTime] = useState<
    number | undefined
  >(undefined);
  const [assessmentStartTime] = useState(Date.now());
  const [completed, setCompleted] = useState(false);

  const assessmentDocRef = doc(assessmentsFireRef, assessmentID);
  const [assessmentDoc, loading, error] = useDocument(assessmentDocRef);

  const cacheDocRef = doc(assessmentsCacheFireRef, cacheKey);
  const [cacheDoc, loadingCacheDoc, cacheDocError] = useDocument(cacheDocRef);
  const [cacheDocData, setCacheDocData] = useState<DocumentData>({});

  useEffect(() => {
    if (assessmentDoc?.exists()) {
      const assessment = assessmentDoc.data();
      setAssessment(assessment);
      if (assessment.questionList) {
        populateCache(
          assessment.questionList,
          cacheKey,
          assessment.metadata[0].title,
          patientID,
          assessmentID
        );
      }
    }

    if (cacheDoc?.exists()) {
      setCacheDocData(cacheDoc.data() || {});
    }
  }, [assessmentDoc, cacheDoc]);

  useEffect(() => {
    const now = Date.now();
    setQuestionStartTime(now);
  }, [cacheDocData.currentIndex]);

  if (
    cacheDoc === undefined ||
    loadingCacheDoc ||
    loading ||
    !cacheDoc.exists()
  ) {
    return <div>Loading...</div>;
  }

  if (error) return <p>Error: {error.message}</p>;
  if (cacheDocError) return <p>Error: {cacheDocError.message}</p>;

  function handleNavigation(increment: number) {
    if (
      questionStartTime &&
      cacheDocData.currentIndex < assessment?.questionList?.length
    ) {
      updateCache(
        assessment.questionList[cacheDocData.currentIndex],
        Date.now() - questionStartTime,
        cacheKey
      );
    }
    updateCacheAssessmentTime(Date.now() - assessmentStartTime, cacheKey);
    updateCacheQuestionIndex(increment, cacheKey);
  }

  function handleSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (questionStartTime) {
      updateCacheAssessmentTime(Date.now() - assessmentStartTime, cacheKey);
    }
    const completeAssessmentData = {
      answers: cacheDocData.answers,
      assessmentID: assessmentID,
      patientID: patientID,
      lastUpdated: Timestamp.fromDate(new Date()),
      usedAssessment: assessment,
    };

    uploadFinishedAssessment(completeAssessmentData, cacheKey);

    setCompleted(true);
    router.push(`/takeAssessment/${assessmentID}/${patientID}/completed`);
  }

  // Function to render a single question

  const questionTypes = ["text", "radio", "checkbox", "range"];
  const time = 50;

  const renderQuestion = (item: DocumentData) => {
    return (
      <>
        {questionTypes.includes(item.type) ? (
          <div
            className="questionLayout space-y-4 px-4 md:px-8 py-2 md:py-4"
            key={item.questionID}
          >
            <div className="font-bold text-lg md:text-xl">
              Question {item.questionID}
            </div>

            <div className="mt-4 md:mt-6 w-1/4">
              {item?.image && (
                <MediaDisplayFunction
                  assessmentID={assessmentID}
                  mediaName={item?.image}
                  type="image"
                />
              )}

              {item?.video && (
                <MediaDisplayFunction
                  assessmentID={assessmentID}
                  mediaName={item?.video}
                  type="video"
                />
              )}
            </div>

            {item.type === "range" && (
              <RangeSliderQuestion
                item={item}
                time={time}
                cacheDoc={cacheDocData}
                cacheKey={cacheKey}
              />
            )}

            {item.type === "text" && (
              <TextQuestion
                item={item}
                time={time}
                cacheDoc={cacheDocData}
                cacheKey={cacheKey}
              />
            )}

            {(item.type === "radio" || item.type === "checkbox") &&
              item.answers && (
                <RadioCheckboxQuestion
                  item={item}
                  time={time}
                  cacheDoc={cacheDocData}
                  cacheKey={cacheKey}
                />
              )}
          </div>
        ) : (
          <div className="flex flex-col m-4 px-4 py-2 justify-center items-center bg-white rounded font-bold text-red-700">
            <div>Unsupported Question Type</div>
            <div>Contact Admin/Clinician</div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex justify-center items-center w-full h-full bg-[var(--background-color)]">
        <form
          className="assessmentQuestions flex flex-col justify-between w-3/4 h-3/4 p-4 md:p-6 bg-white rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {cacheDocData.currentIndex < assessment?.questionList?.length &&
            renderQuestion(assessment.questionList[cacheDocData.currentIndex])}

          {cacheDocData.currentIndex >= assessment?.questionList?.length && (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col space-y-16">
                <div className="text-center text-2xl font-bold">
                  Click submit to finish the assessment.
                </div>
                <button
                  type="submit"
                  className={`bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300 mx-auto
                      ${
                        completed
                          ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                          : ""
                      }`}
                  accessKey="Enter"
                  disabled={completed}
                >
                  Submit
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigation(-1)}
                  className={`bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300 mx-auto`}
                  accessKey="Esc"
                >
                  Previous Question
                </button>
              </div>
            </div>
          )}
          <div className="mt-4 md:mt-6 flex justify-between">
            {cacheDocData.currentIndex > 0 && (
              <button
                type="button"
                onClick={() => handleNavigation(-1)}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300"
                accessKey="Esc"
              >
                Previous
              </button>
            )}
            {cacheDocData.currentIndex > 0 ? (
              <div className="flex-1" /> // This empty div acts as a spacer
            ) : (
              <div />
            )}
            {(cacheDoc.data()?.currentIndex || 0) <
              assessment?.questionList?.length && (
              <button
                type="button"
                onClick={() => handleNavigation(1)}
                className="bg-[var(--secondary-color)] text-[var(--text-color)] text-white font-bold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300"
                accessKey="Enter"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
