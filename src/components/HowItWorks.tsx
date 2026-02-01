import Image from 'next/image'

const steps = [
  {
    number: '1',
    title: 'Tell us where you fly from',
    description:
      'Select your home airport and we\'ll find the best deals departing from there.',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Get deals in your inbox',
    description:
      'We\'ll email you when we find incredible flight deals from your airport.',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Book and save big',
    description:
      'Click through to book directly with the airline at the lowest price available.',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left - Image */}
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=500&h=560&fit=crop&q=80"
              alt="Happy woman with arms open in city"
              width={500}
              height={560}
              priority
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">$847 saved</p>
                  <p className="text-sm text-text-muted">on last booking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Steps */}
          <div>
            <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
              Simple process
            </p>
            <h2 className="heading-display text-3xl md:text-4xl text-text-primary mb-4">
              How it <span className="heading-accent">works</span>
            </h2>
            <p className="text-lg text-text-secondary mb-10">
              Getting cheap flights is easier than you think
            </p>

            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4 items-start">
                  <span className="font-serif text-3xl font-bold text-blue-600">
                    {step.number}.
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-text-primary mb-1">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
