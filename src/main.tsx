import React from "react";
import ReactDOM from "react-dom/client";

import { Link, RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useAuth } from "./lib/auth";

function NotFound(): JSX.Element {
  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <CircleX size={48} />
      <h1 className="text-4xl">Không tìm thấy nội dung cần tìm</h1>
      <Link to="/dashboard">
        <Button>Quay lại trang chủ</Button>
      </Link>
    </div>
  );
}

function LoadingComponent(): JSX.Element {
  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <div className="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h1 className="text-2xl">Đang tải...</h1>
    </div>
  );
}

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
  context: { authentication: undefined! },
  defaultPendingComponent: LoadingComponent,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const authentication = useAuth();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} context={{ authentication }} />
  </React.StrictMode>
);
