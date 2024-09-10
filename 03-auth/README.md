# 02 - auth

In this example, the API is protected by a secret key. The worker checks the request for the secret key and returns a 401 status code if the key is not present or incorrect.

- Run `npm run dev` in your terminal to start a development server
- Open a browser tab at http://localhost:8787/ to see your worker in action
- Run `npm run deploy` to publish your worker


## Local test

```bash
curl http://localhost:8787
curl http://localhost:8787 -H'Authorization: wrong-key'
curl http://localhost:8787 -H'Authorization: this-is-a-secret'
```