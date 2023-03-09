import { format } from "date-fns";

import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";

const BUCKET_URL = "gs://expense-tracker-5c6c8.appspot.com";

export async function uploadImage(image, uid) {
  const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const bucket = `${BUCKET_URL}/${uid}/${formattedDate}.jpg`;

  // Reference to the folder where the files are stored.
  const storageRef = ref(storage, bucket);

  await uploadBytes(storageRef, image);
  return bucket;
}
