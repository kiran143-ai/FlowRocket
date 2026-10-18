import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MinusIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { IconButton } from '../ui/IconButton';

interface WindowBarProps {
  title: string;
  icon?: React.ReactNode;
}

export function WindowBar({ title, icon }: WindowBarProps) {
  const navigate = useNavigate();
  return (
    <div className="flex h-11 items-center justify-between gap-3 border-b border-ink-200 bg-white px-4 lg:px-6">
      <p className="flex min-w-0 items-center gap-2 text-[15px] font-semibold text-brand-800">
        {icon &&
        <span className="text-brand-600 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
            {icon}
          </span>
        }
        <span className="truncate">{title}</span>
      </p>
      <div className="flex items-center gap-0.5">
        <IconButton label="Refresh" size="sm" onClick={() => toast.success('Up to date')}>
          <RefreshCwIcon />
        </IconButton>
        <IconButton label="Minimize to Home Workspace" size="sm" onClick={() => navigate('/')}>
          <MinusIcon />
        </IconButton>
        <IconButton label="Close" size="sm" variant="danger" onClick={() => navigate('/')}>
          <XIcon />
        </IconButton>
      </div>
    </div>);

}