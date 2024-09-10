
export default {
	async fetch(request, env, ctx): Promise<Response> {
		const apiSecret = env.API_SECRET

		if (request.headers.get('Authorization') !== apiSecret) {
			return Response.json({
				auth: false
			}, {
				status: 401
			});
		}

		return Response.json({
			auth: true,
		});
	},
} satisfies ExportedHandler<Env>;
