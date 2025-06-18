import { useState, useEffect } from "react";

export default function Medication({ isOpen, onClose, onSave, medication }) {
    const [medName, setMedName] = useState("");
    const [timing, setTiming] = useState("");
    const [pillsPerDose, setPillsPerDose] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        if (medication) {
            setMedName(medication.medicine_name || "");
            setTiming(medication.dosage_timing || "");
            setPillsPerDose(medication.pills_per_dose || "");
            setStock(medication.pills_available || "");
        } else {
            setMedName("");
            setTiming("");
            setPillsPerDose("");
            setStock("");
        }
    }, [medication]);

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{medication ? `Edit Medication ${medication.id}` : "Add Medication"}</h2>
          <input type="text" placeholder="Medicine Name" value={medName} onChange={(e) => setMedName(e.target.value)} />
          <input type="text" placeholder="Dosage Timing" value={timing} onChange={(e) => setTiming(e.target.value)} />
          <input type="number" placeholder="Number of Pills per Dose" value={pillsPerDose} onChange={(e) => setPillsPerDose(e.target.value)} />
          <input type="number" placeholder="Number of Pills Available" value={stock} onChange={(e) => setStock(e.target.value)} />
          <div className="modal-actions">
            <button className="save-btn" onClick={() => onSave({ id: medication?.id, medicine_name: medName, dosage_timing: timing, pills_per_dose: pillsPerDose, pills_available: stock })}>Save</button>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
}
