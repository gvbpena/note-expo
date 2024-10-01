// image_service.ts

import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

// Function to upload multiple images to Firebase Storage
const uploadImages = async (imageUris: string[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    const promises = imageUris.map(async (uri) => {
        // Fetch the image as a blob from the URI
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create a storage reference for the image
        const imageRef = ref(storage, `images/${new Date().getTime()}_${uri.split("/").pop()}`); // Ensure unique names
        await uploadBytes(imageRef, blob); // Upload the image blob
        const downloadURL = await getDownloadURL(imageRef); // Get the download URL
        imageUrls.push(downloadURL); // Add the URL to the array
    });

    await Promise.all(promises); // Wait for all uploads to complete
    return imageUrls; // Return the array of download URLs
};

// Function to delete an image from Firebase Storage
const deleteImage = async (imagePath: string): Promise<void> => {
    const imageRef = ref(storage, imagePath); // Create a storage reference for the image
    await deleteObject(imageRef); // Delete the image
};

// Export the functions
export { uploadImages, deleteImage };
