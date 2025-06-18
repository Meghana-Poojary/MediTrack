import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import Features from "./Features";
import AskDoctor from "./AskDoctor";
import Login from "./Login";
import Footer from "./footer";
import SignUp from "./SignUp";
import AddInfo from "./AddInfo";
import BookNow from "./BookNow";
import { useState } from "react";

export default function App() {
    var [log, setlog] = useState(false)
    return (
        <div>
            <Router>
            <NavBar log={log} />
                <Routes>
                    <Route path="/" element={<Home log={log} />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/ask-doctor" element={<AskDoctor />} />
                    <Route path="/get-started" element={<Login setlog={setlog}/>} />
                    <Route path="/sign-up" element={<SignUp setlog={setlog}/>} />
                    <Route path="/add-info" element={<AddInfo setlog={setlog}/>}/>
                    <Route path="/submit" element={<Home log={true} />} />
                    <Route path="/book-appointment" element={<BookNow />} />
                </Routes>
            </Router>
            <Footer/>
        </div>
    );
}