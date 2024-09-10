import { Hono } from 'hono'
import { logger } from 'hono/logger'

type Bindings = {
	UPSTREAM_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(logger())
app.get('/proxy', (c) => fetch(new Request(`${c.env.UPSTREAM_URL}/todos`)))
app.get('/', (c) => c.json({ text: 'Hello, World!' }))

export default app
