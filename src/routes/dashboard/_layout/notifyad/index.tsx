import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  from: string;
  to: string;
  content: string;
}

function NotifyPage(): JSX.Element {
  const [viewMode, setViewMode] = useState<"new" | "view" | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [toValue, setToValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [errors, setErrors] = useState({ to: false, message: false });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      from: "hailong2004ptcnn@gmail.com",
      to: "long.lh224873@sis.hust.edu.vn",
      content: "Đây là nội dung thông báo đầu tiên.",
    },
    {
      id: 2,
      from: "admin@example.com",
      to: "user@example.com",
      content: "Nội dung thông báo thứ hai.",
    },
    {
      id: 1,
      from: "hailong2004ptcnn@gmail.com",
      to: "long.lh224873@sis.hust.edu.vn",
      content: "Đây là nội dung thông báo đầu tiên.",
    },
    {
      id: 2,
      from: "admin@example.com",
      to: "user@example.com",
      content: "Nội dung thông báo thứ hai.",
    },
    {
      id: 1,
      from: "hailong2004ptcnn@gmail.com",
      to: "long.lh224873@sis.hust.edu.vn",
      content: "Đây là nội dung thông báo đầu tiên.",
    },
    {
      id: 2,
      from: "admin@example.com",
      to: "user@example.com",
      content: "Nội dung thông báo thứ hai.",
    },
    {
      id: 2,
      from: "admin@example.com",
      to: "user@example.com",
      content: "Nội dung thông báo thứ hai.",
    },
    {
      id: 1,
      from: "hailong2004ptcnn@gmail.com",
      to: "long.lh224873@sis.hust.edu.vn",
      content: "Đây là nội dung thông báo đầu tiên.",
    },
    {
      id: 2,
      from: "admin@example.com",
      to: "user@example.com",
      content: "Nội dung thông báo thứ hai.",
    },
  ]);

  const handleSend = () => {
    const hasErrors = {
      to: !toValue.trim(),
      message: !messageValue.trim(),
    };

    setErrors(hasErrors);

    if (!hasErrors.to && !hasErrors.message) {
      const newNotification: Notification = {
        id: notifications.length + 1,
        from: "hailong2004ptcnn@gmail.com",
        to: toValue,
        content: messageValue,
      };

      setNotifications([newNotification, ...notifications]);
      toast({
        title: "Gửi thông báo thành công!",
        duration: 2000,
      });

      setToValue("");
      setMessageValue("");
      setViewMode(null);
    }
  };

  return (
    <div className="bg-gray-100 p-4 overflow-auto">
      <Button
        className="top-4 left-4 bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 focus:ring-2 focus:ring-black"
        onClick={() => {
          setViewMode("new");
          setSelectedNotification(null);
        }}
      >
        Thông báo mới
      </Button>

      <div className="flex mt-4 gap-4 max-h-80 scroll-y">
        <div className="p-4 bg-white rounded-lg shadow-md max-h-[80vh] overflow-y-auto w-1/3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border-b pb-4 mb-4 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedNotification(notification);
                setViewMode("view");
              }}
            >
              <h2 className="font-bold text-lg">{notification.to}</h2>
              <p className="text-gray-500 truncate">{notification.content}</p>
            </div>
          ))}
        </div>

        {viewMode === "view" && selectedNotification && (
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold text-xl mb-4">Chi tiết thông báo</h2>
            <p className="mb-2">
              <span className="font-medium">Từ:</span>{" "}
              {selectedNotification.from}
            </p>
            <p className="mb-2">
              <span className="font-medium">Đến:</span>{" "}
              {selectedNotification.to}
            </p>
            <p>
              <span className="font-medium">Nội dung:</span>
            </p>
            <p className="mt-2 bg-gray-100 p-4 rounded-lg">
              {selectedNotification.content}
            </p>
          </div>
        )}

        {viewMode === "new" && (
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="to" className="block text-sm font-medium">
                Tới:
              </label>
              <input
                id="to"
                type="text"
                value={toValue}
                onChange={(e) => setToValue(e.target.value)}
                className={`w-full px-4 py-2 mt-1 border rounded-lg ${
                  errors.to ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập người nhận"
              />
              {errors.to && (
                <p className="text-red-500 text-sm mt-1">
                  Trường này là bắt buộc.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium">
                Nhập nội dung:
              </label>
              <textarea
                id="message"
                rows={5}
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                className={`w-full px-4 py-2 mt-1 border rounded-lg ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập nội dung thông báo"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  Trường này là bắt buộc.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <Button
                className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 focus:ring-2 focus:ring-gray-300"
                onClick={() => setViewMode(null)}
              >
                Hủy
              </Button>
              <Button
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                onClick={handleSend}
              >
                Gửi
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_layout/notifyad/")({
  component: NotifyPage,
});
