import { Hono } from 'hono'
import { logger } from 'hono/logger'

type Bindings = {
	MY_WEBSITE: Fetcher
}
const app = new Hono<{ Bindings: Bindings }>()

app.use(logger())

async function putInCache(fetcher: Fetcher, url: string) {
	const request = new Request(url)
	const cachedResponse = await caches.default.match(request)
	if (cachedResponse) {
		return cachedResponse
	}
	const response = await fetcher.fetch(request)
	await caches.default.put(request, response)
}

class UserElementHandler {
	async element(element: Element) {
		element.onEndTag((endTag) => {
			endTag.before(`
<script type="speculationrules">
  {
    "prerender": [
      {
        "urls": ["news", "films"]
      }
    ]
  }
</script>
`, {
				html: true,
			})
		})
	}
}

app.get('/*', async (c) => {
	const fetcher = c.env.MY_WEBSITE

	const requestUrl = new URL(c.req.raw.url)
	if (requestUrl.pathname === '/') {
		c.executionCtx.waitUntil((async function () {
			await putInCache(fetcher, '/api/films')
			await putInCache(fetcher, '/api/news')
		})())
	}

	let response = await caches.default.match(c.req.raw)
	if (!response) {
		response = await fetcher.fetch(c.req.url)
		await caches.default.put(c.req.raw, response.clone())	
	}

	if (requestUrl.pathname === '/') {
		return new HTMLRewriter()
			.on('body', new UserElementHandler())
			.transform(response);
	}

	return response
})

export default app
