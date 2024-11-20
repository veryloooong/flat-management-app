import { Toaster } from "@/components/ui/toaster";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContext } from "@/lib/auth";

type RouterContext = {
  authentication: AuthContext;
};

function RootIndex(): JSX.Element {
  return (
    <main>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </main>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootIndex,
});
