import { useNavigate } from "react-router-dom";
export default function AskDoctor() {
    const navigate = useNavigate();
    const doctors = [
        {
          id: 1,
          name: "Dr. Amar sen",
          specialty: "General Medicine",
          experience: "12 years",
          rating: 4.9,
          price: 49,
          available: true,
          slots: ["9:00 AM", "10:30 AM", "2:15 PM", "4:00 PM"],
        },
        {
            id: 2,
            name: "Dr.Monica Shah",
            specialty: "Pediatrician",
            experience: "13 years",
            rating: 4.9,
            price: 23,
            available: false,
            slots: [],
        },
        {
            id: 3,
            name: "Dr.Bhuvan Singh",
            specialty: "Dermatologist",
            experience: "13 years",
            rating: 4.9,
            price: 23,
            available: true,
            slots: ["9.30 AM"],
        },
    ]
    const handleBooking = (doctor) => {
        navigate(`/book-appointment`, { state: { doctor } });
    };
    return (
        <div className="doctor-list">
        {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
            <div className="doctor-info">
                <div className="doctor-image"></div>
                <div className="doctor-details">
                <h2>
                    {doctor.name} <span className="price">₹{doctor.price}</span>
                </h2>
                <p>{doctor.specialty}</p>
                <p>{doctor.experience} ⭐ {doctor.rating}</p>
                {doctor.available ? (
                    <p className="available">Available Today</p>
                ) : (
                    <p className="unavailable">Currently Unavailable</p>
                )}
                </div>
            </div>
    
            {/* Show booking section only if the doctor is available */}
            {doctor.available && (
                <div className="booking">
                <p>Available Slots:</p>
                <div className="slots">
                    {doctor.slots.map((slot, index) => (
                    <button key={index}>{slot}</button>
                    ))}
                </div>
                <button className="book-now" onClick={() => handleBooking(doctor)}>Book Now</button>
                </div>
            )}
            </div>
        ))}
        </div>
    );
}



 
