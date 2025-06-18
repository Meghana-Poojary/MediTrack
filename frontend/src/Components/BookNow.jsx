import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BookNow()  {
    const location = useLocation();
    const navigate = useNavigate();
    const doctor = location.state?.doctor || null; 
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");

    if (!doctor) {
        return <p>Error: No doctor selected.</p>;
    }

    const handleBooking = () => {
        if (!selectedTime || !selectedPayment) {
            alert("Please select a time slot and payment method.");
            return;
        }
        alert(`Appointment booked with ${doctor.name} at ${selectedTime} using ${selectedPayment}!`);
        navigate("/");
    };

    return (
        <div className="appointment-container">
            <h1>Book Appointment</h1>
            <p>Complete your booking with {doctor.name}</p>

            <div className="appointment-content">
                <div className="doctor-info-b">
                    <div className="doctor-card">
                        <div className="doctor-img"></div>
                        <div className="doctor-details">
                            <h2>{doctor.name}</h2>
                            <p>{doctor.specialty}</p>
                            <p>{doctor.experience} ⭐ {doctor.rating}</p>
                            <span className="availability">{doctor.available ? "Available Today" : "Not Available"}</span>
                        </div>
                    </div>

                    <h3>Selected Time Slot</h3>
                    <div className="time-slots">
                        {doctor.slots.map((time) => (
                            <button 
                                key={time} 
                                className={selectedTime === time ? "selected" : ""} 
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <div className="fee-box">
                        <p>Consultation Fee</p>
                        <h2>₹{doctor.price} <span>per consultation</span></h2>
                    </div>
                </div>

                <div className="payment-box">
                    <h3>Payment Method</h3>
                    {["Credit Card", "PayPal", "Apple Pay"].map((method) => (
                        <button 
                            key={method} 
                            className={selectedPayment === method ? "selected" : ""} 
                            onClick={() => setSelectedPayment(method)}
                        >
                            {method}
                        </button>
                    ))}
                    <button className="book-btn" onClick={handleBooking}>Book Appointment</button>
                </div>
            </div>
        </div>
    );
}
