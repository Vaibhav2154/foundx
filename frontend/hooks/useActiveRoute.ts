import { usePathname } from 'next/navigation';

export const useActiveRoute = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return { isActive, pathname };
};
