import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Upload,
  Camera,
  Crop,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_CONFIG } from '@/lib/constants';

interface ImageCropperProps {
  onImageSelect: (file: File) => void;
  onImageCropped: (file: File) => void;
  selectedImage?: File | null;
  className?: string;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onImageSelect,
  onImageCropped,
  selectedImage,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cropData, setCropData] = useState<CropData>({
    x: 0,
    y: 0,
    width: 150,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImageUrl(url);
      setIsOpen(true);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedImage]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      // Validate file size
      if (file.size > IMAGE_CONFIG.MAX_SIZE) {
        alert('File size must be less than 5MB');
        return;
      }

      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type));

    if (imageFile) {
      if (imageFile.size > IMAGE_CONFIG.MAX_SIZE) {
        alert('File size must be less than 5MB');
        return;
      }
      onImageSelect(imageFile);
    } else {
      alert('Please drop a valid image file (JPEG, PNG, WebP)');
    }
  }, [onImageSelect]);

  const handleCropStart = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) return;

    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - cropData.x,
        y: e.clientY - rect.top - cropData.y,
      });
    }
  }, [cropData]);

  const handleCropMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    const maxX = rect.width - cropData.width;
    const maxY = rect.height - cropData.height;

    setCropData(prev => ({
      ...prev,
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    }));
  }, [isDragging, dragStart, cropData.width, cropData.height]);

  const handleCropEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetCrop = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const aspectRatio = IMAGE_CONFIG.CROP_ASPECT_RATIO;

      let width = Math.min(rect.width * 0.6, 200);
      let height = width / aspectRatio;

      if (height > rect.height * 0.8) {
        height = rect.height * 0.8;
        width = height * aspectRatio;
      }

      setCropData({
        x: (rect.width - width) / 2,
        y: (rect.height - height) / 2,
        width,
        height,
      });
    }
  }, []);

  const handleScale = useCallback((newScale: number) => {
    setScale(Math.max(0.5, Math.min(3, newScale)));
  }, []);

  const handleRotation = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const applyCrop = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const { x, y, width, height } = cropData;

    // Set canvas size
    canvas.width = IMAGE_CONFIG.PREVIEW_SIZE.width;
    canvas.height = IMAGE_CONFIG.PREVIEW_SIZE.height;

    // Calculate scale factors
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Draw cropped image
    ctx.drawImage(
      img,
      x * scaleX,
      y * scaleY,
      width * scaleX,
      height * scaleY,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', {
            type: 'image/jpeg',
          });
          onImageCropped(file);
          setIsOpen(false);
        }
      },
      'image/jpeg',
      IMAGE_CONFIG.QUALITY
    );
  }, [imageUrl, cropData, scale, rotation, onImageCropped]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setImageUrl(null);
    setScale(1);
    setRotation(0);
    setCropData({ x: 0, y: 0, width: 150, height: 200 });
  }, []);

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Image Upload Area */}
        <div
          className="image-upload-area cursor-pointer"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            {selectedImage ? (
              <div className="space-y-2">
                <Camera className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-sm font-medium text-gray-700">
                  Image Selected
                </p>
                <p className="text-xs text-gray-500">
                  Click to change or crop image
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-sm font-medium text-gray-700">
                  Upload Staff Photo
                </p>
                <p className="text-xs text-gray-500">
                  Drag & drop or click to select
                </p>
                <p className="text-xs text-gray-400">
                  Max 5MB • JPEG, PNG, WebP
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedImage && (
          <div className="flex justify-center">
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="btn-modern"
            >
              <Crop className="h-4 w-4 mr-2" />
              Crop Image
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_CONFIG.ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Crop Dialog */}
      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Crop Staff Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Crop Controls */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleScale(scale - 0.1)}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleScale(scale + 0.1)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRotation}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Rotate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetCrop}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Crop Area */}
            <div
              ref={containerRef}
              className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50"
              style={{ height: '400px' }}
              onMouseMove={handleCropMove}
              onMouseUp={handleCropEnd}
              onMouseLeave={handleCropEnd}
            >
              {imageUrl && (
                <>
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Crop preview"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                    }}
                    draggable={false}
                  />

                  {/* Crop Overlay */}
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
                    style={{
                      left: cropData.x,
                      top: cropData.y,
                      width: cropData.width,
                      height: cropData.height,
                    }}
                    onMouseDown={handleCropStart}
                  >
                    {/* Corner handles */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize" />

                    {/* Grid lines */}
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-blue-500/50" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-blue-500/50" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-blue-500/50" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-blue-500/50" />
                  </div>

                  {/* Dark overlay */}
                  <div
                    className="absolute inset-0 bg-black/50"
                    style={{
                      clipPath: `polygon(0 0, ${cropData.x}px 0, ${cropData.x}px 100%, 0 100%), polygon(${cropData.x + cropData.width}px 0, 100% 0, 100% 100%, ${cropData.x + cropData.width}px 100%), polygon(${cropData.x}px 0, ${cropData.x + cropData.width}px 0, ${cropData.x + cropData.width}px ${cropData.y}px, ${cropData.x}px ${cropData.y}px), polygon(${cropData.x}px ${cropData.y + cropData.height}px, ${cropData.x + cropData.width}px ${cropData.y + cropData.height}px, ${cropData.x + cropData.width}px 100%, ${cropData.x}px 100%)`,
                    }}
                  />
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeDialog}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={applyCrop}
                className="btn-modern"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Crop
              </Button>
            </div>
          </div>

          {/* Hidden canvas for crop processing */}
          <canvas
            ref={canvasRef}
            className="hidden"
            width={IMAGE_CONFIG.PREVIEW_SIZE.width}
            height={IMAGE_CONFIG.PREVIEW_SIZE.height}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCropper;