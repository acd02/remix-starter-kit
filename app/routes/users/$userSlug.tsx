import { useEffect, useRef } from 'react'
import {
  Link,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from 'remix'

import { disableScrollRestoration } from '~handles'
import { sanity } from '~sanity'

const handle = disableScrollRestoration.handle
const meta: MetaFunction = ({ data }) => {
  return {
    title: data?.name ?? 'user not found',
  }
}

type LoaderData = {
  id: string
  name: string
  email: string
  phone: string
  address: { city: string; street: string; zipcode: string }
  imageUrl: string
}
type UseUserInfos = { email: string; id: string }

const loader: LoaderFunction = async ({ params }) => {
  const sanityReq = await sanity.fetch<LoaderData>(
    `*[slug.current == $userSlug][0]{
      "id": _id, name, email, phone, address, "imageUrl": image.asset->url,
    }`,
    {
      userSlug: params.userSlug,
    }
  )

  return sanityReq
}

function User() {
  const { id, name, email, phone, imageUrl } = useLoaderData<LoaderData>()

  const rootRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  const isOnEditPage = pathname.includes('edit')

  useEffect(() => {
    rootRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [pathname])

  const GridRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <span className="block text-sm font-medium text-gray-500">{label}</span>
      <span className="block mt-1 text-sm text-gray-900">{value}</span>
    </div>
  )

  const userDetailsBlock = isOnEditPage ? null : (
    <div ref={rootRef}>
      <h4 className="my-4 text-2xl font-bold text-gray-900">User details:</h4>
      <div className="grid grid-cols-[1fr_1fr] max-w-[30rem] gap-4 break-all">
        <div className="[grid-column:1_/_-1] mb-4">
          <img
            className="w-40 h-40 object-cover rounded-full"
            alt="user photo"
            src={imageUrl}
          />
        </div>
        <GridRow label="Name" value={name} />
        <GridRow label="Email" value={email} />
        <GridRow label="Phone" value={phone} />
        <Link
          className="[grid-column:1_/_1] text-center rounded-md px-4 py-2 font-medium bg-purple-400"
          to="edit"
        >
          edit user email
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {isOnEditPage ? null : userDetailsBlock}
      <Outlet context={{ email, id }} />
    </>
  )
}

function ErrorBoundary() {
  return <h4 className="my-4 text-2xl font-bold text-gray-900">User not found</h4>
}

function useUserInfos() {
  return useOutletContext<UseUserInfos>()
}

export default User
export { loader, meta, handle, ErrorBoundary, useUserInfos }
