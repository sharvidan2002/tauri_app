import { useState, useCallback } from 'react';
import { ImageCropData } from '@/types/common';
import { IMAGE_CONFIG } from '@/lib/constants';
import { isImageFile, compressImage } from '@/lib/utils';

interface CropState {
  isOpen: boolean;
  originalImage: string | null;
  croppedImage: string | null;
  cropData: ImageCropData | null;
  isLoading: boolean;
  error: string | null;
}

export function useImageCrop() {
  const [cropState, setCropState] = useState<CropState>({
    isOpen: false,
    originalImage: null,
    croppedImage: null,
    cropData: null,
    isLoading: false,
    error: null,
  });

  const openCropDialog = useCallback((imageFile: File) => {
    // Validate file
    if (!isImageFile(imageFile)) {
      setCropState(prev => ({
        ...prev,
        error: 'Please select a valid image file (JPEG, PNG, WebP)',
      }));
      return;
    }

    if (imageFile.size > IMAGE_CONFIG.MAX_SIZE) {
      setCropState(prev => ({
        ...prev,
        error: 'File size must be less than 5MB',
      }));
      return;
    }

    setCropState(prev => ({ ...prev, isLoading: true, error: null }));

    // Create image URL
    const imageUrl = URL.createObjectURL(imageFile);

    setCropState(prev => ({
      ...prev,
      isOpen: true,
      originalImage: imageUrl,
      croppedImage: null,
      cropData: null,
      isLoading: false,
    }));
  }, []);

  const closeCropDialog = useCallback(() => {
    // Cleanup object URLs
    if (cropState.originalImage) {
      URL.revokeObjectURL(cropState.originalImage);
    }
    if (cropState.croppedImage) {
      URL.revokeObjectURL(cropState.croppedImage);
    }

    setCropState({
      isOpen: false,
      originalImage: null,
      croppedImage: null,
      cropData: null,
      isLoading: false,
      error: null,
    });
  }, [cropState.originalImage, cropState.croppedImage]);

  const updateCropData = useCallback((cropData: ImageCropData) => {
    setCropState(prev => ({ ...prev, cropData }));
  }, []);

  const applyCrop = useCallback(async (): Promise<File | null> => {
    if (!cropState.originalImage || !cropState.cropData) {
      return null;
    }

    setCropState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const croppedFile = await cropImage(
        cropState.originalImage,
        cropState.cropData
      );

      const croppedImageUrl = URL.createObjectURL(croppedFile);

      setCropState(prev => ({
        ...prev,
        croppedImage: croppedImageUrl,
        isLoading: false,
      }));

      return croppedFile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to crop image';
      setCropState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      return null;
    }
  }, [cropState.originalImage, cropState.cropData]);

  const resetCrop = useCallback(() => {
    if (cropState.croppedImage) {
      URL.revokeObjectURL(cropState.croppedImage);
    }

    setCropState(prev => ({
      ...prev,
      croppedImage: null,
      cropData: null,
      error: null,
    }));
  }, [cropState.croppedImage]);

  const compressAndCrop = useCallback(async (
    file: File,
    cropData?: ImageCropData
  ): Promise<File> => {
    let processedFile = file;

    // First compress if needed
    if (file.size > IMAGE_CONFIG.MAX_SIZE / 2) {
      const compressed = await compressImage(
        file,
        IMAGE_CONFIG.PREVIEW_SIZE.width,
        IMAGE_CONFIG.QUALITY
      );
      processedFile = new File([compressed], file.name, { type: file.type });
    }

    // Then crop if crop data is provided
    if (cropData) {
      const imageUrl = URL.createObjectURL(processedFile);
      try {
        const croppedFile = await cropImage(imageUrl, cropData);
        URL.revokeObjectURL(imageUrl);
        return croppedFile;
      } catch (error) {
        URL.revokeObjectURL(imageUrl);
        throw error;
      }
    }

    return processedFile;
  }, []);

  return {
    ...cropState,
    openCropDialog,
    closeCropDialog,
    updateCropData,
    applyCrop,
    resetCrop,
    compressAndCrop,
  };
}

async function cropImage(
  imageSrc: string,
  cropData: ImageCropData
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Unable to get canvas context'));
        return;
      }

      // Calculate crop dimensions
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropX = cropData.x * scaleX;
      const cropY = cropData.y * scaleY;
      const cropWidth = cropData.width * scaleX;
      const cropHeight = cropData.height * scaleY;

      // Set canvas size to desired output size
      const outputWidth = IMAGE_CONFIG.PREVIEW_SIZE.width;
      const outputHeight = IMAGE_CONFIG.PREVIEW_SIZE.height;

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Draw cropped image
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );

      // Convert to blob and then to file
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.jpg', {
              type: 'image/jpeg',
            });
            resolve(file);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/jpeg',
        IMAGE_CONFIG.QUALITY
      );
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    image.src = imageSrc;
  });
}

// Simple crop component hook for basic cropping functionality
export function useSimpleCrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 250,
  });

  const startDrag = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const onDrag = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - cropArea.width / 2;
    const y = e.clientY - rect.top - cropArea.height / 2;

    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, rect.width - prev.width)),
      y: Math.max(0, Math.min(y, rect.height - prev.height)),
    }));
  }, [isDragging, cropArea.width, cropArea.height]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resizeCrop = useCallback((width: number, height: number) => {
    setCropArea(prev => ({ ...prev, width, height }));
  }, []);

  const resetCrop = useCallback((containerWidth: number, containerHeight: number) => {
    const aspectRatio = IMAGE_CONFIG.CROP_ASPECT_RATIO;
    let width = Math.min(containerWidth * 0.8, 200);
    let height = width / aspectRatio;

    if (height > containerHeight * 0.8) {
      height = containerHeight * 0.8;
      width = height * aspectRatio;
    }

    setCropArea({
      x: (containerWidth - width) / 2,
      y: (containerHeight - height) / 2,
      width,
      height,
    });
  }, []);

  const getCropData = useCallback(
    (): ImageCropData => {
      return {
        x: cropArea.x,
        y: cropArea.y,
        width: cropArea.width,
        height: cropArea.height,
        unit: 'px',
        aspect: IMAGE_CONFIG.CROP_ASPECT_RATIO,
      };
    },
    [cropArea]
  );

  return {
    cropArea,
    isDragging,
    startDrag,
    onDrag,
    endDrag,
    resizeCrop,
    resetCrop,
    getCropData,
  };
}