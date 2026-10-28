import "./SessionTimeoutModal.css";

type SessionTimeoutModalProps = {
  countdown: number;
  idletime: number;
  onContinue: () => void;
  onLogout: () => void;
};

function SessionTimeoutModal({
  countdown,
  idletime,
  onContinue,
  onLogout,
}: SessionTimeoutModalProps) {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return (
    <div className="timeout-overlay">
      <div className="timeout-modal">
        <h2>Session Timeout</h2>

        <p>
          You have been inactive for{" "}
          <strong>
            {idletime} {idletime === 1 ? "minute" : "minutes"}.
          </strong>
        </p>

        <p>You will be logged out automatically in</p>

        <div className="countdown">{formattedTime}</div>

        <div className="timeout-buttons">
          <button className="continue-btn" onClick={onContinue}>
            Continue App Use
          </button>

          <button className="logout-btn" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeoutModal;
