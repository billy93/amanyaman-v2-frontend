import { useFormContext } from 'react-hook-form'
// import { ErrorMessage } from '../../components'
// import { CustomInputProps } from '../../types'

export const CustomSelect = ({ name, label, options, ...props }) => {
	const {
		register,
		formState: { errors }
	} = useFormContext()
    console.log('opt', options)
	const error = errors[name]?.message | undefined
	const id = `${name}-${props.type}-${label}`

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-4'>
				<label htmlFor={id}>{label}</label>
				<select {...register(name)} {...props} id={id} className='p-2 rounded flex-1 text-black'>
					<option value=''>--- Select option ---</option>
					{options &&
						options.map(({ desc, value }) => (
							<option key={value} value={value}>
								{desc}
							</option>
						))}
				</select>
			</div>
			{/* <ErrorMessage error={error} /> */}
		</div>
	)
}