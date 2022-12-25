import { DragEventHandler, ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};

export function DropZone({ children }: Props) {
  const isUploading = false; // todo: select from store
  const [isOnTarget, setOnTarget] = useState(false);

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (!isOnTarget) {
      setOnTarget(true);
    }
  };

  const handleDragLeave: DragEventHandler<HTMLDivElement> = () => {
    setOnTarget(false);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (isUploading) return;
    setOnTarget(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        height: '100%',
        boxSizing: 'border-box',
        borderStyle: 'dashed',
        borderWidth: 'var(--spectrum-alias-border-size-thick)',
        borderColor: isOnTarget ? 'var(--spectrum-global-color-gray-500)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
}
