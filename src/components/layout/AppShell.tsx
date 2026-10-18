import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  ChartLineIcon,
  ChevronDownIcon,
  CirclePlusIcon,
  HourglassIcon,
  HouseIcon,
  ListIcon,
  LogOutIcon,
  MessageCircleIcon,
  MonitorIcon,
  PaletteIcon,
  SearchIcon,
  UserIcon } from
'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { IconButton } from '../ui/IconButton';

const navText =
'focus-ring inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-white/90 transition-colors duration-150 hover:bg-white/15 hover:text-white focus-visible:ring-white focus-visible:ring-offset-brand-600';

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const onDesignSystem = location.pathname.startsWith('/design-system');
  const onReports = location.pathname.startsWith('/reports');
  const onHome = !onDesignSystem && !onReports;
  const notInPrototype = (name: string) => toast(`${name} isn't part of this prototype.`);

  return (
    <div className="flex min-h-screen w-full flex-col bg-canvas">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm font-medium text-brand-700 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        
        Skip to content
      </a>

      <header className="sticky top-0 z-30">
        <div className="flex h-12 items-center gap-2 bg-brand-600 px-3 text-white lg:px-4">
          <Link to="/" aria-label="FlowRocket — Home Workspace" className={twMerge(navText, 'px-1.5')}>
            <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15">
              <HourglassIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-0.5">
            <button type="button" onClick={() => notInPrototype('Address Book')} className={twMerge(navText, 'bg-white/10')}>
              Address Book
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => notInPrototype('Documents')} className={twMerge(navText, 'hidden md:inline-flex')}>
              Documents
            </button>
            <button type="button" onClick={() => notInPrototype('Calendar')} className={twMerge(navText, 'hidden md:inline-flex')}>
              Calendar
            </button>
            <button type="button" onClick={() => notInPrototype('Tools')} className={twMerge(navText, 'hidden md:inline-flex')}>
              Tools
            </button>
            <IconButton label="Create new" variant="onBrand" onClick={() => notInPrototype('Create new')} className="hidden md:inline-flex">
              <CirclePlusIcon />
            </IconButton>
          </nav>

          <form role="search" className="relative mx-auto hidden w-full max-w-md flex-1 md:block" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="global-search" className="sr-only">
              Search FlowRocket
            </label>
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
            <input
              id="global-search"
              type="search"
              placeholder="Search..."
              className="h-8 w-full rounded-md border border-transparent bg-white pl-8 pr-8 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600" />
            
            <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          </form>

          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <IconButton label="Reports" variant="onBrand" onClick={() => navigate('/reports')}>
              <ChartLineIcon />
            </IconButton>
            <IconButton label="Display" variant="onBrand" onClick={() => notInPrototype('Display')}>
              <MonitorIcon />
            </IconButton>
            <span className="ml-1 hidden items-center gap-1.5 px-1.5 text-sm font-medium sm:inline-flex">
              <UserIcon className="h-4 w-4" aria-hidden="true" />
              Lauren McKenna
            </span>
            <IconButton label="Sign out" variant="onBrand" onClick={() => notInPrototype('Sign out')}>
              <LogOutIcon />
            </IconButton>
          </div>
        </div>

        <div className="flex h-10 items-center justify-between gap-2 bg-brand-700 px-3 text-white lg:px-4">
          <nav aria-label="Workspace" className="flex items-center gap-0.5">
            <NavLink
              to="/"
              className={twMerge(navText, 'h-7 focus-visible:ring-offset-brand-700', onHome && 'bg-white/15 text-white')}
              aria-current={onHome ? 'page' : undefined}>
              
              <HouseIcon className="h-4 w-4" aria-hidden="true" />
              Home Workspace
            </NavLink>
            <span className="h-4 w-px bg-white/30" aria-hidden="true" />
            <NavLink to="/reports" className={twMerge(navText, 'h-7 focus-visible:ring-offset-brand-700', onReports && 'bg-white/15 text-white')}>
              <ChartLineIcon className="h-4 w-4" aria-hidden="true" />
              Reports
            </NavLink>
          </nav>
          <div className="flex items-center gap-0.5">
            <NavLink
              to="/design-system"
              className={twMerge(navText, 'h-7 focus-visible:ring-offset-brand-700', onDesignSystem && 'bg-white/15 text-white')}>
              
              <PaletteIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Design System</span>
            </NavLink>
            <span className="mx-1 h-4 w-px bg-white/30" aria-hidden="true" />
            <IconButton label="Lists" variant="onBrand" size="sm" className="focus-visible:ring-offset-brand-700" onClick={() => notInPrototype('Lists')}>
              <ListIcon />
            </IconButton>
            <IconButton label="Chat" variant="onBrand" size="sm" className="focus-visible:ring-offset-brand-700" onClick={() => notInPrototype('Chat')}>
              <MessageCircleIcon />
            </IconButton>
            <IconButton label="Notifications, 0 unread" variant="onBrand" size="sm" className="focus-visible:ring-offset-brand-700" onClick={() => toast('No new notifications')}>
              <BellIcon />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-warning-500 px-1 text-[10px] font-bold leading-none text-ink-900" aria-hidden="true">
                0
              </span>
            </IconButton>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>
    </div>);

}