import Swal from "sweetalert2";

export const successAlert = (
  title: string,
  text: string
) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#06b6d4",
    background: "#1e293b",
    color: "#fff",
  });

export const errorAlert = (
  title: string,
  text: string
) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#ef4444",
    background: "#1e293b",
    color: "#fff",
  });

export const warningAlert = (
  title: string,
  text: string
) =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f59e0b",
    background: "#1e293b",
    color: "#fff",
  });
``
