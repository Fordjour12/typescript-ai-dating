import { Resolver, useForm } from 'react-hook-form'

interface InputElement {
	labelFor: string
	inputType: string
	inputPlaceholder: string
	inputName: string
}

interface InputValues {
	inputType: string
}

const resolver: Resolver<InputValues> = async (values) => ({
	values: values.inputType ? values : {},
	errors: !values.inputType
		? {
				inputType: {
					type: 'required',
					message: 'this is required field',
				},
		  }
		: {},
})

function Input({
	labelFor,
	inputType,
	inputPlaceholder,
	inputName,
}: InputElement) {
	const {
		register,
		formState: { errors },
	} = useForm<InputValues>({ resolver })
	return (
		<label htmlFor={labelFor}>
			<p className='text-white font-bold'>{inputName}</p>
			<input
				className='input'
				{...register('inputType')}
				type={inputType}
				placeholder={inputPlaceholder}
			/>
			{errors?.inputType && <p>{errors.inputType.message}</p>}
		</label>
	)
}

export default Input
