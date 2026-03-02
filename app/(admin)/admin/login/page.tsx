import React, { Suspense } from 'react'
import { AdminLoginForm } from './AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#020202]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
