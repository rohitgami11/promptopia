import NextAuth from "@node_modules/next-auth";
import { connectToDB } from "@utils/database";
import User from "@models/user";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { prompt: 'consent', access_type: 'online', response_type: 'code' },
      },
    })
  ],

  callbacks: {

    async session({session}){
      const sessionUser = await User.findOne({
        email: session.user.email
      })
      // console.log("sessionUser", sessionUser);
  
      session.user.id = sessionUser._id.toString();
  
      return session;
    },
    async signIn({profile}){
      try {
        await connectToDB();
        // console.log('connected to MongoDB through signIn');
        // check if user already exist
        const userExist = await User.findOne({
          email: profile.email
        })
        // console.log("user", userExist);
        // if not, create a new user in database
        if(!userExist){
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ","").toLowerCase(),
            image: profile.picture,
          })
        }
        // console.log("user created");
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  }
})

export {handler as GET, handler as POST};
