import { Link } from 'react-router-dom'

function App() {
	return (
		<>
			<header>
				<Link
					to='/login'
					className='mx-4'>
					signIn
				</Link>
				<Link to='/signup'>signUp</Link>
			</header>
			<div className='bg-black h-[90vh] text-yellow-500 grid place-items-center'>
				<p className='text-3xl font-extrabold'>App</p>
			</div>
		</>
	)
}

export default App
