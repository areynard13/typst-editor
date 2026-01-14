import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiRoute = nextUrl.pathname.startsWith("/api");
      const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");

      if (!isAuthPage && !isApiRoute && !isLoggedIn) {
        return false; 
      }
      
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;