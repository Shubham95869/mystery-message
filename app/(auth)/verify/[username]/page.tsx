'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { verifySchema } from "@/schemas/verifySchema"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        code: data.code,
      })

      toast.add({
        title: 'Success',
        description: response.data.message,
        type: 'success',
      })

      router.replace('/sign-in')
    } catch (error) {
      console.error('Error in verifying user', error)

      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: 'Verification failed',
        description:
          axiosError.response?.data.message ?? 'Something went wrong. Please try again.',
        type: 'error',
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="code">Verification Code</FieldLabel>
            <Input id="code" placeholder="code" {...form.register("code")} />
            <FieldError errors={[form.formState.errors.code]} />
          </Field>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

export default VerifyAccount