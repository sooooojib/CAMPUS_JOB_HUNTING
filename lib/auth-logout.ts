import { authClient } from "@/lib/auth-client";

export async function performClientSignOut(): Promise<void> {
  // 1. Better Auth client signOut
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login?signout=true";
        },
      },
    });
  } catch (error) {
    console.warn("[SignOut] Better Auth client signOut failed, falling back:", error);
  }

  // 2. Direct server-side sign out endpoint call to invalidate DB session and purge cookies
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.warn("[SignOut] Direct logout endpoint fetch failed:", error);
  }

  // 3. Fallback cookie clearing for client-accessible cookies
  try {
    const cookiesToClear = [
      "better-auth.session_token",
      "__Secure-better-auth.session_token",
      "better-auth.session_data",
      "__Secure-better-auth.session_data",
      "better-auth.dont_remember",
      "__Secure-better-auth.dont_remember",
    ];
    for (const c of cookiesToClear) {
      document.cookie = `${c}=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      document.cookie = `${c}=; Max-Age=0; path=/; secure; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    }
  } catch {}

  // 4. Force a hard document navigation to /login?signout=true
  window.location.href = "/login?signout=true";
}

