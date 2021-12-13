import { useEffect, useRef } from 'react'
import { LoaderFunction, MetaFunction, useLoaderData, useLocation } from 'remix'

import { constant, identity } from '~/utils/function'
import { httpGet } from '~/utils/http'
import { disableScrollRestoration } from '~handles'
import type { User } from '~types/user'

const handle = disableScrollRestoration.handle
const meta: MetaFunction = ({ data }) => {
  return {
    title: data?.name ?? 'user not found',
  }
}

const loader: LoaderFunction = async ({ params }) => {
  return (
    await httpGet<User[], unknown>(
      `https://jsonplaceholder.typicode.com/users/${params.userId}`
    )
  ).fold(constant(null), identity)
}

function User() {
  const { name, email, phone } = useLoaderData<User>()
  const rootRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    rootRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [pathname])

  return (
    <div ref={rootRef}>
      <h4 className="my-4 text-2xl font-bold text-gray-900">User detail:</h4>
      <div className="grid grid-cols-[1fr_1fr] max-w-[50rem] gap-4">
        <Row label="Name" value={name} />
        <Row label="Email" value={email} />
        <Row label="Phone" value={phone} />
      </div>
    </div>
  )
}

// components
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-500">{label}</span>
      <span className="block mt-1 text-sm text-gray-900">{value}</span>
    </div>
  )
}

export function ErrorBoundary() {
  return <h4 className="my-4 text-2xl font-bold text-gray-900">User not found</h4>
}

export default User
export { loader, meta, handle }
