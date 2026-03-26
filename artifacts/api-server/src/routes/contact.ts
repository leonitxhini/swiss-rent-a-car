import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db/schema";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  try {
    const body = SubmitContactBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request", details: body.error.message });
      return;
    }

    await db.insert(contactsTable).values({
      name: body.data.name,
      email: body.data.email,
      phone: body.data.phone ?? null,
      subject: body.data.subject ?? null,
      message: body.data.message,
    });

    res.json({ success: true, message: "Thank you! We will get back to you soon." });
  } catch (err) {
    req.log.error({ err }, "Failed to submit contact");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
