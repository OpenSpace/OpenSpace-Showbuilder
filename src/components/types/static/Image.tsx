import ImageUpload from '@/components/common/ImageUpload';
import { Label } from '@/components/ui/label';
import { ImageComponent } from '@/store';
import React, { useEffect, useState } from 'react';

interface ImageGUIProps {
  component: ImageComponent;
}

const ImageGUIComponent: React.FC<ImageGUIProps> = ({ component }) => {
  return (
    <div
      className="absolute right-0 top-0 flex h-full w-full items-center justify-center hover:cursor-pointer"
      style={{
        //cover and center the background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${component.url})`,
      }}
    />
  );
};

interface ImageModalProps {
  component: ImageComponent | null;
  handleComponentData: (data: Partial<ImageComponent>) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  component,
  handleComponentData,
}) => {
  const [url, setUrl] = useState(component?.url || '');

  useEffect(() => {
    handleComponentData({ url });
  }, [url, handleComponentData]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <Label>Image</Label>
      <ImageUpload value={url} onChange={(v) => setUrl(v)} />
    </div>
  );
};

export { ImageModal, ImageGUIComponent };
