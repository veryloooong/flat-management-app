import { createFileRoute, Outlet } from "@tanstack/react-router";

function AuthPagesLayout(): JSX.Element {
  return (
    <div className="w-screen min-h-screen min-w-fit h-fit py-16 flex items-center justify-center bg-main-palette-1">
      <div className="flex flex-col gap-2 w-[30rem] p-10 bg-main-palette-0 rounded-lg">
        <div className="flex flex-col gap-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/(auth)/_layout")({
  component: AuthPagesLayout,
});
