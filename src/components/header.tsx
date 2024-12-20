import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BuildingIcon,
  CircleDollarSignIcon,
  UserIcon,
  UsersIcon,
  BellIcon,
  HomeIcon,
  ShieldIcon,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { roleToText } from "@/lib/utils";

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavigationMenuItem>
      <Link
        to={to}
        className={`flex flex-row items-center gap-2 ${isActive ? "text-white underline font-medium" : "text-main-palette-0"}`}
      >
        {children}
      </Link>
    </NavigationMenuItem>
  );
};

export const Header = ({
  userInfo,
}: {
  userInfo?: {
    username: string;
    role: string;
  };
}): JSX.Element => {
  const { username, role } = userInfo!;
  const { logout } = useAuth();

  return (
    <header className="w-full h-20 bg-main-palette-5 flex items-center justify-start gap-8 px-6 fixed top-0 z-50">
      {/* Các tab */}
      {/* TODO: make this responsive by turning into a sidebar */}
      <NavigationMenu className="text-white flex-grow mr-auto">
        <NavigationMenuList className="flex flex-row gap-8">
          <NavLink to="/dashboard">
            <HomeIcon size={24} />
            <span>Trang chủ</span>
          </NavLink>
          {role !== "tenant" && (
            <>
              <NavLink to="/dashboard/fees">
                <CircleDollarSignIcon size={24} />
                <span>Khoản thu</span>
              </NavLink>
              <NavLink to="/dashboard/homes">
                <UsersIcon size={24} />
                <span>Hộ dân</span>
              </NavLink>
            </>
          )}
          {role === "tenant" && (
            <NavLink to="/dashboard/household">
              <BuildingIcon size={24} />
              <span>Thông tin phòng</span>
            </NavLink>
          )}
          {/* <NavLink to="/dashboard/news">
            <NewspaperIcon size={24} />
            <span>Tin tức</span>
          </NavLink> */}
          {/* <NavLink to="/dashboard/settings">
            <SettingsIcon size={24} />
            <span>Cài đặt</span>
          </NavLink> */}
          {role === "admin" && (
            <NavLink to="/dashboard/admin/accounts">
              <ShieldIcon size={24} />
              <span>Quản trị viên</span>
            </NavLink>
          )}
          {role === "tenant" ? (
            <NavLink to="/dashboard/notifications">
              <BellIcon size={24} />
              <span>Thông báo</span>
            </NavLink>
          ) : (
            <NavLink to="/dashboard/notifications/manager">
              <BellIcon size={24} />
              <span>Thông báo</span>
            </NavLink>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Icons */}
      <div className="flex items-center gap-4 relative">
        {/* Icon User */}
        <div className="relative">
          {/* Dropdown Menu */}
          <Popover>
            <PopoverTrigger className="flex flex-row gap-2 items-center">
              <UserIcon className="text-white cursor-pointer" size={24} />
              <div className="">
                <span className="text-white">
                  {username} / {roleToText(role)}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-fit">
              <Link
                to="/dashboard/account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Xem thông tin tài khoản
              </Link>
              <Link
                to="/dashboard/account/edit"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Chỉnh sửa thông tin tài khoản
              </Link>
              <Link
                to="/dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cài đặt ứng dụng
              </Link>
              <Link to="/login">
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </Link>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
