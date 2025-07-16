// actions/auth.ts
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      toast.error(res.error)
      return false
    }

    if (res?.ok) {
      toast.success('Logged in successfully')
      return true
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error('An error occurred during login')
    return false
  }
}

export const registerUser = async (userData: {
  name: string
  email: string
  password: string
  role: string
  areaName?: string
}) => {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (res.ok) {
      toast.success('Registered successfully')
      return true
    } else {
      const data = await res.json()
      toast.error(data.message || 'Registration failed')
      return false
    }
  } catch (error) {
    console.error('Registration error:', error)
    toast.error('An error occurred during registration')
    return false
  }
}