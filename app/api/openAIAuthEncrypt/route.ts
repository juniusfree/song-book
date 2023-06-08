import { createCipheriv } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { apiKey } = await req.json();
  try {
    const key = process.env.CRYPTO_KEY || "";
    const iv = Buffer.from(process.env.CRYPTO_IV || "", "hex");
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    const encrypted = cipher.update(apiKey);
    const encryptedData = Buffer.concat([encrypted, cipher.final()]);
    return NextResponse.json({ data: encryptedData.toString("hex") });
  } catch (error) {
    return NextResponse.error();
  }
}
