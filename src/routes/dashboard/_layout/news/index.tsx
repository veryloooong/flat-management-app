import { createFileRoute } from '@tanstack/react-router'

function NewsPage(): JSX.Element {
  return (
    <div className="w-screen pt-6">
      <h1 className='text-center'>News</h1>
    </div>
  )
}

export const Route = createFileRoute('/dashboard/_layout/news/')({
  component: NewsPage,
})
