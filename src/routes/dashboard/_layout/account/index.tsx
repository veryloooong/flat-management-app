import { createFileRoute } from '@tanstack/react-router'

function AccountPage(): JSX.Element {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex w-[36rem] rounded-lg bg-white shadow-lg p-6">
        
        {/* Phần hình ảnh ở bên trái */}
        <div className="flex-shrink-0">
          <img
            src="https://via.placeholder.com/80" // Thay link này bằng link hình ảnh của bạn
            alt="User Avatar"
            className="rounded-full w-32 h-32"
          />
        </div>
        
        {/* Phần thông tin khách hàng và form ở bên phải */}
        <div className="ml-6 flex flex-col justify-center w-full">
          <h2 className="text-xxl font-semibold">Tên khách hàng</h2>
          <p className="text-xl text-gray-500">Phòng bao nhiêu</p>

          {/* Form input for Review Title */}
          <div className="w-full mt-4">
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700">
              Review title
            </label>
            <input
              type="text"
              id="review-title"
              placeholder="Example: Easy to use"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Thông tin đánh giá */}
          <div className="flex space-x-4 mt-4">
            <div className="flex items-center">
              <span className="text-gray-600">⭐</span>
              <span className="ml-2 text-sm">4.7 Rating</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">👥</span>
              <span className="ml-2 text-sm">4,447 Reviews</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">🎓</span>
              <span className="ml-2 text-sm">478 Students</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            David Grant has been making video games for a living for more than 14
            years as a Designer, Producer, Creative Director, and Executive
            Producer, creating games for console, mobile, PC and Facebook.
          </p>

          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm">
            Show more
          </button>
        </div>
      </div>
    </div>
  )
  
  
}

export const Route = createFileRoute('/dashboard/_layout/account/')({
  component: AccountPage,
})
