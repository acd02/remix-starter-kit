import { LoaderFunction, MetaFunction, NavLink, Outlet, useLoaderData } from 'remix'

import { constant, identity } from '~/utils/function'
import { httpGet } from '~/utils/http'
import type { User } from '~types/user'

export const meta: MetaFunction = () => {
  return {
    title: 'users',
  }
}

export const loader: LoaderFunction = async () => {
  return (
    await httpGet<User[], unknown>('https://jsonplaceholder.typicode.com/users')
  ).fold(constant([]), identity)
}

export default function Users() {
  const users = useLoaderData<User[]>()

  const userLinks = users.map(({ id, name }) => (
    <li key={id} className="block mb-2 w-[fit-content]">
      <NavLink
        prefetch="intent"
        className={({ isActive }) =>
          isActive
            ? 'border-b border-b-purple-400 text-purple-400'
            : 'border-b border-b-transparent'
        }
        to={String(id)}
      >
        {name}
      </NavLink>
    </li>
  ))

  return (
    <>
      <ul>{userLinks}</ul>
      <Outlet />
    </>
  )
}
