"use client";
import React, {useRef, useState} from "react";
import JSZip from "jszip";
import {
  downloadSampleAssessment,
  uploadFile,
} from "../../components/operations/FirebaseDataFunctions";
import Navbar from "@/app/components/elements/navbar/Navbar";

export default function AssessmentUpload({
  panelToggle,
}: {
  panelToggle: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [missingImages, setMissingImages] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function findImageStrings(jsonObject: Record<string, any>): string[] {
    let imageStrings: string[] = [];

    function searchInObject(obj: Record<string, any>) {
      for (const key in obj) {
        if (key === "image") {
          if (
            typeof obj[key] === "string" &&
            !imageStrings.includes(obj[key])
          ) {
            imageStrings.push(obj[key]);
          } else if (Array.isArray(obj[key])) {
            obj[key].forEach((item: any) => {
              if (typeof item === "string" && !imageStrings.includes(item)) {
                imageStrings.push(item);
              }
            });
          }
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          searchInObject(obj[key]);
        }
      }
    }

    searchInObject(jsonObject);
    return imageStrings;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files?.[0] || null;
      setSelectedFile(file);
      const zip = new JSZip();

      zip.loadAsync(file).then((contents) => {
        // Find JSON file in ZIP and parse it
        const jsonFileName = Object.keys(contents.files).find((fileName) =>
          fileName.endsWith(".json")
        );
        if (jsonFileName) {
          contents.files[jsonFileName].async("string").then((fileData) => {
            const parsedJson = JSON.parse(fileData);
            setFileContent(fileData);
            const images = findImageStrings(parsedJson);

            // Check for missing images
            const missing = images.filter((image) => !contents.files[image]);
            setMissingImages(missing);
            if (missing.length > 0) {
              setError("Missing data in ZIP");
            }
          });
        } else {
          setError("No JSON file found in ZIP");
        }
      });
    }
  };

  const clearFileContent = () => {
    setSelectedFile(null);
    setMissingImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setFileContent("");
      setMissingImages([]);
      setError("");
    }
  };
  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        await uploadFile(selectedFile);
        setError("File uploaded successfully.");
      } catch (error: any) {
        setError(error.message);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col" style={{height: "calc(100vh - 60px)"}}>
        <div className="mb-4 flex justify-center ">
          <div className="flex justify-between md:w-3/4">
            <button
              onClick={panelToggle}
              className="px-4 py-2 bg-[var(--accent-color)] text-[var(--text-color)] hover:bg-[var(--primary-color)] font-bold rounded transition duration-300"
            >
              Return to Assessment Management Page
            </button>

            <div className="flex justify-center space-x-2">
              <div className="px-4 py-2 bg-[var(--secondary-color)] text-[var(--text-color)] hover:bg-[var(--accent-color)] font-bold rounded transition duration-300">
                <input
                  type="file"
                  id="browse"
                  onChange={handleFileChange}
                  accept=".zip"
                  className="block w-full text-md text-[var(--text-color)]
                 file:mr-4 file:py-2 file:px-4
                 file:text-md file:font-semibold
                 file:text-[var(--text-color)]"
                  ref={fileInputRef}
                />
              </div>

              {selectedFile && !error && (
                <div className="flex space-x-4">
                  <button
                    id="uploadFile"
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
                  >
                    Upload File
                  </button>
                </div>
              )}
              <button
                onClick={clearFileContent}
                className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
              >
                Clear File
              </button>
              {error && (
                <div className="flex justify-center items-center text-red-500 bg-red-100 border border-red-500 py-2 px-4 rounded">
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={downloadSampleAssessment}
              className="px-4 py-2 bg-[var(--accent-color)] text-[var(--text-color)] hover:bg-[var(--primary-color)] font-bold rounded transition duration-300"
            >
              Sample Assessment
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto m-4 bg-[var(--background-color2)] rounded text-[var(--text-color)]">
          {fileContent && (
            <div className="p-4 border border-gray-300 rounded flex flex-col max-h-full">
              {missingImages.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2">
                    Missing data in zip file
                  </h2>
                  <ul className="list-disc list-inside">
                    {missingImages.map((image, index) => (
                      <li key={index}>{image}</li>
                    ))}
                  </ul>
                </div>
              )}
              <h2 className="text-xl font-bold mb-4">File Content</h2>
              <div className="overflow-auto flex-grow">
                <pre className="whitespace-pre-wrap">{fileContent}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
