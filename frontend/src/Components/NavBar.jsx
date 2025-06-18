import { NavLink } from "react-router-dom";

export default function NavBar({ log, setlog }) {
    return (
        <div className="nav-bar">
            <NavLink style={{ textDecoration: "none", fontSize: "25px", fontWeight: "bold" }} className="name" to="/">
                MediTrack<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-capsule-pill" viewBox="0 0 16 16">
                    <path d="M11.02 5.364a3 3 0 0 0-4.242-4.243L1.121 6.778a3 3 0 1 0 4.243 4.243l5.657-5.657Zm-6.413-.657 2.878-2.879a2 2 0 1 1 2.829 2.829L7.435 7.536zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8m-.5 1.042a3 3 0 0 0 0 5.917zm1 5.917a3 3 0 0 0 0-5.917z"/>
                </svg>
            </NavLink>
            <ul className="menu"> {/* Fixed 'class' to 'className' */}
                <li><NavLink style={{ textDecoration: "none" }} className={({ isActive }) => (isActive ? "active-link" : "")} to="/">Home</NavLink></li>
                <li><NavLink style={{ textDecoration: "none" }} className={({ isActive }) => (isActive ? "active-link" : "")} to="/features">Features</NavLink></li>
                <li><NavLink style={{ textDecoration: "none" }} className={({ isActive }) => (isActive ? "active-link" : "")} to="/ask-doctor">Ask Doctor</NavLink></li>
                
                {log ? (
                    <li>
                        <button className="logout" style={{border: "0", background: "transparent"}} onClick={()=>setlog(false)}><a href="/" > Log Out</a></button>      
                    </li>              
                ) : (
                    <li>
                        <NavLink style={{ textDecoration: "none" }} className={({ isActive }) => (isActive ? "active-link start" : "start")} to="/get-started">
                            Get Started
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
}
