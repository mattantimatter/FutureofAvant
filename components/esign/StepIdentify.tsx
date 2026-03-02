'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import type { Signer } from '@/lib/supabase/types'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface StepIdentifyProps {
  signer: Signer
  onNext: (data: { name: string; email: string; phone?: string }) => void
  onBack: () => void
}

export function StepIdentify({ signer, onNext, onBack }: StepIdentifyProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: signer.name,
      email: signer.email,
    },
  })

  return (
    <div className="p-6 md:p-8">
      <h2 className="mb-2 text-xl font-bold text-white">Confirm Your Identity</h2>
      <p className="mb-6 text-sm text-slate-400">
        Please verify your information before signing. These details will be recorded in the audit trail.
      </p>

      <form onSubmit={handleSubmit(onNext)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Full Legal Name <span className="text-red-400">*</span>
          </label>
          <input
            {...register('name')}
            className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-accent/50"
            placeholder="Your full legal name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-accent/50"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Phone (optional)
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full rounded-xl border border-[rgba(105,106,172,0.2)] bg-[rgba(2,2,2,0.6)] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-accent/50"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {signer.role && (
          <div className="rounded-xl border border-[rgba(105,106,172,0.08)] bg-[rgba(105,106,172,0.03)] px-4 py-3 text-sm">
            <span className="text-slate-500">Signing as: </span>
            <span className="text-tertiary">{signer.role}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
            ← Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue →
          </Button>
        </div>
      </form>
    </div>
  )
}
