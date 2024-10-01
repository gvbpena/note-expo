// image_service.ts

import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

// Function to upload multiple images to Firebase Storage
const uploadImages = async (imageUris: string[]): Promise<string[]> => {
    const imageUrls: string[] = [];
    const promises = imageUris.map(async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const imageRef = ref(storage, `images/${new Date().getTime()}_${uri.split("/").pop()}`);
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        imageUrls.push(downloadURL);
    });

    await Promise.all(promises);
    return imageUrls;
};

const deleteImage = async (imagePath: string): Promise<void> => {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
};

export { uploadImages, deleteImage };
