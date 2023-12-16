"use client";
import {DocumentData} from "firebase/firestore";
import {useCallback, useEffect, useState} from "react";
import {updateCache} from "../formFunctions";

export default function TextQuestion({
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
  const [value, setValue] = useState("");

  useEffect(() => {
    if (cacheDoc.answers !== undefined) {
      setValue(cacheDoc.answers[item.questionID].response);
    }
  }, [cacheDoc]);

  const handleInputChange = useCallback(
    (value: string, item: DocumentData) => {
      setValue(value);

      updateCache(item, time, cacheKey, value);
    },
    [cacheDoc]
  );

  return (
    <>
      <div className="h-full">
        <div>{item.query}</div>
        <textarea
          name={`question_${item.questionID}`}
          value={value}
          onChange={(e) => handleInputChange(e.target.value, item)}
          className="border border-gray-300 focus:border-blue-500 rounded-md shadow-sm py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-150 ease-in-out w-full"
          rows={4}
        />
      </div>
    </>
  );
}
