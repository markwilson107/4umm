import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { RegisterInput } from "@/types/auth";
import NextAuth, { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      avatar: RegisterInput["avatar"];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    avatar: RegisterInput["avatar"];
  }
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
    verifyRequest: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 6,
  },
  providers: [
    CredentialsProvider({
      id: "email",
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      async authorize(credentials: any) {
        const { email, password } = credentials;
        await dbConnect();

        const user = await User.findOne({ email });
        if (user) {
          if (await user.comparePassword(password)) return user.sanitize();
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user: any;
      trigger?: any;
    }) {
      let userData = user;
      if (trigger === "update") {
        const user = await User.findOne({ id: token.id });
        if (user) userData = user.sanitize();
      }
      return { ...token, ...userData };
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      let data = token;

      return {
        ...session,
        user: {
          id: data.id,
          email: data.email,
          username: data.username,
          avatar: data.avatar,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
