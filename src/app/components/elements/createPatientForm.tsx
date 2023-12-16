"use client";
import {CreatePatient} from "../operations/FirebaseDataFunctions";

export default function CreatePatientForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission
    const fromData = event.target as HTMLFormElement; // Cast event.target to HTMLFormElement and access patientName property
    const data = {
      patientName: fromData.patientName.value,
      patientDate: fromData.patientDate.value,
      height: fromData.height.value,
      weight: fromData.weight.value,
      dob: fromData.age.dob,
    };
    CreatePatient(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="patientName" placeholder="Name" />
      <input type="date" name="patientDate" />
      <input type="text" name="height" placeholder="Height" />
      <input type="text" name="weight" placeholder="Weight" />
      <input type="text" name="dob" placeholder="DoB" />
      <button type="submit"> Create Patient</button>
    </form>
  );
}
