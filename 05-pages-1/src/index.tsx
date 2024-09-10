import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  const __html = JSON.stringify({
    "prerender": [
      {
        "source": "list",
        "urls": ["page1"]
      }
    ]
  })

  return c.html(
    `
    <html>
      <head>
        <title>index</title>
      </head>
      <body>
        <h1>index</h1>
        <p>
          <a href="/page1">page1</a>
        </p>
        <p>
          <a href="/page2">page2</a>
        </p>
        <script type="speculationrules">
          ${__html}
        </script>
      </body>
    </html>
    `
  )
})
app.get('/page1', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return c.render(
    <>
      <h1>page1</h1>
      <a href="/">index</a>
    </>)
})
app.get('/page2', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return c.render(
    <>
      <h1>page2</h1>
      <a href="/">index</a>
    </>)
})

export default app
