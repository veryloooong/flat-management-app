import { TodoPage } from "@/lib/todo";
import { createFileRoute } from "@tanstack/react-router";

function SettingsPage(): JSX.Element {
  return <TodoPage />;
}

export const Route = createFileRoute("/dashboard/_layout/settings")({
  component: SettingsPage,
});
