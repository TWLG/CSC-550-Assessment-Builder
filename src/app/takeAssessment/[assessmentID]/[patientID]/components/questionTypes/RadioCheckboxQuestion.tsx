"use client";
import {DocumentData} from "firebase/firestore";
import {useEffect, useState} from "react";
import {updateCache} from "../formFunctions";
import MediaDisplayFunction from "../MediaDisplayFunction";
import {useParams} from "next/navigation";

export default function RadioCheckboxQuestion({
  item,
  time,
  cacheDoc,
  cacheKey,
}: {
  item: DocumentData;
  time: number;
  cacheDoc: DocumentData;
  cacheKey: string;
}) {
  const [value, setValue] = useState<string | string[]>("");
  const {assessmentID}: {assessmentID: string} = useParams();

  useEffect(() => {
    if (cacheDoc.answers !== undefined) {
      setValue(cacheDoc.answers[item.questionID].response);
    }
  }, [cacheDoc]);

  function handleInputChange(
    target: EventTarget & HTMLInputElement,
    item: DocumentData
  ) {
    let updatedValue: string | string[] = [];

    if (item.type === "checkbox") {
      const newValue = target.value;
      const existingValues = Array.isArray(value) ? value : [];

      if (target.checked) {
        // Add the new value only if it's not already in the array
        if (!existingValues.includes(newValue)) {
          updatedValue = [...existingValues, newValue];
        } else {
          // If it's already in the array, just use the existing values
          updatedValue = existingValues;
        }
      } else {
        // Remove the value if it's in the array
        updatedValue = existingValues.filter((val) => val !== newValue);
      }
    } else {
      // Directly assign the value for radio and other types
      updatedValue = target.value;
    }
    console.log("updatedValue", updatedValue);
    updateCache(item, time, cacheKey, updatedValue);
  }

  return (
    <>
      <div>{item.query}</div>
      {Array.isArray(item.answers) && (
        <div>
          {item.answers.map((answer: string, ansIndex: number) => {
            const checkboxValue = `${answer}-${ansIndex}`;

            const isCheckboxChecked =
              item.type === "checkbox"
                ? value?.includes(checkboxValue)
                : value === checkboxValue;
            return (
              <div
                key={ansIndex}
                className="flex items-center space-x-2 mb-2 md:mb-3"
              >
                <input
                  className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  type={item.type}
                  name={`question_${item.questionID}`}
                  id={`${item.questionID}-${answer}`}
                  value={checkboxValue}
                  checked={isCheckboxChecked}
                  onChange={(e) => handleInputChange(e.target, item)}
                />
                <label
                  htmlFor={`${item.questionID}-${answer}`}
                  className="text-gray-700 text-base md:text-lg"
                  accessKey={(ansIndex + 1).toString()}
                >
                  {answer}
                </label>
              </div>
            );
          })}
        </div>
      )}
      {!Array.isArray(item.answers) && (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 justify-items-center items-center">
          {item.answers.image.map((imageAnswer: string, ansIndex: number) => {
            const checkboxValue = `${imageAnswer}-${ansIndex}`;

            const isCheckboxChecked =
              item.type === "checkbox"
                ? value?.includes(checkboxValue)
                : value === checkboxValue;

            return (
              <div
                key={`${item.questionID}-${ansIndex}`}
                className="mb-2 md:mb-3"
              >
                <label
                  htmlFor={`${item.questionID}-${ansIndex}`}
                  className={`cursor-pointer block relative w-[200px] h-[200px] overflow-hidden ${
                    isCheckboxChecked
                      ? "ring-4 ring-blue-500 rounded"
                      : "ring-1 ring-grey-500 rounded"
                  }`}
                  accessKey={(ansIndex + 1).toString()}
                >
                  <input
                    className="absolute opacity-0"
                    type={item.type}
                    name={`question_${item.questionID}`}
                    id={`${item.questionID}-${ansIndex}`}
                    value={checkboxValue}
                    checked={isCheckboxChecked}
                    onChange={(e) => handleInputChange(e.target, item)}
                  />
                  <MediaDisplayFunction
                    assessmentID={assessmentID}
                    mediaName={imageAnswer}
                    type="image"
                  />
                </label>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
