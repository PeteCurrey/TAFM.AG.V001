import { redirect } from 'next/navigation'
import { destroySession } from '@/lib/auth/session'

export async function GET() {
  await destroySession()
  redirect('/sign-in')
}

export async function POST() {
  await destroySession()
  redirect('/sign-in')
}
