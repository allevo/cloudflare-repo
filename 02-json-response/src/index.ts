
export default {
	async fetch(request, env, ctx): Promise<Response> {
		return Response.json({
			env: env,
			cf: request.cf,
		});
	},
} satisfies ExportedHandler<Env>;

