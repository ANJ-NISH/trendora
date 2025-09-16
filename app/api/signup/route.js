import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";



import bcrypt from "bcrypt";

export async function POST(req) {
  try {

    
    const { name, email, password } = await req.json();

    await connectDB();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ name, email, password: hashedPassword });

    return Response.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
