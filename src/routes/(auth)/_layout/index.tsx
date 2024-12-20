import { createFileRoute, Link } from "@tanstack/react-router";

import "@/App.css";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
// import { invoke } from "@tauri-apps/api/core";

function HomePage(): JSX.Element {
  return (
    <div className="text-center">
      <h1 className="text-2xl">Ứng dụng quản lý chung cư BlueMoon</h1>
      <p>
        Ứng dụng giúp quản lý về tài chính và thông tin cư dân trong chung cư
        BlueMoon
      </p>

      <div className="flex flex-col gap-2 mt-8">
        <Link to="/login">
          <Button className="flex items-center justify-start gap-4 p-8 bg-main-palette-6 hover:bg-main-palette-7 text-white w-full">
            <User size={24} /> <p className="text-lg">Đăng nhập</p>
          </Button>
        </Link>
        <Link to="/register">
          <Button className="flex items-center justify-start gap-4 p-8 bg-main-palette-4 hover:bg-main-palette-5 text-white w-full">
            <UserPlus size={24} /> <p className="text-lg">Đăng ký</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function PendingComponent() {
  return <div>Loading...</div>;
}

export const Route = createFileRoute("/(auth)/_layout/")({
  component: HomePage,
  pendingComponent: PendingComponent,
});
