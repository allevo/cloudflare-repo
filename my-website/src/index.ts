import { Hono } from 'hono'
import { logger } from 'hono/logger'
import news from './news'
import films from './films'

type Bindings = {}
const app = new Hono<{ Bindings: Bindings }>()

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

app.use(logger())
app.get('/', async (c) => {
	await sleep(1000)
	return c.html(`
<html>
		<head>
			<title>Amazing website</title>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
		</head>
		<body>
			<h1>Welcome to this amazing website</h1>
			<main>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur. Duis aute irure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur. Duis aute irure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur. Duis aute irure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</main>
			<div id="loading">Loading...</div>
			<div id="bottom" style="display: none">
				<section>
					<h2 style="display: inline">News</h2> <a href="/news">Read news</a>
					<ul id="news" style="display: flex; display: flex; margin-block: 0px; padding-inline: 0px; list-style: none; gap: 10px;">
					</ul>
				</section>
				<section>
					<h2 style="display: inline">Films</h2> <a href="/films">Read films</a>
					<ul id="films"style="display: flex; display: flex; margin-block: 0px; padding-inline: 0px; list-style: none; gap: 10px;">
					</ul>
				</section>
			</div>
			<script type="module">
				const req = await fetch('/api/home')
				const {news, films} = await req.json()

				const newsList = document.getElementById('news')
				news.forEach((n) => {
					const li = document.createElement('li')
					li.style.padding = '5px';
					li.style.border = '1px solid';
					li.style.borderRadius = '5px';
					li.style.maxHeight = '1.5rem';
					li.style.overflow = 'hidden';
					li.style.textOverflow = 'ellipsis';
					li.style.whiteSpace = 'nowrap';
					li.innerText = n.title
					newsList.appendChild(li)
				});

				const filmsList = document.getElementById('films')
				films.forEach((f) => {
					const li = document.createElement('li')
					li.style.padding = '5px';
					li.style.border = '1px solid';
					li.style.borderRadius = '5px';
					li.style.maxHeight = '1.5rem';
					li.style.overflow = 'hidden';
					li.style.textOverflow = 'ellipsis';
					li.style.whiteSpace = 'nowrap';
					li.innerText = f.title
					filmsList.appendChild(li)
				});

				const bottomSection = document.querySelector('#bottom')
				bottomSection.style.display = 'grid';
				bottomSection.style.gap = '20px';
				bottomSection.style.gridTemplateColumns = \`repeat(
					auto-fit,
					minmax(250px, 1fr)
				)\`;

				const loading = document.getElementById('loading')
				loading.remove();
			</script>
		</body>
</html>
`, {
	headers: {
		'Cache-Control': 'public, max-age=60',
	}
});
})

app.get('/news', async (c) => {
	await sleep(1000)
	return c.html(`
<html>
		<head>
			<title>News</title>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
		</head>
		<body>
			<a href="/">Back to home</a>
			<h1>News</h1>
			<div id="loading">Loading...</div>
			<ul id="news">
			</ul>
			<script type="module">
				const req = await fetch('/api/news')
				const news = await req.json()

				const newsList = document.getElementById('news')
				news.forEach((n) => {
					const li = document.createElement('li')
					li.innerText = n.title
					newsList.appendChild(li)
				});
				const loading = document.getElementById('loading')
				loading.remove();
			</script>
		</body>
</html>
`);
})

app.get('/films', async (c) => {
	await sleep(1000)
	return c.html(`
<html>
		<head>
			<title>Films</title>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
		</head>
		<body>
			<a href="/">Back to home</a>
			<h1>Films</h1>
			<div id="loading">Loading...</div>
			<ul id="films">
			</ul>
			<script type="module">
				const req = await fetch('/api/films')
				const films = await req.json()

				const filmsList = document.getElementById('films')
				films.forEach((f) => {
					const li = document.createElement('li')
					li.innerText = f.title
					filmsList.appendChild(li)
				});
				const loading = document.getElementById('loading')
				loading.remove();
			</script>
		</body>
</html>
`);
})

app.get('/api/home', async (c) => {
	await sleep(1000)

	const country = c.req.query('country')
	let newsToReturn = news
	if (country) {
		newsToReturn = newsToReturn.filter((n) => n.country === country)
	}
	let filmsToReturn = films
	const seen = c.req.query('seen')
	if (seen) {
		filmsToReturn = filmsToReturn.filter((f) => f.seen === (seen === 'true'))
	}

	return c.json({
		films: filmsToReturn.slice(0, 2),
		news: newsToReturn.slice(0, 2),
	})
})

app.get('/api/films', async (c) => {
	await sleep(1000)

	let filmsToReturn = films
	const category = c.req.query('category')
	const seen = c.req.query('seen')
	if (category) {
		filmsToReturn = filmsToReturn.filter((f) => f.category === category)
	}
	if (seen) {
		filmsToReturn = filmsToReturn.filter((f) => f.seen === (seen === 'true'))
	}

	return c.json(filmsToReturn)
})

app.get('/api/news', async (c) => {
	await sleep(1000)

	let newsToReturn = news
	const country = c.req.query('country')
	const category = c.req.query('category')
	if (country) {
		newsToReturn = newsToReturn.filter((n) => n.country === country)
	}
	if (category) {
		newsToReturn = newsToReturn.filter((n) => n.category === category)
	}

	return c.json(newsToReturn)
})

export default app
