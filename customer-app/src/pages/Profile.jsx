import { useAuth } from '../context/AuthContext'
import KycStatusBadge from '../components/KycStatusBadge'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">My Profile</h1>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-slate-500 text-sm">Full name</p>
          <p className="text-slate-800 font-medium">{user?.name || 'Not available'}</p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">Email</p>
          <p className="text-slate-700">{user?.email || 'Not available'}</p>
        </div>

        <div>
          <p className="text-slate-500 text-sm mb-1">KYC Status</p>
          <KycStatusBadge status={user?.kyc_status} />
        </div>
      </div>
    </div>
  )
}

export default Profile