import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { IconButton } from './IconButton';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
    Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []).filter(
      (el) => !el.hasAttribute('disabled')
    );
    const t = window.setTimeout(() => {
      const list = focusables();
      (list[1] ?? list[0])?.focus();
    }, 20);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const list = focusables();
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
          className="absolute inset-0 bg-ink-900/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={onClose}
          aria-hidden="true" />
        
          <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          className="relative w-full max-w-md rounded-xl border border-ink-200 bg-white shadow-overlay"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: EASE }}>
          
            <div className="flex items-start justify-between gap-4 px-5 pt-5">
              <div>
                <h2 id={titleId} className="text-base font-semibold text-ink-900">
                  {title}
                </h2>
                {description &&
              <div id={descId} className="mt-1 text-sm text-ink-500">
                    {description}
                  </div>
              }
              </div>
              <IconButton label="Close dialog" size="sm" onClick={onClose} className="-mr-1 -mt-1">
                <XIcon />
              </IconButton>
            </div>
            {children && <div className="px-5 pt-4">{children}</div>}
            {footer && <div className="mt-5 flex justify-end gap-2 rounded-b-xl border-t border-ink-100 bg-ink-50 px-5 py-3">{footer}</div>}
            {!footer && <div className="h-5" />}
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}