import NextAuth from "next-auth";
import { config } from "@serverAuth";
const handler = NextAuth(config);

export { handler as GET, handler as POST };
