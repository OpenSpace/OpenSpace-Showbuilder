import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FolderDown, Trash2, Settings } from 'lucide-react';
import TooltipHolder from './common/TooltipHolder';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { ConnectionSettings } from '@/components/ConnectionSettings';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onDeleteAllConfirm: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onDeleteAllConfirm,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 ">
      <TooltipHolder content="Export Show" side="bottom">
        <Button
          size={'icon'}
          variant={'ghost'}
          className="h-10 w-10 p-2"
          onClick={onSave}
        >
          <Upload size={20} />
        </Button>
      </TooltipHolder>
      <Separator orientation="vertical" className="w-[px]" />

      <TooltipHolder side="bottom" content="Import Show from your computer">
        <Button
          size={'icon'}
          variant={'ghost'}
          className="h-10 w-10 p-2"
          onClick={onLoad}
        >
          <FolderDown size={20} />
        </Button>
      </TooltipHolder>
      <Separator orientation="vertical" />
      <DeleteConfirmationModal
        onConfirm={onDeleteAllConfirm}
        message="This action cannot be undone. This will permanently delete the components from the project."
        triggerButton={
          <Button size={'icon'} variant={'ghost'} className="h-10 w-10 p-2">
            <Trash2 size={20} />
          </Button>
        }
      />
      <Separator orientation="vertical" />
      <ConnectionSettings
        triggerButton={
          <Button size={'icon'} variant={'ghost'} className="h-10 w-10 p-2">
            <Settings size={20} />
          </Button>
        }
      />
      <Separator orientation="vertical" />
      <DarkModeToggle />
      <Separator orientation="vertical" />
    </div>
  );
};

export default Toolbar;
