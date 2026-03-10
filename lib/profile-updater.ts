export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/profile/updateAvatar", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ url: string }>;
}