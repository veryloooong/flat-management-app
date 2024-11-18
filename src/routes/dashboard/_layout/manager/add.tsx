import { createFileRoute } from '@tanstack/react-router'

function AddPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Tạo khoản thu</h2>
        <form>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="ten-khoan-thu">Tên khoản thu:</label>
            <input id="ten-khoan-thu" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="ten-khoan-thu">Hộ dân:</label>
            <input id="ho-dan" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="so-tien">Số tiền:</label>
            <input id="so-tien" type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="han-nop">Hạn nộp:</label>
            <input id="han-nop" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mb-4 flex items-center">
            <input id="bat-buoc" type="checkbox" className="mr-2" />
            <label htmlFor="bat-buoc" className="text-gray-700">Bắt buộc</label>
          </div>

          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Xác nhận</button>
            <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/manager/add')({
  component: AddPage,
})

export default Route;