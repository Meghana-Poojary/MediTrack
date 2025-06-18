import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddInfo({ userId }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [medications, setMedications] = useState([{ id: 1, medicineName: "", timing: "", pillsPerDose: "", pillsAvailable: "" }]);
  const navigate = useNavigate();

  const addMedication = () => {
    setMedications([...medications, { id: medications.length + 1, medicineName: "", timing: "", pillsPerDose: "", pillsAvailable: "" }]);
  };

  const removeMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleMedicationChange = (id, field, value) => {
    setMedications(medications.map(med => med.id === id ? { ...med, [field]: value } : med));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/add-info", {
        userId,
        name,
        age,
        phoneNumber,
        caregiverPhone,
        medications
      });

      if (response.data.success) {
        alert("Data saved successfully!");
        navigate("/submit"); 
      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Medical Information Form</h2>
      <p>Please fill in your medical details and medications</p>

      <div className="form-group">
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <input type="tel" placeholder="Caregiver’s Phone Number" value={caregiverPhone} onChange={(e) => setCaregiverPhone(e.target.value)} />
      </div>

      <h3>Medications</h3>
      {medications.map((med) => (
        <div key={med.id} className="medication-box">
          <h4>Medication {med.id}</h4>
          <input type="text" placeholder="Medicine Name" value={med.medicineName} onChange={(e) => handleMedicationChange(med.id, "medicineName", e.target.value)} />
          <input type="text" placeholder="Dosage Timing (ex.: 23:30)" value={med.timing} onChange={(e) => handleMedicationChange(med.id, "timing", e.target.value)} />
          <input type="number" placeholder="Number of Pills per Dose" value={med.pillsPerDose} onChange={(e) => handleMedicationChange(med.id, "pillsPerDose", e.target.value)} />
          <input type="number" placeholder="Number of Pills Available" value={med.pillsAvailable} onChange={(e) => handleMedicationChange(med.id, "pillsAvailable", e.target.value)} />
          {medications.length > 1 && (
            <button className="remove-btn" onClick={() => removeMedication(med.id)}>Remove</button>
          )}
        </div>
      ))}
      
      <button className="add-btn" onClick={addMedication}>Add Medication</button>
      <button className="submit-btn" onClick={handleSubmit}>Submit Form</button>
    </div>
  );
}
