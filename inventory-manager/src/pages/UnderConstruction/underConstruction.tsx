import { Hammer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./underConstruction.css";

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="construction-container">
      <div className="construction-card">
        {/* Animated Icon Container */}
        <div className="icon-wrapper">
          <Hammer className="construction-icon" size={48} />
        </div>

        <h1 className="construction-title">Under Construction</h1>
        <p className="construction-subtitle">
          We're working hard to bring you this feature. Stay tuned!
        </p>

        {/* Action Button to go back to safety */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}