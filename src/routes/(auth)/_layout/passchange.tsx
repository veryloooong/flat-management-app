import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

import { Button } from '@/components/ui/button'

function ForgotPasswordPage(): JSX.Element {
  return (
    <Fragment>
      <Link to="/passwordTele" className="w-full">
        <Button type="button" className="bg-main-palette-6 hover:bg-main-palette-7 mt-2 w-full">Khôi phục bằng số điện thoại</Button>
      </Link>
      <Link to="/passwordEmail" className="w-full">
        <Button type="button" className="bg-main-palette-6 hover:bg-main-palette-7 mt-2 w-full">Khôi phục bằng Email</Button>
      </Link>
      <Link to="/login" className="w-full">
        <Button type="button" className="bg-main-palette-6 hover:bg-main-palette-7 mt-2 w-full">Quay lại</Button>
      </Link>
    </Fragment>
  )
}

export const Route = createFileRoute('/(auth)/_layout/passchange')({
  component: ForgotPasswordPage,
})
