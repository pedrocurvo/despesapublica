"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export type NavItem = {
  name: string;
  href: string;
}

interface NavItemsProps {
  links: NavItem[];
  className?: string;
  onClick?: () => void;
}

// Shared navigation items component
function NavItems({ links, className, onClick }: NavItemsProps) {
  return (
    <>
      {links.map((link) => (
        <Button 
          key={link.href}
          asChild 
          variant="ghost" 
          size="sm" 
          onClick={onClick} 
          className={className}
        >
          <Link href={link.href}>{link.name}</Link>
        </Button>
      ))}
    </>
  )
}

interface NavMenuProps {
  links: NavItem[];
}

export function NavMenu({ links }: NavMenuProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Check on initial load
    checkMobile()
    
    // Setup listener for resize
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSheetClose = () => {
    setIsOpen(false)
  }
  
  // During SSR or before hydration, return a skeleton/placeholder
  if (!isMounted) {
    return (
      <nav className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <NavItems links={links} />
        </div>
        <div className="flex items-center ml-2">
          <ThemeToggle />
        </div>
      </nav>
    )
  }

  return (
    <nav className="ml-auto flex items-center gap-2">
      {isMobile ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <ThemeToggle />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] py-8">
              <div className="flex flex-col space-y-2">
                <NavItems 
                  links={links}
                  className="justify-start w-full" 
                  onClick={handleSheetClose} 
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <>
          <NavItems links={links} />
          <div className="flex items-center ml-2">
            <ThemeToggle />
          </div>
        </>
      )}
    </nav>
  )
}