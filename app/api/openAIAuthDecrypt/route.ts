import { createDecipheriv } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { encryptedData } = await req.json();
  const key = process.env.CRYPTO_KEY || "";
  const iv = Buffer.from(process.env.CRYPTO_IV || "", "hex");
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = decipher.update(Buffer.from(encryptedData, "hex"));
  const decryptedData = Buffer.concat([decrypted, decipher.final()]);
  return NextResponse.json({ data: decryptedData.toString() });
}
