import React, { useEffect, useRef } from 'react'
import { matchCustomInput } from '../../hooks/useForm/functions/misc'
import { useForm } from '../../hooks/useForm/useForm'
import { TFormEvent } from '../../hooks/useForm/useForm.types'
import { numberField, textField } from '../../hooks/useForm/useFormSchema'

const data = {}

const schema = {
	user: {
		firstName: textField({
			required: true
		}),
		lastName: textField({
			required: true
		}),
		age: numberField({
			required: true
		})
	}
}

const BasicExample = () => {
	const refreshCounter = useRef<number>(0)
	const form = useForm(data, schema)
	const textareaRef = useRef<HTMLTextAreaElement>()

	useEffect(() => {
		const handleChange = (event: TFormEvent) => {
			console.log(event)
			textareaRef.current.value = JSON.stringify(form.toJSON(), null, 2)
		}

		form.addEventListener('change', handleChange)
		return () => {
			form.removeEventListener('change', handleChange)
		}
	}, [])

	const handleSave = () => {
		if (form.checkForm()) {
			form.setModified(false)
		} else {
			console.log(`There is error(s) in form`)
		}
	}

	return (
		<div
			style={{
				display: 'flex',
				padding: 40
			}}
		>
			<div style={{ flex: 1 }}>
				<div>Refresh counter : {refreshCounter.current++}</div>

				<div>
					<Input
						placeholder="firstName"
						{...matchCustomInput(form.get('user.firstName'))}
					/>
					<Input
						placeholder="lastName"
						{...matchCustomInput(form.get('user.lastName'))}
					/>
					<Input
						type="number"
						placeholder="age"
						{...matchCustomInput(form.get('user.age'))}
					/>
				</div>

				<div>
					<button disabled={!form.modified} onClick={handleSave}>
						Save
					</button>
				</div>
			</div>
			<div style={{ flex: 1, position: 'relative' }}>
				<textarea
					ref={textareaRef}
					style={{
						width: '100%',
						height: 500,
						fontSize: 12
					}}
					readOnly
					defaultValue={JSON.stringify(form.toJSON(), null, 2)}
				/>
			</div>
		</div>
	)
}

export default BasicExample

const Input = ({ value, onChange, error, ...props }) => (
	<input
		{...props}
		defaultValue={value}
		onChange={e => {
			onChange(e.target.value)
		}}
		style={{
			border: error ? `1px solid red` : `1px solid #dddddd`
		}}
	/>
)
