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

    const { data: embeds, error } = await supabase.from('embeds').select('*').eq('owner_id', user.id)

    if (error) {
        console.error(error)
    }

    return (
        <div>
            <CreateEmbed />
        </div>
    )
}