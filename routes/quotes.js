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
		res.render('quotes', {quote: quotes[0].quote, author: author})
	})
	.catch(function (error) {
		console.log(error);
	})
})

module.exports = router