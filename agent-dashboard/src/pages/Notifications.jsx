import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notifications'
import { motion } from 'framer-motion'

function Notifications() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    placeholderData: {
      notifications: [
        { id: 30, type: 'agent_approval', message: 'Your agent application has been approved.', is_read: false, created_at: '2026-07-27T09:00:00Z' },
        { id: 29, type: 'commission_payout', message: 'You earned 450 ETB in commission today.', is_read: true, created_at: '2026-07-26T18:00:00Z' },
      ],
      total: 2,
      unread_count: 1,
    },
  })

  const markOneMutation = useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  if (isLoading) return <div className="p-8 text-slate-500">Loading notifications...</div>
  if (isError) return <div className="p-8 text-red-600">Failed to load notifications.</div>

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">Inbox</p>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Notifications
          {data.unread_count > 0 && (
            <span className="ml-2 text-sm bg-red-600 text-white rounded-full px-2 py-0.5">
              {data.unread_count}
            </span>
          )}
        </h1>
        {data.unread_count > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            className="text-sm text-sky-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2 max-w-lg">
        {data.notifications.length === 0 && (
          <p className="text-slate-500">No notifications yet.</p>
        )}
       {data.notifications.map((n) => (
          <motion.div
            key={n.id}
            whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
            className={`rounded-xl shadow-sm p-4 ${n.is_read ? 'bg-white' : 'bg-sky-50 border-l-4 border-sky-500'}`}
          >
            <p className="text-sm text-slate-700">{n.message}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-400">
                {new Date(n.created_at).toLocaleString()}
              </span>
              {!n.is_read && (
                <button
                  onClick={() => markOneMutation.mutate(n.id)}
                  className="text-xs text-sky-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Notifications