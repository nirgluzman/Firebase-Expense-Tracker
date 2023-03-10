import { format } from "date-fns";

import {
  ref,
  uploadBytes,
  getDownloadURL as getStorageDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase-config";

// Bucket URL from Storage in Firebase Console
const BUCKET_URL = "gs://expense-tracker-5c6c8.appspot.com";

// Uploads image and returns the storage bucket
export async function uploadImage(image, uid) {
  const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const bucket = `${BUCKET_URL}/${uid}/${formattedDate}.jpg`;

  // Reference to the folder where the files are stored.
  const storageRef = ref(storage, bucket);
  await uploadBytes(storageRef, image);
  return bucket;
}

// Gets the download URL from the reference URL
export async function getDownloadURL(bucket) {
  return await getStorageDownloadURL(ref(storage, bucket));
}

// Replaces existing image in storage and returns the storage bucket
export async function replaceImage(image, bucket) {
  const storageRef = ref(storage, bucket);
  await uploadBytes(storageRef, image);
}

// Deletes existing image in storage
export function deleteImage(bucket) {
  const storageRef = ref(storage, bucket);
  deleteObject(storageRef);
}
