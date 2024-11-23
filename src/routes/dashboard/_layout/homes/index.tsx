import { TodoPage } from "@/lib/todo";
import { createFileRoute } from "@tanstack/react-router";

function HomeManagementPage(): JSX.Element {
  return <TodoPage />;
}

export const Route = createFileRoute("/dashboard/_layout/homes/")({
  component: HomeManagementPage,
});
