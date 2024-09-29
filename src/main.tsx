import React from "react";
import ReactDOM from "react-dom/client";

import { Link, RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

function NotFound(): JSX.Element {
  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <CircleX size={48} />
      <h1 className="text-4xl">Không tìm thấy nội dung cần tìm</h1>
      <Link to="/">
        <Button>
          Quay lại trang chủ
        </Button>
      </Link>
    </div>
  )
}

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
