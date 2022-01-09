import { LoaderFunction, MetaFunction, NavLink, Outlet, useLoaderData } from 'remix'

import { sanity } from '~sanity'

const meta: MetaFunction = () => {
  return {
    title: 'users',
  }
}

type LoaderData = { userName: string; slug: string; id: string }[]

const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const sanityReq = await sanity.fetch<LoaderData>(`*[_type == "user"] | order(name asc){
    "id": _id,
    "userName": name,
    "slug": slug.current
  }`)

  return sanityReq
}

export default function Users() {
  const data = useLoaderData<LoaderData>()

  const userLinks = data.map(({ userName, slug, id }) => (
    <li key={id} className="block w-fit mb-2">
      <NavLink
        prefetch="intent"
        className={({ isActive }) =>
          isActive
            ? 'border-b border-b-purple-400 text-purple-400'
            : 'border-b border-b-transparent'
        }
        to={slug}
      >
        {userName}
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

export { meta, loader }
