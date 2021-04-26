import {
	TFormDataArrayNode,
	TFormDataNode,
	TFormDataObjectNode,
	TFormDataValueNode,
	TFormNodePath,
	TFormParams,
	TFormTools,
	TValueFormSchemaNode
} from '../useForm.types'

import formGetter from './formGetter/formGetter'

import { getObjectPathChild, mergePaths } from '../utils/formPath'

/**
 * Recursively check errors.
 * Each nodes with error, or with child in error get node.__error=true.
 *
 * For example :
 *   { user: { name: textField() } }
 *
 * If name has an error, each nodes [user] and [name] will get __error=true.
 */
const checkErrors = (
	formTools: TFormTools,
	formParams: TFormParams,
	formDataRef: React.MutableRefObject<TFormDataNode>
) => {
	const checkObjectNodeError = (
		node: TFormDataObjectNode,
		path: TFormNodePath
	) => {
		let hasError = false

		for (const [key, child] of Object.entries(node.__children)) {
			if (!checkNodeError(child, mergePaths([path, [key]]))) {
				hasError = true
			}
		}

		node.__error = hasError
		return !hasError
	}

	const checkArrayNodeError = (
		node: TFormDataArrayNode,
		path: TFormNodePath
	) => {
		let hasError = false

		for (const [index, child] of node.__children.entries()) {
			if (!checkNodeError(child, mergePaths([path, [`${index}`]]))) {
				hasError = true
			}
		}

		node.__error = hasError
		return !hasError
	}

	const getIsRequired = ({ params, path }) => {
		if (params.required) {
			if (typeof params.required === 'function') {
				return params.required(
					formGetter({
						formDataRef,
						path,
						formParams,
						formTools
					})
				)
			}
			return true
		}
		return false
	}

	const checkValueNodeError = (
		node: TFormDataValueNode,
		path: TFormNodePath
	) => {
		const params = (node.__schema as TValueFormSchemaNode).__params

		const isRequired = getIsRequired({ params, path })

		if (!isRequired && [null, undefined, ''].includes(node.__value)) {
			node.__error = false
			return true
		}

		if (params.validation) {
			const isValid = params.validation(node.__value, p => {
				return getObjectPathChild(
					formDataRef.current,
					mergePaths([path, p]),
					{}
				)
			})

			if (!isValid) {
				node.__error = true
				return false
			}
		} else if (params.validators?.length) {
			for (const validator of params.validators) {
				if (!validator(node.__value)) {
					node.__error = true
					return false
				}
			}
		} else {
			if (node.__type === 'string') {
				if ([null, undefined, ''].includes(node.__value)) {
					node.__error = true
					return false
				}
			} else if (node.__type === 'number') {
				if (parseFloat(node.__value) === NaN) {
					node.__error = true
					return false
				}
			}
		}

		node.__error = false

		return true
	}

	const checkNodeError = (node: TFormDataNode, path: TFormNodePath) => {
		switch (node.__node) {
			case 'object':
				return checkObjectNodeError(node, path)
			case 'array':
				return checkArrayNodeError(node, path)
			case 'value':
				return checkValueNodeError(node, path)
		}
		return true
	}

	return checkNodeError(formDataRef.current, [])
}

export default checkErrors
