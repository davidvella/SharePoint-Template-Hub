import * as React from 'react';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { Link } from 'valuelink/lib';

export interface IFormTextFieldProps extends ITextFieldProps {
	valueLink: Link<any>;
}

export function FormTextField(props: IFormTextFieldProps) {
	const { valueLink } = props;
	return (
		<TextField
			{...props}
			value={String(valueLink.value)}
			onChanged={(newValue) => valueLink.set(newValue)}
			errorMessage={valueLink.error}
		/>
	);
}
