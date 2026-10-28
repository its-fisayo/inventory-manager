import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionTimeoutModal from "./SessionTimeoutModal";

const IDLE_TIME = 15 * 60 * 1000;
const WARNING_TIME = 300;

function IdleTimer() {
  const navigate = useNavigate();

  const idleTimeoutRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_TIME);

  const showModalRef = useRef(false);

  const logout = () => {
    if (idleTimeoutRef.current !== null) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    showModalRef.current = false;
    setShowModal(false);

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const startCountdown = () => {
    // Prevent multiple intervals
    if (idleTimeoutRef.current !== null) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    showModalRef.current = true;
    setCountdown(WARNING_TIME);
    setShowModal(true);

    let remaining = WARNING_TIME;

    countdownIntervalRef.current = window.setInterval(() => {
      remaining -= 1;

      setCountdown(remaining);

      if (remaining <= 0) {
        if (countdownIntervalRef.current !== null) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }

        logout();
      }
    }, 1000);
  };

  const resetIdleTimer = () => {
    // Don't restart while warning modal is showing
    if (showModalRef.current) return;

    if (idleTimeoutRef.current !== null) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }

    idleTimeoutRef.current = window.setTimeout(() => {
      idleTimeoutRef.current = null;
      startCountdown();
    }, IDLE_TIME);
  };

  const continueSession = () => {
    showModalRef.current = false;
    setShowModal(false);
    setCountdown(WARNING_TIME);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (idleTimeoutRef.current !== null) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }

    idleTimeoutRef.current = window.setTimeout(() => {
      startCountdown();
    }, IDLE_TIME);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });

      if (idleTimeoutRef.current !== null) {
        clearTimeout(idleTimeoutRef.current);
      }

      if (countdownIntervalRef.current !== null) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      {showModal && (
        <SessionTimeoutModal
          countdown={countdown}
          idletime={IDLE_TIME / (60 * 1000)}
          onContinue={continueSession}
          onLogout={logout}
        />
      )}
    </>
  );
}

export default IdleTimer;
