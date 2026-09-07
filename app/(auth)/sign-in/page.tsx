'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/toast"
import { useDebounceValue } from "usehooks-ts"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { signInSchema } from "@/schemas/signInSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { usernameValidation } from "@/schemas/signUpSchema"
import { signIn } from "next-auth/react"
import { error } from "console"


const page = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

//zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      identifier: '',
      password: '',
    }
  })



  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier ,
      password: data.password
    })
    if (result?.error) {
      toast.add({
        title: "Login Failed" ,
        description: "Incorrect username or password",
        type: "error"
      })
    } 
    if (result?.url) {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            

{/* EMAIL */}
<Field>
  <FieldLabel htmlFor="identifier">Email/Username</FieldLabel>
  <Input id="identifier" placeholder="email/username" {...form.register("identifier")} />
  <FieldError errors={[form.formState.errors.identifier]} />
</Field>

{/* PASSWORD */}
<Field>
  <FieldLabel htmlFor="password">Password</FieldLabel>
  <Input id="password" type="password" placeholder="password" {...form.register("password")} />
  <FieldError errors={[form.formState.errors.password]} />
</Field>
         


  {/* SUBMIT */}
  <Button type="submit" disabled={isSubmitting} className="w-full">
    {isSubmitting ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </>
    ) : (
      "Signin"
    )}
  </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            New user?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page