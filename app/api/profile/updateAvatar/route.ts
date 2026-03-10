//import { Ratelimit } from "@upstash/ratelimit";
//import { Redis } from "@upstash/redis";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { fileTypeFromBuffer } from "file-type";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PRIVATE_SUPABASE_API_KEY!
);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

/*
const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(5, "60 s"),
});
*/

export async function POST(req: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return new Response("Unauthorized", { status: 401 });

	//const { success } = await ratelimit.limit(session.user.id);
  	//if (!success) return new Response("Too many requests", { status: 429 });

	const formData = await req.formData();
	const file = formData.get("file") as File | null;
	if (!file) return new Response("No file provided", { status: 400 });

	if (file.size > MAX_SIZE) {
		return new Response("File exceeds 2MB limit", { status: 400 });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const detectedFileType = await fileTypeFromBuffer(buffer);
	if (!detectedFileType || !ALLOWED_TYPES.includes(detectedFileType.mime)) {
		return new Response("Invalid file type", { status: 400 });
	}

	const filePath = `${session.user.id}/avatar.${detectedFileType.ext}`;

	const { error: uploadError } = await supabase.storage
		.from("avatars")
		.upload(filePath, buffer, {
		upsert: true,
		contentType: detectedFileType.mime,
		});

	if (uploadError) {
		console.error(uploadError)
		return Response.json({ error: uploadError.message }, { status: 500 });
	}

	const { data: { publicUrl } } = supabase.storage
		.from("avatars")
		.getPublicUrl(filePath);

	await auth.api.updateUser({
		headers: await headers(),
		body: { image: publicUrl },
	});

	return Response.json({ url: publicUrl });
}