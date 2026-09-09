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
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { usernameValidation } from "@/schemas/signUpSchema"


const page = () => {
  const [username, setUsername] = useState('')
  const [debouncedUsername] = useDebounceValue(username, 300)

  const [usernameMessage, setUsernameMessage] = useState('')

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)

  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) {
        setUsernameMessage('')
        setIsCheckingUsername(false)
        return
      }

     
    const parsed = usernameValidation.safeParse(debouncedUsername)
    if (!parsed.success) {
      setUsernameMessage('')      
      setIsCheckingUsername(false)
      return
    }
      setIsCheckingUsername(true)
      setUsernameMessage('')

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        )
        
          setUsernameMessage(response.data.message)
          setIsUsernameAvailable(response.data.success)
        
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        
            setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
             )
           setIsUsernameAvailable(false)
        
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()
   
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
      console.log("This is the data: ", data)

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)

      toast.add({
        title: 'Success',
        description: response.data.message,
        type: "success"
      })

      router.replace(`/verify/${data.username}`)
    } catch (error) {
      console.error("Error in signup of user", error)

      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message

      toast.add({
        title: 'Signup failed',
        description: errorMessage ?? "Something went wrong. Please try again.",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* USERNAME */}
<Field>
  <FieldLabel htmlFor="username">Username</FieldLabel>
  <Input
    id="username"
    placeholder="username"
    {...form.register("username", {
      onChange: (e) => setUsername(e.target.value),
    })}
  />
  {isCheckingUsername && (
    <p className="text-sm text-muted-foreground">Checking username...</p>
  )}
  {!isCheckingUsername && usernameMessage && (
    <p className={`text-sm ${
      isUsernameAvailable ? "text-green-500" : "text-red-500"
    }`}>
      {usernameMessage}
    </p>
  )}
  <FieldError errors={[form.formState.errors.username]} />
</Field>

{/* EMAIL */}
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" placeholder="email" {...form.register("email")} />
  <FieldError errors={[form.formState.errors.email]} />
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
              "Signup"
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page