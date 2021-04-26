import { getObjectPathChild } from '../../utils/formPath'

import arrayGetter from './arrayGetter'
import objectGetter from './objectGetter'
import valueGetter from './valueGetter'

import { TGetterProps } from './formGetter.types'

const formGetter = ({
	formDataRef,
	path,
	formTools,
	formParams
}: TGetterProps) => {
	const child = getObjectPathChild(formDataRef.current, path, formParams)

	const getterProps: TGetterProps = {
		formDataRef,
		path,
		formTools,
		formParams
	}

	if (child.__node === 'value') return valueGetter(getterProps)
	if (child.__node === 'array') return arrayGetter(getterProps)
	if (child.__node === 'object') return objectGetter(getterProps)

	return {}
}

export default formGetter
