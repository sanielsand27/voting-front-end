import { Outlet } from "react-router-dom";
import useInactivityTimeout from "../hooks/useInactivityTimeout";

export default function ProtectedLayout() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useInactivityTimeout(
user.role === "admin" ? 30 : 5

  );

  return <Outlet />;
}
