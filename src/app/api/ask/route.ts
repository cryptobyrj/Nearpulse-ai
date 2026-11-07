import { answerQuestion } from "@/lib/ai";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = (body as { question?: unknown })?.question;
  const question = typeof raw === "string" ? raw.trim() : "";

  if (!question) {
    return Response.json({ error: "Please type a question." }, { status: 400 });
  }
  if (question.length > 500) {
    return Response.json(
      { error: "Please keep the question under 500 characters." },
      { status: 400 }
    );
  }

  return Response.json(await answerQuestion(question));
}