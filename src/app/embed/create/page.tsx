"use server"

import CreateEmbed from "@/components/embed/CreateEmbed"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CreateEmbedPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth")
    }

    return (
        <div>
            <CreateEmbed />
        </div>
    )
}