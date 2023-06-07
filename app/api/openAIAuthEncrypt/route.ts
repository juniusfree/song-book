import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function POST(req: Request) {
  const { apiKey } = await req.json();
  try {
    const key = process.env.CRYPTO_KEY || "";
    const encryptedData = CryptoJS.AES.encrypt(apiKey, key).toString();
    return NextResponse.json({ data: encryptedData });
  } catch (error) {
    console.log("error", error);
    return NextResponse.error();
  }
}
