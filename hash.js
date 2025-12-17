import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("vania", 10);
console.log(hash);