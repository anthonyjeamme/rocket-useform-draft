import {
	TFormDataValueNode,
	TFormValueGetter,
	TValueFormSchemaNode
} from '../../useForm.types'

import { getObjectPathChild, pathToStringPath } from '../../utils/formPath'
import { getGetterGenericFields } from './formGetter.common'
import { TGetterProps } from './formGetter.types'

const valueGetter = ({
	formDataRef,
	path,
	formTools,
	formParams
}: TGetterProps): TFormValueGetter => {
	const child = getObjectPathChild(formDataRef.current, path, formParams)
	if (child.__node !== 'value') {
		console.error(`${pathToStringPath(path)} is not a value`)
		return null
	}

	const update = (value, refresh = false) => {
		const child = getObjectPathChild(
			formDataRef.current,
			path,
			formParams
		) as TFormDataValueNode

		const params = (child.__schema as TValueFormSchemaNode).__params

		if (params.readOnly) {
			console.error(`Can't write ${pathToStringPath(path)} : readOnly field`)
			return
		}

		child.__value = value
		formTools.handleModified()
		if (refresh || params.autoRefresh) formTools.refresh()
	}

	return {
		...getGetterGenericFields({ formDataRef, child, path, formParams }),
		value: child.__value,
		update
	}
}

export default valueGetter
