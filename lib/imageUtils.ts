export const cropImage = (imageSrc: string, cropArea: { x: number, y: number, width: number, height: number }): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Set canvas size to the crop area size
            canvas.width = cropArea.width;
            canvas.height = cropArea.height;

            // Draw the cropped image onto the canvas
            ctx.drawImage(
                image,
                cropArea.x,
                cropArea.y,
                cropArea.width,
                cropArea.height,
                0,
                0,
                cropArea.width,
                cropArea.height
            );

            // Convert canvas to base64 string
            const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
            resolve(croppedImage);
        };
        image.onerror = (error) => {
            reject(error);
        };
    });
};
