const statusStyles = {
  verified: 'bg-emerald-100 text-emerald-600',
  pending: 'bg-amber-100 text-amber-600',
  rejected: 'bg-red-100 text-red-600',
  unverified: 'bg-slate-100 text-slate-500',
}

const statusLabels = {
  verified: 'Verified',
  pending: 'Pending Review',
  rejected: 'Rejected',
  unverified: 'Unverified',
}

function KycStatusBadge({ status }) {
  const styles = statusStyles[status] || statusStyles.unverified
  const label = statusLabels[status] || 'Unknown'

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles}`}>
      {label}
    </span>
  )
}

export default KycStatusBadge