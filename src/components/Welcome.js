import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import EnablexIcon from "../assets/enableX_logo.png";

const Welcome = () => {
    let location = useLocation();

    return (
        <div className="welcome-container">
            <img src={EnablexIcon} alt="" />
            <Link to="/meeting" id="enterMeeting">
                    {location.search === "?leave"
                        ? "Re-enter Meeting"
                        : "Enter Meeting"}
            </Link>
            {location.search === "?leave" && <div>You are disconnected!</div>}
        </div>
    );
};

export default Welcome;
