import { useRef, useState } from 'react'
import checkErrors from './functions/checkErrors'

import arrayGetter from './functions/formGetter/arrayGetter'
import objectGetter from './functions/formGetter/objectGetter'
import valueGetter from './functions/formGetter/valueGetter'

import formGetter from './functions/formGetter/formGetter'

import { formNodeToJSON } from './functions/formNodeToJSON'
import { generateFormData } from './functions/generateFormNode'
import { useRefresh } from './functions/misc'
import {
	TForm,
	TFormArrayGetter,
	TFormDataNode,
	TFormNodePath,
	TFormObjectGetter,
	TFormParams,
	TFormSchema,
	TFormTools,
	TFormValueGetter
} from './useForm.types'

export function useForm<T = any>(
	data: T,
	schema: TFormSchema,
	formParams?: TFormParams
): TForm {
	const [modified, setModified] = useState<boolean>(false)
	const refresh = useRefresh()
	const generateId = useIdGenerator()

	const formTools: TFormTools = {
		handleModified: () => {
			setModified(true)
		},
		refresh,
		generateId
	}

	const formDataRef = useRef<TFormDataNode>(
		generateFormData(data, schema, [], formTools)
	)

	// useEffect(() => {
	// 	const json = formNodeToJSON(formDataRef.current)
	// 	formDataRef.current = generateFormData(json, schema, [], formTools)

	// 	console.log(schema, 'updated')
	// }, [schema])

	const toJSON = () => formNodeToJSON(formDataRef.current)

	const getterProps = path => ({
		formDataRef,
		path,
		formTools,
		formParams
	})

	const checkForm = () => {
		const isOk = checkErrors(formDataRef)
		console.log({ isOk })
		refresh()
		return isOk
	}

	const get = (path: TFormNodePath) =>
		formGetter({ formDataRef, path, formTools, formParams })

	const getObject = (path: TFormNodePath) =>
		objectGetter(getterProps(path)) as TFormObjectGetter

	const getArray = (path: TFormNodePath) =>
		arrayGetter(getterProps(path)) as TFormArrayGetter

	const getValue = (path: TFormNodePath) =>
		valueGetter(getterProps(path)) as TFormValueGetter

	return {
		toJSON,
		modified,
		setModified,
		checkForm,

		// Getters
		get,
		getObject,
		getArray,
		getValue
	}
}

const useIdGenerator = () => {
	const idCountRef = useRef<number>(0)

	const generateId = () => {
		return (idCountRef.current++).toString()
	}

	return generateId
}
