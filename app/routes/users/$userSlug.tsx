import { useEffect, useRef } from 'react'
import { LoaderFunction, MetaFunction, useLoaderData, useLocation } from 'remix'

import { disableScrollRestoration } from '~handles'
import { sanity } from '~sanity'

const handle = disableScrollRestoration.handle
const meta: MetaFunction = ({ data }) => {
  return {
    title: data?.name ?? 'user not found',
  }
}

type LoaderData = {
  name: string
  email: string
  phone: string
  address: { city: string; street: string; zipcode: string }
  imageUrl: string
}

const loader: LoaderFunction = async ({ params }) => {
  const sanityReq = await sanity.fetch<LoaderData>(
    `*[slug.current == $userSlug][0]{
      name, email, phone, address, "imageUrl": image.asset->url,
    }`,
    {
      userSlug: params.userSlug,
    }
  )

  return sanityReq
}

function User() {
  const { name, email, phone, imageUrl } = useLoaderData<LoaderData>()

  const rootRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    rootRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [pathname])

  return (
    <div ref={rootRef}>
      <h4 className="my-4 text-2xl font-bold text-gray-900">User details:</h4>
      <div className="grid grid-cols-[1fr_1fr] max-w-[30rem] gap-4">
        <div className="[grid-column:1_/_-1] mb-4">
          <img
            className="w-40 h-40 object-cover rounded-full"
            alt="user photo"
            src={imageUrl}
          />
        </div>
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

function ErrorBoundary() {
  return <h4 className="my-4 text-2xl font-bold text-gray-900">User not found</h4>
}

export default User
export { loader, meta, handle, ErrorBoundary }
