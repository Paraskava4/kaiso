/*
 * Common image utilities
 * - Auto-convert PNG/JPG/JPEG to WebP in the browser
 * - Optional resize and quality controls
 */

/**
 * Read a File/Blob into an HTMLImageElement
 */
const loadImageFromFile = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

/**
 * Draw an image to a canvas with optional max width/height constraints
 */
const drawToCanvas = (image, { maxWidth, maxHeight } = {}) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    let targetWidth = image.width;
    let targetHeight = image.height;

    if (maxWidth || maxHeight) {
        const ratio = image.width / image.height;
        if (maxWidth && targetWidth > maxWidth) {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth / ratio);
        }
        if (maxHeight && targetHeight > maxHeight) {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * ratio);
        }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    return canvas;
};

/**
 * Convert a canvas to a WebP Blob
 */
const canvasToWebPBlob = (canvas, quality = 0.8) =>
    new Promise((resolve, reject) => {
        if (!('toBlob' in canvas)) {
            try {
                const dataUrl = canvas.toDataURL('image/webp', quality);
                const byteString = atob(dataUrl.split(',')[1]);
                const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                resolve(new Blob([ab], { type: mimeString }));
            } catch (e) {
                reject(e);
            }
            return;
        }
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('WebP conversion failed'))),
            'image/webp',
            quality
        );
    });

/**
 * Create a File from a Blob
 */
const fileFromBlob = (blob, name) => {
    const fileName = name.replace(/\.(png|jpg|jpeg)$/i, '') + '.webp';
    try {
        return new File([blob], fileName, { type: 'image/webp' });
    } catch (_) {
        // Safari < 14 fallback
        blob.name = fileName;
        return blob;
    }
};

/**
 * Ensure a File is WebP (PNG/JPG/JPEG -> WebP). Returns the new File/Blob.
 * Options: { quality: 0..1, maxWidth, maxHeight }
 */
export const ensureWebP = async (file, options = {}) => {
    const { quality = 0.8, maxWidth, maxHeight } = options;
    if (!file || !(file instanceof Blob)) return file;

    const type = (file.type || '').toLowerCase();
    const isImage = type.startsWith('image/');
    const alreadyWebP = type === 'image/webp';

    if (!isImage || alreadyWebP) return file;

    // Only convert PNG/JPEG variants
    if (!/(png|jpg|jpeg)/i.test(type)) return file;

    // Feature detect WebP support
    const webpSupported = await (async () => {
        try {
            const c = document.createElement('canvas');
            return c.toDataURL('image/webp').startsWith('data:image/webp');
        } catch (_) {
            return false;
        }
    })();
    if (!webpSupported) return file; // fallback: do not convert

    const image = await loadImageFromFile(file);
    const canvas = drawToCanvas(image, { maxWidth, maxHeight });
    const webpBlob = await canvasToWebPBlob(canvas, quality);
    return fileFromBlob(webpBlob, file.name || 'image');
};

/**
 * Convert an array/FileList to WebP where applicable
 */
export const ensureWebPForFiles = async (files, options = {}) => {
    const arr = Array.from(files || []);
    const converted = await Promise.all(arr.map((f) => ensureWebP(f, options)));
    return converted;
};

/**
 * Example integration helper for input[type=file] change handler
 */
export const handleFileInputToWebP = async (event, options = {}) => {
    const input = event?.target;
    if (!input || !input.files) return [];
    const converted = await ensureWebPForFiles(input.files, options);
    return converted;
};

export default {
    ensureWebP,
    ensureWebPForFiles,
    handleFileInputToWebP,
};


