import {
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  addDoc,
  Timestamp,
  setDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import {
  dbStorage,
  assessmentsFireRef,
  assessmentsStorageRef,
  patientsFireRef,
} from "./firebaseUtils";
import JSZip from "jszip";

/**
 * Saves completed assessment form data to storage as a JSON file and adds the data to firestore with identifiers.
 * @param formData - The completed assessment form data.
 * @param assessment - The assessment document data.
 * @param patientID - The ID of the patient.
 */
export async function saveToJSON(formData: DocumentData, id: string) {
  const jsonData = JSON.stringify(formData);

  const storageDirectory = ref(dbStorage, "CompletedPatientAssessments/" + id);
  let fileRef = ref(storageDirectory, id + ".json");

  let exists = false;
  try {
    await getDownloadURL(fileRef)
      .then((url) => {
        // File exists and is accessible at the URL
        console.log("File exists: ", url);
        exists = true;
      })
      .catch((error) => {
        if (error.code === "storage/object-not-found") {
          // File doesn't exist
          console.log("File does not exist");
        } else {
          // Some other error occurred
          console.log("An unknown error occurred: ", error);
        }
      });
  } catch (error) {}

  let x = 1;
  while (exists) {
    fileRef = ref(storageDirectory, id + "_" + x.toString() + ".json");
    try {
      await getDownloadURL(fileRef)
        .then((url) => {
          // File exists and is accessible at the URL
          exists = true;
        })
        .catch((error) => {
          if (error.code === "storage/object-not-found") {
            // File doesn't exist
            exists = false;
          } else {
            // Some other error occurred
            exists = false;
            console.log("An unknown error occurred: ", error);
          }
        });
    } catch (error) {
      exists = false;
    }
    x++;
  }
  if (!exists) {
    uploadBytes(fileRef, new Blob([jsonData]))
      .then((snapshot) => {
        console.log("File uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  }
}

/**
 * Reads the JSON content from a file object.
 * @param file - The file object to read.
 * @returns A promise that resolves with the JSON content.
 */
const readJsonFromFileObject = (file: File): Promise<any> => {
  // reads the json file promise and returns the json content
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e || e.target == null)
        return reject(new Error("Event error or target is null"));
      try {
        const jsonContent = JSON.parse(e.target.result as string);
        resolve(jsonContent);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

interface PatientData {
  patientName: string;
  patientDate: string;
  height?: number;
  weight?: number;
  ethnicity?: string;
}

export async function CreatePatient(data: PatientData) {
  const patientRef = patientsFireRef;

  // Add a new document in collection "patients" and log it
  const docRef = await addDoc(patientRef, {
    name: data.patientName,
    date: new Date(data.patientDate),
    height: data.height,
    weight: data.weight,
    ethnicity: data.ethnicity,
  });
}
/**
 * Uploads a file to storage and adds the data to firestore with identifiers.
 * @param file - The file to upload.
 */
export async function uploadFile(file: File): Promise<void> {
  if (!file) return;

  const zip = new JSZip();
  try {
    const contents = await zip.loadAsync(file);
    let jsonContent;
    let jsonFileName;

    // Find and process the JSON file
    for (const fileName in contents.files) {
      if (fileName.endsWith(".json")) {
        jsonFileName = fileName;
        const fileData = await contents.files[fileName].async("string");
        jsonContent = JSON.parse(fileData);
        break;
      }
    }

    if (!jsonContent) {
      console.log("No JSON file found in the ZIP");
      return;
    }

    // Add assessment to Firestore
    const docRef = await addDoc(assessmentsFireRef, {
      fileName: jsonFileName,
      metadata: jsonContent.metadata,
      scoringOptions: jsonContent.scoringOptions,
      questionList: jsonContent.questionList,
      published: false,
      uploadDate: Timestamp.fromDate(new Date()),
    });

    console.log("Document written with ID: ", docRef.id);
    const storageDirectoryZIP = ref(
      dbStorage,
      `Assessments/${docRef.id}/package.zip`
    );

    // Upload all files in the ZIP to storage
    for (const fileName in contents.files) {
      if (!contents.files[fileName].dir) {
        const fileData = await contents.files[fileName].async("blob");

        // Determine the storage path
        let storagePath: string;
        if (fileName.endsWith(".json")) {
          // If the file is a JSON file, use docRef.id as its name
          storagePath = `Assessments/${docRef.id}/${docRef.id}.json`;
        } else {
          // For other files, use their original names
          storagePath = `Assessments/${docRef.id}/${fileName}`;
        }

        const storageDirectory = ref(dbStorage, storagePath);

        uploadBytes(storageDirectory, fileData)
          .then(() => {
            console.log(`Uploaded file to ${storagePath}`);
          })
          .catch((error) => {
            console.error(`Error uploading file ${fileName}:`, error);
          });
      }
    }
  } catch (error) {
    console.error("Error processing ZIP file:", error);
  }
}

/**
 * Toggles the published status of an assessment in firestore.
 * @param event - The event data from the form submission.
 * @param option - The option selected from the form submission.
 */
export function togglePublishedStatus(
  // toggles the published status of the assessment in firestore
  event: FormDataEntryValue[],
  option: string
) {
  if (option !== "0" && option !== "1") {
    return;
  }

  // Process each item in the event array
  event.forEach(async (item) => {
    const assessmentRef = doc(assessmentsFireRef, item.toString());

    try {
      if (assessmentRef) {
        //update published field
        if (option == "0") {
          await setDoc(assessmentRef, {published: true}, {merge: true});
          console.log("Form published successfully");
        } else if (option == "1") {
          await setDoc(assessmentRef, {published: false}, {merge: true});
          console.log("Form unpublished successfully");
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * Deletes an assessment from storage and firestore.
 * @param assessmentID - The ID of the assessment to delete.
 */
export async function deleteAssessments(event: FormDataEntryValue[]) {
  //deletes the assessment in both storage and firestore
  for (let item of event) {
    const folderRef = ref(assessmentsStorageRef, item.toString());
    const assessmentRef = doc(assessmentsFireRef, item.toString());

    // List all objects in the folder
    const res = await listAll(folderRef);

    // Delete each object
    for (let item of res.items) {
      console.log(item);

      await deleteObject(item)
        .then(() => {
          console.log("File deleted successfully");
        })
        .catch((error) => {
          console.error("Uh-oh, an error occurred!");
        });
    }

    await deleteDoc(assessmentRef);
  }
}

/**
 * Downloads the sample assessment.
 */
export async function downloadSampleAssessment() {
  const storageDirectory = ref(assessmentsStorageRef, "Sample Assessment");
  const fileRef = ref(storageDirectory, "Sample Assessment.json");

  const url = await getDownloadURL(fileRef);
  window.open(url, "_blank");
}
