import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function requireBlogAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in to manage articles.");
  const { data } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!data || !["admin", "superadmin", "editor"].includes(data.role))
    throw new Error("An administrator account is required.");
  return supabase;
}
