'use client'

import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PreCheckoutModal } from './PreCheckoutModal'

interface TrialCTAButtonProps {
  cityName: string
  citySlug: string
  buttonText?: string
  className?: string
}

export function TrialCTAButton({
  cityName,
  citySlug,
  buttonText = 'Start Free 14-Day Trial',
  className = 'ads-button'
}: TrialCTAButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (isLoading) return

    // Create modal container
    const modalContainer = document.createElement('div')
    modalContainer.id = 'precheckout-modal-root'
    document.body.appendChild(modalContainer)

    const root = createRoot(modalContainer)

    const handleClose = () => {
      root.unmount()
      modalContainer.remove()
      setIsLoading(false)
    }

    // Render modal
    root.render(
      <PreCheckoutModal
        cityName={cityName}
        citySlug={citySlug}
        onClose={handleClose}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      disabled={isLoading}
    >
      {buttonText}
    </button>
  )
}