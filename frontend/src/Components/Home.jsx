import medicineImage from "../assets/medicine.jpg";
import pillImage from "../assets/pills.jpeg";
import Medication from "./Medication";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home ({log}) {
    const [medications, setMedications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMedication, setCurrentMedication] = useState(null);
    const [medicine, setMedicine] = useState("");
    const [description, setDescription] = useState("");

    const fetchMedicineInfo = async () => {
        if (!medicine) {
            alert("Please enter a medicine name.");
            return;
        }

        try {
            const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medicine}&limit=1`);
            const info = response.data.results[0].description || "No description available";
            setDescription(info);
        } catch (error) {
            console.error("Error fetching medicine info:", error);
            setDescription("No data found. Please check the medicine name.");
        }
    };

    useEffect(() => {
        if (log) {
            axios.get("http://localhost:3000/medications")
                .then(response => {
                    setMedications(response.data);
                })
                .catch(error => {
                    console.error("Error fetching medications:", error);
                });
        }
    }, [log]);

    const handleAdd = () => {
        setCurrentMedication(null);
        setIsModalOpen(true);
    };

    const handleEdit = (medication) => {
        setCurrentMedication(medication);
        setIsModalOpen(true);
    };

    const handleSave = async (medication) => {
        try {
            if (medication.id) {
                await axios.put(`http://localhost:3000/medications/${medication.id}`, medication);
            } else {
                await axios.post("http://localhost:3000/medications", medication);
            }
            const response = await axios.get("http://localhost:3000/medications");
            setMedications(response.data);
        } catch (error) {
            console.error("Error saving medication:", error);
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/medications/${id}`);
            setMedications(medications.filter(med => med.id !== id));
        } catch (error) {
            console.error("Error deleting medication:", error);
        }
    };

    return (
        <div>
            {log ? (
                <div className="inventory-container">
                    <h1>Medication Inventory</h1>
                    <p>Track your medication details and stock levels</p>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Medication Name</th>
                                    <th>Dosage Timing</th>
                                    <th>Pills Per Dose</th>
                                    <th>Pills Available</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medications.map((med) => (
                                    <tr key={med.id}>
                                        <td>{med.medicine_name}</td>
                                        <td>{med.dosage_timing}</td>
                                        <td>{med.pills_per_dose} pill(s)</td>
                                        <td className={med.pills_available === 0 ? "out-of-stock" : med.pills_available <= 5 ? "low-stock" : "sufficient-stock"}>
                                            {med.pills_available === 0 ? "Out of Stock" : `${med.pills_available} pills`}
                                        </td>
                                        <td>
                                            <button className="restock-btn"><a href="https://pharmeasy.in" style={{textDecoration: "none", color: "white"}}>+ Restock</a></button>
                                            <button className="edit-btn" onClick={() => handleEdit(med)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(med.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div><button className="edit-btn" onClick={handleAdd}>Add</button></div>
                    <div className="legend">
                        <span className="sufficient-stock-dot"></span> Sufficient Stock
                        <span className="low-stock-dot"></span> Low/Out of Stock
                    </div>
                    {isModalOpen && (
                        <Medication
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={handleSave}
                            medication={currentMedication}
                        />
                    )}
                </div>
            ) : (
                <div className="home">
                    <div className="front-one">
                        <div className="one">
                            <div className="content">
                                <h1 className="tagline">Never Miss Your <br/> <span>Medications</span> Again</h1>
                                <p className="text">MediTrack helps you manage your medications with smart reminders. Perfect for elderly care and complex medication schedules.</p>
                            </div>
                            <img className="medicine-img" src={medicineImage} alt="Intake of medicine"/>
                        </div>
                    </div>
                    <div className="front-two">
                        <div className="two">
                            <img className="medicine-img" src={pillImage} alt="Intake of medicine"/>
                            <div className="content">
                                <h1 className="tagline">Designed for <span>Everyone</span></h1>
                                <p className="text">By bridging the gap between patients, caregivers, doctors, and pharmacies, we aim to reduce medication non-adherence, enhance patient outcomes, and provide a seamless, secure, and user-friendly experience for medication management.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="desc-container">
                <input className="desc-input"
                    type="text" 
                    placeholder="Enter medicine name" 
                    value={medicine} 
                    onChange={(e) => setMedicine(e.target.value)} 
                />
                <button className="desc-button" onClick={fetchMedicineInfo}>Get Info</button>
                <p className="desc">{description}</p>
            </div>
        </div>
    );
}
