import functions, { logger } from "firebase-functions";
import vision from "@google-cloud/vision";
import admin from "firebase-admin";

export const RECEIPT_COLLECTION = "receipts";

admin.initializeApp();
export const readReceiptDetails = functions.storage
  .object()
  .onFinalize(async (object) => {
    const imageBucket = `gs://${object.bucket}/${object.name}`;
    const client = new vision.ImageAnnotatorClient();

    const [textDetections] = await client.textDetection(imageBucket);
    const [annotation] = textDetections.textAnnotations;
    const text = annotation ? annotation.description : "";
    logger.log(text);

    // // Parse text

    // Get user ID
    // object.name is userID/timestamp
    const re = /(.*)\//;
    const uid = re.exec(object.name)[1];

    // Going to hardcode returned text for relevant fields
    const receipt = {
      address: "123 Happy St, Bestcity, World 67890",
      amount: "23.45",
      date: new Date(),
      imageBucket,
      items: "best appetizer, best main dish, best dessert",
      locationName: "Best Restaurant",
      uid,
      isConfirmed: false,
    };

    admin.firestore().collection(RECEIPT_COLLECTION).add(receipt);
  });
