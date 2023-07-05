import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'

export default function Navbar() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Link href="/">Pools</Link>
      <DarkModeToggle />
    </div>
  )
}
