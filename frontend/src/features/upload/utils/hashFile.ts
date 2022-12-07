export async function hashFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashAsArrayBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  return window.btoa(String.fromCharCode(...new Uint8Array(hashAsArrayBuffer)));
}
