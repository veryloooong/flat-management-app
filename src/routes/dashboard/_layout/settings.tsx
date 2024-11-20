import { createFileRoute } from "@tanstack/react-router";

function SettingsPage(): JSX.Element {
  return (
    <div className="w-screen pt-6">
      <h1 className="text-center">Settings</h1>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/settings")({
  component: SettingsPage,
});
