const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const User = require('../models/user')

const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
    	.find({})
		.populate('user', { username: 1, name: 1 })

	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog
    	.findById(request.params.id)

	response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body

	console.log(body)
	//const token = getTokenFrom(request)
	console.log(request.token)
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: "token missing or invalid"} )
	}

	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user.username
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	
	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
	
	//console.log(request.token)
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: "token missing or invalid"} )
	}

	const blog = await Blog.findById(request.params.id)
	const user = await User.findById(decodedToken.id)

	//console.log(blog.user.toString())
	//console.log(user.id.toString())

	if ( blog.user.toString() === user.id.toString() )
	{
		await Blog.findByIdAndRemove(request.params.id)
		response.status(200).json({ response: 'blog post successfully deleted'}).end()
	} else {
		response.status(401).json({ response: 'only the author of the blog post can delete a post'}).end()
	}
})

module.exports = blogsRouter