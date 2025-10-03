import { Outlet } from "react-router-dom";

export const DefaultRoute = () => {
  return (
    <main className="min-h-dvh flex p-5">
      <Outlet />
    </main>
  );
};
