import {
  ActionFunction,
  Form,
  MetaFunction,
  redirect,
  useActionData,
  useTransition,
} from 'remix'

import Button from '~components/atoms/Button'
import TextInput from '~components/atoms/TextInput'
import { sanity } from '~sanity'
import { EmailIcon } from '~svg'
import type { Error } from '~types/form'
import { emailRegex } from '~utils/regex'

import { useUserInfos } from '../$userSlug'

const meta: MetaFunction = ({ parentsData }) => {
  const userName: string | undefined = parentsData['routes/users/$userSlug']?.name

  return {
    title: `Editing ${userName ?? 'user'}`,
  }
}

const action: ActionFunction = async ({ request, params }) => {
  /* eslint-disable fp/no-mutation */
  const formData = await request.formData()
  const id = formData.get('id') as string | null
  const email = (formData.get('email') ?? '') as string

  const errors: Error = {}

  if (!id || !emailRegex.test(email)) {
    errors.message = 'could not update user email'

    return errors
  }

  return sanity
    .patch(id)
    .set({ email })
    .commit()
    .then(() => redirect(`/users/${params.userSlug}`))
    .catch(() => {
      errors.message = 'could not update user email'

      return errors
    })
}

function UserEdit() {
  const { email, id } = useUserInfos()
  const errors = useActionData<Error>()
  const { state } = useTransition()

  return (
    <>
      <h4 className="my-4 text-2xl font-bold text-gray-900">Editing user email:</h4>
      <Form className="max-w-xs" method="patch">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <TextInput
          svg={EmailIcon}
          className="mt-1"
          type="email"
          name="email"
          id="email"
          defaultValue={email}
        />
        <input id="id" name="id" hidden type="hidden" value={id} />
        <Button disabled={state === 'submitting'} className="mt-4 min-w-[4rem]">
          {state === 'submitting' ? '...' : 'save'}
        </Button>
        {errors?.message && (
          <span className="block mt-4 bg-red-400 py-2 px-4 rounded-md w-fit">
            {errors.message}
          </span>
        )}
      </Form>
    </>
  )
}

export default UserEdit
export { action, meta }
