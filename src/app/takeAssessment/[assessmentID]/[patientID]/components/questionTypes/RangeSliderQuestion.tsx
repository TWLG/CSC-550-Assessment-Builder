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
  const [value, setValue] = useState<number | string>("");
  const [rangeValue, setRangeValue] = useState([""]);
  const [fullRangeOverride, setFullRangeOverride] = useState(false);
  useEffect(() => {
    if (cacheDoc.answers !== undefined) {
      setValue(cacheDoc.answers[item.questionID].response);
    }

    // Initialize rangeValue based on item.range or item.steps
    if (item.range) {
      const array = Array.from(
        {length: Number(item.range[1]) - Number(item.range[0]) + 1},
        (_, i) => (Number(item.range[0]) + i).toString()
      );
      setRangeValue(array);
    } else {
      setFullRangeOverride(true);
      setRangeValue(item.steps);
    }
  }, [cacheDoc, item]);

  useEffect(() => {
    // Set initial value if not already set
    if (item.response === "" && rangeValue.length > 0) {
      setValue(Math.floor(rangeValue.length / 2));
    }
  }, [rangeValue, value]);

  const handleInputChange = useCallback(
    (newValue: string, item: DocumentData) => {
      setValue(newValue);
      item.answers = rangeValue;
      updateCache(item, time, cacheKey, newValue);
    },
    [cacheKey, item]
  );

  return (
    <>
      <div>{item.query}</div>

      <div className="w-full h-[200px] flex items-center">
        <div className="w-full">
          <input
            type="range"
            name={`question_${item.questionID}`}
            value={value}
            min={0}
            max={rangeValue.length - 1}
            step="1"
            onChange={(e) => handleInputChange(e.target.value, item)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mb-2"
            accessKey="q"
          />
          <div className="flex justify-between text-xs md:text-sm w-full px-2">
            {item.showfullrange || fullRangeOverride
              ? rangeValue.map((num, index, arr) => (
                  <span
                    key={index}
                    className={`${
                      index === 0
                        ? "text-left"
                        : index === arr.length - 1
                        ? "text-right"
                        : "text-center"
                    }`}
                  >
                    {num}
                  </span>
                ))
              : ["min", "max"].map((value, index) => (
                  <span
                    key={index}
                    className={index === 0 ? "text-left" : "text-right"}
                  >
                    {value === "min"
                      ? rangeValue[0]
                      : rangeValue[rangeValue.length - 1]}
                  </span>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
