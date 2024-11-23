import { TodoPage } from "@/lib/todo";
import { createFileRoute } from "@tanstack/react-router";

// TODO: hoàn thành trang xem thông tin hộ gia đình và các khoản thu được gán (frontend thôi)
function HouseholdInfoPage(): JSX.Element {
  return (
    <TodoPage />
  );
}

export const Route = createFileRoute("/dashboard/_layout/household/")({
  component: HouseholdInfoPage,
});
