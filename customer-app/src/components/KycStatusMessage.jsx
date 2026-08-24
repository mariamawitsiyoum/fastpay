import { useNavigate } from 'react-router-dom'

const statusConfig = {
  unverified: {
    box: 'bg-red-50 border-red-100',
    text: 'text-red-600',
    message: "You're not verified yet. Please verify your KYC to send money.",
    buttonLabel: 'Verify now',
    showButton: true,
  },
  rejected: {
    box: 'bg-red-50 border-red-100',
    text: 'text-red-600',
    message: 'Your KYC document was rejected. Please re-submit to send money.',
    buttonLabel: 'Re-submit KYC',
    showButton: true,
  },
  pending: {
    box: 'bg-amber-50 border-amber-100',
    text: 'text-amber-600',
    message: 'Your KYC is pending review. Please wait before sending money.',
    showButton: false,
  },
  verified: {
    box: 'bg-emerald-50 border-emerald-100',
    text: 'text-emerald-600',
    message: 'You are verified! You can send money at your nearest or preferred agent.',
    buttonLabel: 'Find an agent',
    showButton: true,
    buttonTarget: '/agents',
  },
}

function KycStatusMessage({ status }) {
  const navigate = useNavigate()
  const config = statusConfig[status] || statusConfig.unverified

  return (
    <div className={`border rounded-xl p-4 flex items-center justify-between ${config.box}`}>
      <p className={`text-sm font-medium ${config.text}`}>{config.message}</p>

      {config.showButton && (
        <button
          onClick={() => navigate(config.buttonTarget || '/kyc')} // for the button next to the message
          className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded px-3 py-2 whitespace-nowrap ml-4"
        >
          {config.buttonLabel}
        </button>
      )}
    </div>
  )
}

export default KycStatusMessage