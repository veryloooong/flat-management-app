import { createFileRoute } from '@tanstack/react-router'

function FeesPage(): JSX.Element {
  return (<div>
    <h1>Quản lý các khoản thu</h1>
    <p>TODO</p>
  </div>)
}

export const Route = createFileRoute('/dashboard/_layout/fees/')({
  component: FeesPage,
})
