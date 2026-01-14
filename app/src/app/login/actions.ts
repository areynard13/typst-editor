"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

type ActionResponse = string | null | undefined;

export async function loginAction(prevState: ActionResponse, formData: FormData) {
  try {
    await signIn("credentials", { 
      ...Object.fromEntries(formData), 
      redirectTo: "/" 
    })
  } catch (error) {
    if (error instanceof Error && error.message?.includes("NEXT_REDIRECT")) {
      throw error
    }

    if (error instanceof AuthError) {
      return "Identifiants incorrects."
    }
    
    return "Une erreur inattendue est survenue."
  }
}