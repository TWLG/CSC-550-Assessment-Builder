import {firebase} from "../../../../firebase/clientApp"; //went up 2 folders to get our firebase app!
import {FirebaseApp} from "firebase/app";
import {
  getStorage,
  ref,
  FirebaseStorage,
  StorageReference,
} from "firebase/storage";
import {
  CollectionReference,
  Firestore,
  collection,
  getFirestore,
} from "firebase/firestore";

export const db = getFirestore(firebase);
export const dbStorage = getStorage(firebase);

export const assessmentsStorageRef = ref(dbStorage, "Assessments");
export const patientsFireRef = collection(db, "patients");
export const assessmentsFireRef = collection(db, "assessments");
export const usersFireRef = collection(db, "users");
export const completedAssessmentsFireRef = collection(
  db,
  "completedAssessments"
);
export const assessmentsCacheFireRef = collection(db, "assessmentCache");

// DISCONTINUED BELOW
export default class FirebaseDataRetriever {
  //default class values
  app: FirebaseApp;
  storage: FirebaseStorage;
  assessmentsStorageRef: StorageReference;
  firestore: any; // says dont call Firestore in the Firestore class docs. whatever.
  patientsFireRef: CollectionReference;
  assessmentsFireRef: CollectionReference;
  usersFireRef: CollectionReference;
  completedAssessmentsFireRef: CollectionReference;
  assessmentsCacheFireRef: CollectionReference;

  constructor(app: FirebaseApp = firebase) {
    this.app = app;
    this.storage = getStorage(app);
    this.firestore = getFirestore(app);
    this.assessmentsStorageRef = ref(this.storage, "Assessments");
    this.patientsFireRef = collection(this.firestore, "patients");
    this.assessmentsFireRef = collection(this.firestore, "assessments");
    this.usersFireRef = collection(this.firestore, "users");
    this.completedAssessmentsFireRef = collection(
      this.firestore,
      "completedAssessments"
    );
    this.assessmentsCacheFireRef = collection(
      this.firestore,
      "assessmentCache"
    );
  }

  getStorage(): FirebaseStorage {
    return this.storage;
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

  getPatientsFireRef(): CollectionReference {
    return this.patientsFireRef;
  }

  getAssessmentsStorageRef(): StorageReference {
    return this.assessmentsStorageRef;
  }
  getAssessmentsFireRef(): CollectionReference {
    return this.assessmentsFireRef;
  }
  getUsersFireRef(): CollectionReference {
    return this.usersFireRef;
  }
  getCompletedAssessmentsFireRef(): CollectionReference {
    return this.completedAssessmentsFireRef;
  }
  getAssessmentsCacheFireRef(): CollectionReference {
    return this.assessmentsCacheFireRef;
  }
}
