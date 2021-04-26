import * as React from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import { useForm } from '../hooks/useForm/useForm'
import { TForm } from '../hooks/useForm/useForm.types'
import { textField } from '../hooks/useForm/useFormSchema'

const data = {}

const IndexPage = () => {
	const form: TForm = useForm(mi, schema)

	const a = form.getObject('user')

	console.log(schema.user.firstName)

	const pathHelper = generatePathHelper(schema)

	return (
		<div
			style={{
				padding: `40px 100px`
			}}
		>
			<button
				onClick={() => {
					a.set({
						firstname: 'tony',
						lastname: 'jahim'
					})
				}}
			>
				Test
			</button>
		</div>
	)
}

const mi = {
	user: {
		firstName: 'john',
		lastName: 'doe'
	}
}

const schema = {
	user: {
		firstName: textField(),
		lastName: textField()
	}
}

type TExample<T = any> = {
	user: {
		firstName: T
		lastName: T
	}
}

type TField = string

function generatePathHelper(schema): TExample {
	console.log({ schema })

	switch (schema.type) {
		case 'value':
			break
		case 'array':
			break

		case 'object':
		default:
			return {
				pathString: () => `super`,
				...schema
			}
	}
}

const IndexPageContainer = () => (
	<ErrorBoundary>
		<IndexPage />
	</ErrorBoundary>
)

export default IndexPageContainer
