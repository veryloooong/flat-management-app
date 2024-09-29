import { createFileRoute } from '@tanstack/react-router'

function ForgotPasswordPage(): JSX.Element {
  return <div>Hello /(auth)/_layout/password!</div>
}

export const Route = createFileRoute('/(auth)/_layout/password')({
  component: ForgotPasswordPage,
})
