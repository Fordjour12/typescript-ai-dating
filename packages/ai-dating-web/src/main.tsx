import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
import App from './App'
import LoginPage from './components/Pages/LoginPage'
import SignUpPage from './components/Pages/SignupPage'
import './index.css'
import Root from './Root'

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path='/'
			element={<Root />}>
			<Route
				index
				element={<App />}
			/>
			<Route
				path='login'
				element={<LoginPage />}
			/>
			<Route
				path='signup'
				element={<SignUpPage />}
			/>
		</Route>
	)
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
