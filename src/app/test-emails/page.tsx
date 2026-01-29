'use client'

import { useState } from 'react'

export default function TestEmailsPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const sendTestEmail = async (type: 'welcome' | 'instant' | 'digest') => {
    if (!email) {
      setResult('Please enter an email address')
      return
    }

    setLoading(type)
    setResult(null)

    try {
      const response = await fetch('/api/test-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ ${type} email sent successfully!`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Email Flow</h1>
        <p className="text-gray-600 mb-8">
          Send test emails to verify the templates work correctly.
        </p>

        {/* Email Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Test Buttons */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-1">1. Welcome Email</h3>
            <p className="text-sm text-gray-500 mb-3">
              Sent when a user subscribes
            </p>
            <button
              onClick={() => sendTestEmail('welcome')}
              disabled={loading !== null}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading === 'welcome' ? 'Sending...' : 'Send Welcome Email'}
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-1">2. Instant Alert</h3>
            <p className="text-sm text-gray-500 mb-3">
              Sent when an exceptional deal is found
            </p>
            <button
              onClick={() => sendTestEmail('instant')}
              disabled={loading !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading === 'instant' ? 'Sending...' : 'Send Instant Alert'}
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-1">3. Daily Digest</h3>
            <p className="text-sm text-gray-500 mb-3">
              Sent daily at 8am ET with curated deals
            </p>
            <button
              onClick={() => sendTestEmail('digest')}
              disabled={loading !== null}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading === 'digest' ? 'Sending...' : 'Send Daily Digest'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg ${result.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">Before testing:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. Make sure RESEND_API_KEY is set in .env.local</li>
            <li>2. For production, verify your domain in Resend first</li>
            <li>3. Check spam folder if email doesn't arrive</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
