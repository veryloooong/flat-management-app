import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function TodoPage(): JSX.Element {
  return (
    <div className="flex flex-col gap-4 w-screen items-center">
      <h1>Xin lỗi!</h1>
      <p>
        Trang này đang được phát triển và sẽ sớm được hoàn thiện. Xin hãy quay
        lại sau.
      </p>
      <Link to="/dashboard">
        <Button>Quay lại trang chính</Button>
      </Link>
    </div>
  );
}
