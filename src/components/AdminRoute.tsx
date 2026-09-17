import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({
  children,
}: Props) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (user.role !== "admin") {
    return <Navigate to="/candidates" />;
  }

  return <>{children}</>;
}
