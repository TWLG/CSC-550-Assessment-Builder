import {saveToJSON} from "@/app/components/operations/FirebaseDataFunctions";
import {
  assessmentsCacheFireRef,
  completedAssessmentsFireRef,
} from "@/app/components/operations/firebaseUtils";
import {
  DocumentData,
  addDoc,
  doc,
  getDoc,
  increment,
  setDoc,
} from "firebase/firestore";

/**
 * This function populates the cache with initial form data.
 *
 * @param {DocumentData} questionList - The list of questions to be cached.
 * @param {string} cacheKey - The key used to reference the cache in Firestore.
 *
 * The function iterates over the `questionList` and for each question, it creates an object with `response` and `time` fields.
 * The `response` field is an empty array if the question type is "checkbox", otherwise it's an empty string.
 * The `time` field is initialized to 0.
 *
 * This data is then written to Firestore under the provided `cacheKey`. If a document with the `cacheKey` does not exist, it's created.
 * If the document exists, the new data is merged with the existing data (existing fields are not deleted).
 * The `currentIndex` field is also set to 0 if the document does not exist.
 */
export function populateCache(
  questionList: DocumentData,
  cacheKey: string,
  title: string,
  patientID: string,
  assessmentID: string
) {
  if (questionList === undefined) {
    console.log("Question list is undefined (populateCache)");
    return;
  }

  const docRef = doc(assessmentsCacheFireRef, cacheKey); // Ensure this ID is correctly set

  const initialFormData = questionList.reduce(
    (formData: DocumentData, question: DocumentData) => {
      formData[question.questionID] = {
        response: question.type === "checkbox" ? [] : "",
        time: 0,
      };
      return formData;
    },
    {}
  );

  try {
    const check = async () =>
      await getDoc(docRef).then((docSnapshot) => {
        if (!docSnapshot.exists()) {
          console.log("Cache populated (populateCache)");
          setDoc(
            docRef,
            {
              answers: initialFormData,
              currentIndex: 0,
              title,
              patientID,
              assessmentID,
            },
            {merge: true}
          );
        }
      });

    check();
  } catch (error) {
    console.error("(populateCache) Error writing document: ", error);
  }
}

/**
 * This function updates the cache with the user's responses and time spent on each question.
 *
 * @param {number} questionID - The ID of the current question.
 * @param {number} time - The time spent on the current question.
 * @param {string} cacheKey - The key used to reference the cache in Firestore.
 * @param {EventTarget} target - The target of the input event, typically the input field (optional).
 * @param {string} type - The type of the current question (e.g., "checkbox", "text").
 * @param {string[]} answers - The possible answers for the current question (optional).
 * @param {string[]} group - The group that the current question belongs to (optional).
 * @param {string[]} weights - The weights of the answers for the current question (optional).
 *
 * The function takes the parameters and creates an object with the user's response and time spent on the question.
 * This object is then written to Firestore under the provided cache key and question ID.
 * If a document with the cache key does not exist, it's created.
 * If the document exists, the new data is merged with the existing data (existing fields are not deleted).
 */
export function updateCache(
  item: DocumentData,
  time: number,
  cacheKey: string,
  value?: string | string[] | undefined
) {
  let updateData: DocumentData = {};

  updateData[item.questionID] = {
    type: item.type,
    time: increment(time),
  };

  if (value !== undefined) {
    updateData[item.questionID].response = value;
  }

  if (item.answers !== undefined) {
    updateData[item.questionID].answers = item.answers;
  }

  if (item.group !== undefined) {
    updateData[item.questionID].group = item.group;
  }

  if (item.weights !== undefined) {
    updateData[item.questionID].weights = item.weights;
  }

  try {
    setDoc(
      doc(assessmentsCacheFireRef, cacheKey),
      {
        answers: updateData,
      },
      {merge: true}
    );

    console.log("Question " + item.questionID + " updated (updateCache)");
  } catch (error) {
    console.error("(updateCache) Error writing document: ", error);
  }
}

/**
 * This function updates the index of the current question in the cache.
 *
 * @param {number} newIndex - The new index of the current question.
 * @param {string} cacheKey - The key used to reference the cache in Firestore.
 *
 * The function takes a new index and a cache key as parameters. It updates the `currentIndex` field in the Firestore document
 * referenced by the cache key to the new index. This is used to keep track of the current question in a form or quiz.
 *
 * This function is typically called when the user navigates to a different question.
 */

export function updateCacheQuestionIndex(index: number, cacheKey: string) {
  try {
    setDoc(
      doc(assessmentsCacheFireRef, cacheKey),
      {
        currentIndex: increment(index),
      },
      {merge: true}
    );

    console.log("Index Changed (updateCacheQuestionIndex)");
  } catch (error) {
    console.error("(updateCacheQuestionIndex) Error writing document: ", error);
  }
}

export function resetCacheQuestionIndex(cacheKey: string) {
  const docRef = doc(assessmentsCacheFireRef, cacheKey); // Ensure this ID is correctly set

  try {
    const check = async () =>
      await getDoc(docRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setDoc(
            docRef,
            {
              currentIndex: 0,
            },
            {merge: true}
          );
          console.log("Index reset (resetCacheQuestionIndex)");
        }
      });

    check();
  } catch (error) {
    console.error("(resetCacheQuestionIndex): Error writing document: ", error);
  }
}

export function updateCacheAssessmentTime(time: number, cacheKey: string) {
  try {
    setDoc(
      doc(assessmentsCacheFireRef, cacheKey),
      {
        answers: {totalAssessmentTime: increment(time)},
      },
      {merge: true}
    );

    console.log("Assessment Time Updated (updateCacheAssessmentTime)");
  } catch (error) {
    console.error(
      "(updateCacheAssessmentTime): Error writing document: ",
      error
    );
  }
}

export async function uploadFinishedAssessment(
  answers: DocumentData,
  cacheKey: string
) {
  try {
    const docRef = await addDoc(completedAssessmentsFireRef, {
      answers: answers.answers,
      assessmentID: answers.assessmentID,
      lastUpdated: answers.lastUpdated,
      patientID: answers.patientID,
      usedAssessment: answers.usedAssessment,
      approved: false,
    });
    saveToJSON(answers, docRef.id);
    setDoc(
      doc(assessmentsCacheFireRef, cacheKey),
      {
        submittedID: docRef.id,
      },
      {merge: true}
    );
    console.log("Assessment Uploaded (uploadFinishedAssessment)");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}
