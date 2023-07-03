import { useState } from 'react'
import { Filter } from 'components/Icons'

export default function ButtonMenu() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <img
        src="arrow.png"
        alt="Filter by place here"
        className="invisible fixed bottom-24 right-8 h-[450px] ultrawide:visible"
      />

      <button
        className="fixed bottom-6 right-5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-medium shadow-md transition hover:bg-medium/90 xl:h-16 xl:w-16"
        onClick={() => setMenuOpen(!menuOpen)}
        title="Filter by place"
      >
        <Filter className="w-9 text-white/50 transition hover:text-white/80 xl:w-10" />
      </button>
    </>
  )
}
