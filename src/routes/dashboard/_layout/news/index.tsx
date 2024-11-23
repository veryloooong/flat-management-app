import { TodoPage } from "@/lib/todo";
import { createFileRoute } from "@tanstack/react-router";

function NewsPage(): JSX.Element {
  return <TodoPage />;
}

export const Route = createFileRoute("/dashboard/_layout/news/")({
  component: NewsPage,
});
