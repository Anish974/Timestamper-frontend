// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '@/hooks/useAuth'
// import { supabaseClient } from '@/lib/supabaseClient'
// import Home from './Home'

// export default function Dashboard() {
//   const { user, loading } = useAuth()
//   const navigate = useNavigate()
//   const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null)

//   useEffect(() => {
//     if (loading) return
//     if (!user) {
//       navigate('/login', { replace: true })
//       return
//     }

//     const fetchPlan = async () => {
//       const { data, error } = await supabaseClient
//         .from('user_subscriptions')
//         .select('plan')
//         .eq('user_id', user.id)
//         .single()

//       if (error || !data?.plan) {
//         localStorage.removeItem('selectedPlan')
//         navigate('/pricing', { replace: true })
//         return
//       }

//       setSelectedPlan(data.plan)
//       localStorage.setItem('selectedPlan', data.plan)
//     }

//     fetchPlan()
//   }, [user, loading, navigate])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900">
//         <div className="text-white text-xl">Loading...</div>
//       </div>
//     )
//   }

//   if (!user || !selectedPlan) {
//     return null
//   }

//   return (
//     <div>
//       <div className="fixed top-20 right-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold z-50">
//         Plan: {selectedPlan}
//       </div>
//       <Home />
//     </div>
//   )
// }
