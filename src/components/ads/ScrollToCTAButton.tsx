'use client'

interface ScrollToCTAButtonProps {
  targetId?: string
  text?: string
  className?: string
}

export function ScrollToCTAButton({
  targetId = 'email-form',
  text = 'Try Free for 14 Days',
  className = '',
}: ScrollToCTAButtonProps) {
  const handleClick = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`px-8 py-4 bg-[#FF6B35] text-white font-semibold text-base rounded-full
        hover:bg-[#e55a2b] active:bg-[#d14f22] transition-all
        shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:shadow-[#FF6B35]/40 ${className}`}
    >
      {text}
    </button>
  )
}
