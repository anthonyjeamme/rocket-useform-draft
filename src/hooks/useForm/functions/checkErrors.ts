import {
	TFormDataArrayNode,
	TFormDataNode,
	TFormDataObjectNode,
	TFormDataValueNode,
	TFormNodePath,
	TValueFormSchemaNode
} from '../useForm.types'

import { getObjectPathChild, mergePaths } from '../utils/formPath'

const checkErrors = (formDataRef: React.MutableRefObject<TFormDataNode>) => {
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

	const checkValueNodeError = (
		node: TFormDataValueNode,
		path: TFormNodePath
	) => {
		const params = (node.__schema as TValueFormSchemaNode).__params

		if (params.required) {
			switch (node.__type) {
				case 'string':
					if (!node.__value) {
						node.__error = true
						return false
					}
					break
			}
		}

		if (params.validation) {
			const isValid = params.validation(node.__value, p => {
				return getObjectPathChild(
					formDataRef.current,
					mergePaths([path, [p]]),
					{}
				)
			})

			if (!isValid) {
				node.__error = true
				return false
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
