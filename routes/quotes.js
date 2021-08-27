const express = require('express')
const axios = require('axios').default
const router = express.Router()

router.get('/random', (req, res) => {
	axios.get('https://quotes.rest/quote/random?language=en&limit=1', {
		headers: {'X-TheySaidSo-Api-Secret': 'u4THPP4vuzi5mkdw6zBqFAeF'}})
	.then(function (response) {
		const quotes = response.data.contents.quotes
		let author = quotes[0].author
		if (quotes[0].author == null) {
			author = "Unknown"
		}
		res.render('quotes', {header: "Here is a random quote", quote: quotes[0].quote, author: author})
	})
	.catch(function (error) {
		console.log(error);
	})
})
	
router.get('/qod', (req, res) => {
	axios.get('https://quotes.rest/qod?language=en', {
		headers: {'X-TheySaidSo-Api-Secret': 'u4THPP4vuzi5mkdw6zBqFAeF'}})
	.then(function (response) {
		const quotes = response.data.contents.quotes
		let author = quotes[0].author
		if (quotes[0].author == null) {
			author = "Unknown"
		}
		res.render('quotes', {header: "Here is the quote of the day", quote: quotes[0].quote, author: author})
	})
	.catch(function (error) {
		console.log(error);
	})
})
	
router.post('/add-quote', (req, res) => {
	//todo
	
	//the format to add a quote to our own private "stash" on the site
	//uses the following params format, not the usual post-body.
	
	//https://quotes.rest/quote?quote=spread%20love&author=me&tags=care%2C%20love&language=en
})

module.exports = router