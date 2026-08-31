import { TopBar } from "./topbar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
}
