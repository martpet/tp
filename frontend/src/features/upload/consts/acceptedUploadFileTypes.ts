import { isWebKit } from '@react-aria/utils';

export const acceptedUploadFileTypes = ['image/jpeg'];

if (!isWebKit) {
  // Add `heic` files to allowed files for selecting from computer.
  // Heic files will be converted with `heic2any` before upload starts.

  // Safari should not be allowed to select heic files. Instead it treats heic as jpeg
  // and automatically converts them to jpeg when selected.
  acceptedUploadFileTypes.push('image/heic');
}
