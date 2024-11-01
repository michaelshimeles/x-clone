import { auth } from "@clerk/nextjs/server"
import MessageSection from "./_components/message-section"

export default async function Messages() {
  const { userId } = await auth()


  return (
    <MessageSection userId={userId!} />
  )
}
