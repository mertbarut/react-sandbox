import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import loginService from './services/login'
import changePerson from './services/changePerson'
import Notification from './components/Notification'
import axios from 'axios'

import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [newFilter, setFilter] = useState('')
	const [errorMessage, setErrorMessage] = useState(null)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [blogs, setBlogs] = useState([])

	useEffect(() => {
		console.log('effect')
		axios
		  .get('/api/persons')
		  .then(response => {
			console.log('promise fulfilled')
			setPersons(response.data)
		  })
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			changePerson.setToken(user.token)
		}
	}, [])

	useEffect( async () => {
		const blogs = await blogService.getAll()

		setBlogs(blogs)
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username, password,
			})
			console.log(user)
			
			window.localStorage.setItem(
				'loggedAppUser', JSON.stringify(user)
			)

			changePerson.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
			} catch (exception) {
			setErrorMessage('Wrong Credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
		//console.log('logging in with', username, password)
	}

	const loginForm = () => (
		<form onSubmit={handleLogin}>
		<div>
			username
			<input
			type="text"
			value={username}
			name="Username"
			onChange={({target}) => setUsername(target.value)}
			/>
		</div>
		<div>
		password
			<input
			type="password"
			value={password}
			name="Password"
			onChange={({target}) => setPassword(target.value)}
			/>
		</div>
		<div>
			<button type="submit">login</button>
		</div>
		</form>
	)

	const personForm = () => (
		<PersonForm
		persons={persons}
		setPersons={setPersons}
		filter={newFilter}
		setFilter={setFilter}
		newName={newName}
		setNewName={setNewName}
		newNumber={newNumber}
		setNewNumber={setNewNumber}
		setErrorMessage={setErrorMessage}
		/>
	)

	return (
		<div>
			<h1>Phonebook</h1>
			<Notification message={errorMessage} />
			{user === null
				? loginForm()
				: 
				<div>
					<p>{user.name} logged-in</p>
					{personForm()}
				</div>
				}
			<h2>Numbers</h2>
			<Persons
				persons={persons}
				filter={newFilter}
				setPersons={setPersons}
			/>
			<div>
				<h2>blogs</h2>
				{blogs.map(blog =>
					<Blog key={blog.id} blog={blog} />
				)}
			</div>
		</div>
	)
}

export default App