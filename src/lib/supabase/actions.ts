"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "./server"

export async function getIdeas(filters?: {
  pillar?: string
  post_type?: string
  maturity?: string
  search?: string
}) {
  const supabase = await createClient()
  let query = supabase
    .from("ideas")
    .select("*, tags:idea_tags(tag:tags(*))")
    .order("created_at", { ascending: false })

  if (filters?.pillar) {
    query = query.eq("pillar", filters.pillar)
  }
  if (filters?.post_type) {
    query = query.eq("post_type", filters.post_type)
  }
  if (filters?.maturity) {
    query = query.eq("maturity", filters.maturity)
  }
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getIdeaById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("ideas")
    .select("*, tags:idea_tags(tag:tags(*))")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createIdea(formData: {
  title: string
  content?: string
  pillar: string
  post_type?: string
  maturity?: string
}) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("ideas")
    .insert({
      ...formData,
      user_id: userData.user.id,
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath("/idea-bank")
  return data
}

export async function updateIdea(
  id: string,
  updates: {
    title?: string
    content?: string
    pillar?: string
    post_type?: string
    maturity?: string
  }
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("ideas")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  revalidatePath("/idea-bank")
  return data
}

export async function deleteIdea(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("ideas").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/idea-bank")
}

export async function getTags() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("tags").select("*").order("name")

  if (error) throw error
  return data
}

export async function updateIdeaMaturity(id: string, maturity: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("ideas")
    .update({ maturity })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  revalidatePath("/idea-bank")
  return data
}
