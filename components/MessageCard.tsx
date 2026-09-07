import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "./ui/toast"
import { useState } from "react"

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete}: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (isDeleting) return 
    setIsDeleting(true)
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.add({
        title: response.data.message,
        type: "Success"
      })
      onMessageDelete(message._id.toString())
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to delete message",
        type: "error"
      })
    } finally {
      setIsDeleting(false)
    }
    
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>

        <AlertDialog>
          <AlertDialogTrigger render={
            <Button variant="destructive" disabled={isDeleting}>
              <X className="w-5 h-5" />
            </Button>
          } />
            
        

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. This will permanently
                delete this message.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  )
}

export default MessageCard