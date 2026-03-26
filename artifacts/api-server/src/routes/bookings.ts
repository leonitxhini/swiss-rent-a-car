import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { carsTable, bookingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { CreateBookingBody } from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router: IRouter = Router();

function generateConfirmationCode(): string {
  return "SRC-" + randomBytes(3).toString("hex").toUpperCase();
}

router.post("/bookings", async (req, res) => {
  try {
    const body = CreateBookingBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request", details: body.error.message });
      return;
    }

    const { carId, pickupDate, returnDate, pickupLocation, firstName, lastName, email, phone, driverAge } = body.data;

    const [car] = await db.select().from(carsTable).where(eq(carsTable.id, carId));
    if (!car) {
      res.status(400).json({ error: "Car not found" });
      return;
    }

    const pickup = new Date(pickupDate as unknown as string);
    const returnD = new Date(returnDate as unknown as string);
    const days = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = parseFloat(car.pricePerDay) * days;

    const [booking] = await db.insert(bookingsTable).values({
      carId,
      pickupDate: pickup,
      returnDate: returnD,
      pickupLocation,
      firstName,
      lastName,
      email,
      phone,
      driverAge,
      totalPrice: totalPrice.toFixed(2),
      status: "confirmed",
      confirmationCode: generateConfirmationCode(),
    }).returning();

    res.status(201).json({
      id: booking.id,
      carId: booking.carId,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      pickupLocation: booking.pickupLocation,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      driverAge: booking.driverAge,
      totalPrice: parseFloat(booking.totalPrice as string),
      status: booking.status,
      confirmationCode: booking.confirmationCode,
      createdAt: booking.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
