/* eslint-disable react/button-has-type */
import React, { ReactNode } from 'react'

interface ButtonElement {
	children: ReactNode
	className: string
	type: 'button' | 'submit' | 'reset' | undefined
}

function Button({ children, className, type }: ButtonElement) {
	return (
		<button
			className={`${className}`}
			type={type}>
			{children}
		</button>
	)
}

export default Button
