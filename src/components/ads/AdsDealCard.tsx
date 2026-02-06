interface AdsDealCardProps {
  destination: string
  country: string
  discount: number
  price: number
  originalPrice: number
  dates: string
  airline: string
  stops: string
  currency?: '$' | '£'
}

export function AdsDealCard({
  destination,
  country,
  discount,
  price,
  originalPrice,
  dates,
  airline,
  stops,
  currency = '$',
}: AdsDealCardProps) {
  const savings = originalPrice - price

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Destination */}
      <div className="mb-3">
        <h3 className="font-serif text-lg font-semibold text-gray-900">
          {destination}
        </h3>
        <p className="text-sm text-gray-500">{country}</p>
      </div>

      {/* Price row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl font-bold text-gray-900">
          {currency}{price.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400 line-through">
          {currency}{originalPrice.toLocaleString()}
        </span>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-600 mb-3">
        <p>{dates}</p>
        <p>{airline} · {stops}</p>
      </div>

      {/* Savings badge - combined % and absolute */}
      <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg">
        -{discount}% · Save {currency}{savings.toLocaleString()}
      </div>
    </div>
  )
}
