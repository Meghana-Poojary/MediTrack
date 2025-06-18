export default function Features() {
    const features = [
        { title: "Data Encryption", desc: "Bank-grade encryption ensuring your medical data stays private and secure.", icon: "🛡️" },
        { title: "Voice Reminders", desc: "Clear voice alerts to never miss your medication schedule.", icon: "🎤" },
        { title: "Caretaker Notifications", desc: "Keep loved ones informed about medication adherence.", icon: "👨‍⚕️" },
        { title: "Stock Alerts", desc: "Timely notifications when medications are running low.", icon: "📦" },
        { title: "Easy Restock", desc: "Direct integration with PharmEasy for quick medication purchases.", icon: "⚡" },
        { title: "Medicine Info", desc: "Detailed information about your medications at your fingertips.", icon: "💊" },
      ];
    return (
    <div className="feat">
        <h2 className="features">Features that Care</h2>
        <p className="feature-text">
          Comprehensive medication management tools designed to keep you and your loved ones healthy and informed.
        </p>
  
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="features-div">
              <div className="feature-icon">
                {feature.icon}
              </div>
  
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-dec">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
    </div>
    );
}