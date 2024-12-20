import { toast } from "@/hooks/use-toast";

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Header } from "@/components/header";

function DashboardLayoutPage(): JSX.Element {
  const { userInfo } = Route.useLoaderData();

  return (
    <div className="bg-main-palette-0 min-h-screen pt-20">
      <Header userInfo={userInfo} />
      <div className="pt-8 w-screen">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout")({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = context.authentication;

    const userInfo = await isAuthenticated();

    if (!userInfo) {
      toast({
        title: "Vui lòng đăng nhập để truy cập trang này",
        description: "Bạn sẽ được chuyển hướng về trang đăng nhập",
        variant: "destructive",
      });

      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ context }) => {
    const { getBasicUserInfo } = context.authentication;

    const userInfo = await getBasicUserInfo();
    if (userInfo === undefined) {
      throw redirect({ to: "/login" });
    }

    return {
      userInfo,
    };
  },
  component: DashboardLayoutPage,
});
