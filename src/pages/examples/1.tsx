import React, { useEffect } from 'react'

import {
	matchCustomInput,
	useRefresh
} from '../../hooks/useForm/functions/misc'
import { useForm } from '../../hooks/useForm/useForm'
import { TFormObjectGetter } from '../../hooks/useForm/useForm.types'
import {
	arrayField,
	booleanField,
	FormSchema,
	textField
} from '../../hooks/useForm/useFormSchema'
import Validator from '../../hooks/useForm/validators/Validator'

const data = {
	showLastName: true,
	users: [
		{
			firstName: 'melina',
			lastName: 'badin'
		}
		// {
		// 	firstName: 'anthony',
		// 	lastName: 'jeamme'
		// }
	],
	location: {
		city: 'lyon',
		cp: '69009',
		other: {
			a: 'okok'
		}
	}
}

const Example1Schema = FormSchema<Example1Type>({
	showLastName: booleanField({
		autoRefresh: true
	}),
	users: arrayField({
		firstName: textField({
			required: true,
			validators: [
				Validator.minLength(3),
				Validator.maxLength(10),
				Validator.pattern(/^[a-z 0-9]*$/)
			]
		}),
		email: textField({}),
		website: textField({
			validators: [Validator.url()]
		}),
		lastName: textField({
			defaultValue: 'XXXX'
		})
	}),
	location: {
		city: textField(),
		cp: textField(),
		other: {
			a: textField()
		}
	}
})

type Example1Type = {
	showLastName: TField
	users: Example1UserType
	location: {
		city: TField
		cp: TField
	}
}

type Example1UserType = TArray<{
	firstName: TField
	lastName: TField
}>

const Example1 = () => {
	const form = useForm(data, Example1Schema)

	useEffect(() => {
		form.setModified(true)
	}, [])

	const refresh = useRefresh()

	return (
		<div
			style={{
				padding: 40,
				display: 'flex'
			}}
		>
			<div
				style={{
					flex: 1
				}}
			>
				<button
					onClick={() => {
						form
							.getValue(Example1Schema.showLastName)
							.update(!form.getValue(Example1Schema.showLastName).value)
					}}
				>
					{form.getValue(Example1Schema.showLastName).value
						? 'Cacher lastname'
						: 'montrer lastName'}
				</button>

				{form.getArray('users').map(user => (
					<User user={user} key={user.id} />
				))}

				<button
					onClick={() => {
						form.getArray('users').set(
							[
								{
									firstName: 'john'
								}
							],
							true
						)

						console.log(form.toJSON().location)
						refresh()
					}}
				>
					REPLACE
				</button>

				<div>
					<button
						disabled={!form.modified}
						onClick={() => {
							console.log(JSON.stringify(form.toJSON(), null, 4))

							if (form.checkForm()) {
								form.setModified(false)
							}
						}}
					>
						Save
					</button>
				</div>
			</div>

			<div
				style={{
					flex: 1,
					position: 'relative'
				}}
			>
				<textarea
					readOnly
					style={{
						width: '100%',
						height: 600
					}}
					value={JSON.stringify(form.toJSON(), null, 2)}
				/>
			</div>
		</div>
	)
}

const User = ({ user }: { user: TFormObjectGetter }) => {
	const showLastName = user.getValue('root.showLastName').value

	return (
		<div>
			<Input {...matchCustomInput(user.getValue('firstName'))} />
			{/* <Input {...matchCustomInput(user.getValue('email'))} />
			<Input {...matchCustomInput(user.getValue('website'))} />
			{showLastName && <input {...matchInput(user.get('lastName'))} />} */}
		</div>
	)
}

const Input = ({ value, onChange, error }) => (
	<input
		defaultValue={value}
		onChange={e => {
			onChange(e.target.value)
		}}
		style={{
			border: error ? `2px solid red` : `2px solid black`
		}}
	/>
)

export default Example1

type TArray<T> = {
	at: (n: number) => T
}

type TField = any
