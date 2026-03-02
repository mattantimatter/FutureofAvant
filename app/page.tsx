import { redirect } from 'next/navigation'

/**
 * Root redirect — go to admin dashboard.
 * If you have a specific proposal token, link directly to /p/[token] instead.
 */
export default function HomePage() {
  redirect('/admin')
}
