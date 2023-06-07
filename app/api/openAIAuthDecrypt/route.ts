import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function POST(req: Request) {
  const { encryptedData } = await req.json();
  const key = process.env.CRYPTO_KEY || "";
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(
    CryptoJS.enc.Utf8
  );
  return NextResponse.json({ data: decryptedData });
}
