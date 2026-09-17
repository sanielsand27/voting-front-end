import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { warningAlert } from "../utils/alerts";

export default function useInactivityTimeout(
  timeoutMinutes = 15
) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const logout = async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await warningAlert(
        "Session Expired",
        "You have been logged out due to inactivity."
      );

      navigate("/login");
    };

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(
        logout,
        timeoutMinutes * 60 * 1000
      );
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) =>
      window.addEventListener(
        event,
        resetTimer
      )
    );

    resetTimer();

    return () => {
      clearTimeout(timer);

      events.forEach((event) =>
        window.removeEventListener(
          event,
          resetTimer
        )
      );
    };
  }, [navigate, timeoutMinutes]);
}
``
