export async function hashFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashAsArrayBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer);
  const hashAsString = Array.from(uint8ViewOfHash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashAsString;
}
