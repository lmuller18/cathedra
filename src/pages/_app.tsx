import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { Analytics } from "@vercel/analytics/react";

import "~/styles/globals.css";
import { api } from "~/utils/api";
import { Toaster } from "~/elements/toaster";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Analytics />
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
