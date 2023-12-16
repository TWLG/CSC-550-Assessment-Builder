"use client";
import {
  deleteAssessments,
  togglePublishedStatus,
} from "../../components/operations/FirebaseDataFunctions";
import {useEffect, useState} from "react";
import React from "react";
import {DocumentData} from "firebase/firestore";
import {assessmentsFireRef} from "../../components/operations/firebaseUtils";
import {useCollection} from "react-firebase-hooks/firestore";
import Navbar from "@/app/components/elements/navbar/Navbar";

/**
 * This is the main component for the admin control panel.
 * It manages the state of checked items, status filter, and data.
 * It also handles toggling the status, fetching data from Firestore,
 * handling checkbox changes, resetting checkboxes, and submitting form actions.
 *
 * @returns {JSX.Element} The rendered admin control panel component.
 */
export default function AdminControlPanel({
  panelToggle,
}: {
  panelToggle: () => void;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [searchTitle, setSearchTitle] = useState<string>("");

  const [status, setStatus] = useState<string>("all");
  const [assessmentData, setAssessmentData] = useState<Object[]>([]);

  const togglePublishedStatusStatus = () => {
    if (status === "Unpublished") {
      setStatus("Published");
    } else if (status === "Published") {
      setStatus("all");
    } else {
      setStatus("Unpublished");
    }
  };

  const [snapshot, loading, error] = useCollection(assessmentsFireRef);
  useEffect(() => {
    if (snapshot) {
      const assessments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssessmentData(assessments);
    }
  }, [snapshot]);

  /**
   * @param id
   * @param isChecked
   */
  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setCheckedItems({...checkedItems, [id]: isChecked});
  };

  const resetCheckboxes = () => {
    setCheckedItems({});
  };

  const createViewAssessmentUrl = (id: any) => {
    return `/view/${id}`;
  };

  const handleViewAssessmentClick = (id: any) => {
    const url = createViewAssessmentUrl(
      Object.keys(id).filter((key) => id[key])[0]
    );
    if (url) {
      window.open(url, "_blank"); // Navigate to the generated URL
    } else {
      alert("Please select an assessment.");
    }
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const action = (event.nativeEvent as any).submitter.name;

    const formData = new FormData(event.currentTarget);
    const formDataArray = formData.getAll("assessment");

    switch (action) {
      case "publishOption":
        if (!(formDataArray.length == 0)) {
          console.log("Publishing");
          togglePublishedStatus(formDataArray, "0");
        }
        break;
      case "unpublishOption":
        if (!(formDataArray.length == 0)) {
          console.log("Unpublishing");
          togglePublishedStatus(formDataArray, "1");
        }
        break;
      case "delete":
        deleteAssessments(formDataArray);
        break;

      default:
        console.error("Unknown action:", action);
    }
    resetCheckboxes();
  }

  const filteredAssessmentData = searchTitle
    ? assessmentData.filter((assessment: DocumentData) =>
        (
          assessment.metadata[0].title +
          assessment.metadata[0].categories +
          assessment.metadata[0].author +
          assessment.metadata[0].organization +
          assessment.metadata[0].language
        )
          .toLowerCase()
          .includes(searchTitle.toLowerCase())
      )
    : assessmentData;

  const statusFilteredAssessmentData =
    status === "Published"
      ? filteredAssessmentData.filter(
          (assessment: DocumentData) => assessment.published === true
        )
      : status === "Unpublished"
      ? filteredAssessmentData.filter(
          (assessment: DocumentData) => assessment.published === false
        )
      : filteredAssessmentData;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (assessmentData) {
    return (
      <>
        <div>
          <form className="m-3" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between w-full bg-[var(--primary-color)] rounded">
              {/* Search input */}
              <div className="flex items-center ">
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="p-2 rounded"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={panelToggle}
                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 font-bold"
                  id="Upload"
                >
                  Upload New Assessment
                </button>
              </div>
            </div>
            <div className="mt-3">
              <div className="rounded-t px-2 py-2 mt-2 text-left text-lg font-bold bg-[var(--secondary-color)] text-[var(--text-color)]">
                Assessment Manager
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--background-color2)] border-solid border-b-2 border-b-grey">
                  <tr>
                    <th className="p-2">Select</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Author</th>
                    <th className="p-2">Organization</th>
                    <th className="p-2">Upload Date</th>
                    <th className="p-2">Language</th>
                    <th className="p-2">Categories</th>
                    {status === "all" && <th>Published</th>}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {statusFilteredAssessmentData.map(
                    (item: DocumentData, index: number) => {
                      return (
                        <tr className="border-b p-4" key={index}>
                          <td className="flex justify-center items-center">
                            <input
                              type="checkbox"
                              name="assessment"
                              id="checkbox"
                              value={item.id}
                              checked={!!checkedItems[item.id]}
                              onChange={(e) =>
                                handleCheckboxChange(item.id, e.target.checked)
                              }
                            ></input>
                          </td>
                          <td>{item.metadata[0].title}</td>
                          <td>{item.metadata[0].author}</td>
                          <td>{item.metadata[0].organization}</td>
                          <td>
                            {`${new Date(
                              item.uploadDate.toDate()
                            ).toLocaleString("default", {
                              month: "short",
                            })} ${new Date(
                              item.uploadDate.toDate()
                            ).getDate()} ${new Date(
                              item.uploadDate.toDate()
                            ).getFullYear()}`}
                          </td>
                          <td>{item.metadata[0].language}</td>
                          <td className="flex">
                            {item.metadata[0].categories.map(
                              (item: string, index: number) => {
                                return (
                                  <div className="mr-2 last:mr-0" key={index}>
                                    {item}
                                  </div>
                                );
                              }
                            )}
                          </td>
                          {status === "all" && (
                            <td>{item.published.toString()}</td>
                          )}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-3">
              <button
                onClick={togglePublishedStatusStatus}
                name="toggleStatus"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-300"
              >
                {status === "all" ? "Viewing All" : status}
              </button>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  name="publishOption"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                  Publish
                </button>
                <button
                  type="submit"
                  name="unpublishOption"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
                >
                  Unpublish
                </button>
                <button
                  type="submit"
                  name="delete"
                  id="delete"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
                {Object.values(checkedItems).filter(Boolean).length === 1 && (
                  <button
                    id="view"
                    onClick={() => handleViewAssessmentClick(checkedItems)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 cursor-pointer"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="text-center py-4">No Assessments</div>

        <div className="flex justify-center mt-4">
          <button onClick={togglePublishedStatusStatus} name="toggleStatus">
            {status}
          </button>
        </div>
      </>
    );
  }
}
