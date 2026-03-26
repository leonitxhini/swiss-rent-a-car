import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { carsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { GetCarsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/cars", async (req, res) => {
  try {
    const query = GetCarsQueryParams.safeParse(req.query);
    let cars;

    if (query.success && query.data.category) {
      cars = await db.select().from(carsTable).where(eq(carsTable.category, query.data.category as any));
    } else if (query.success && query.data.available !== undefined) {
      cars = await db.select().from(carsTable).where(eq(carsTable.available, query.data.available));
    } else {
      cars = await db.select().from(carsTable);
    }

    const mapped = cars.map((car) => ({
      id: car.id,
      name: car.name,
      brand: car.brand,
      model: car.model,
      category: car.category,
      pricePerDay: parseFloat(car.pricePerDay),
      seats: car.seats,
      transmission: car.transmission,
      fuelType: car.fuelType,
      imageUrl: car.imageUrl,
      features: car.features,
      available: car.available,
      rating: parseFloat(car.rating as string),
      reviewCount: car.reviewCount,
    }));

    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Failed to get cars");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cars/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid car ID" });
      return;
    }

    const [car] = await db.select().from(carsTable).where(eq(carsTable.id, id));

    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    res.json({
      id: car.id,
      name: car.name,
      brand: car.brand,
      model: car.model,
      category: car.category,
      pricePerDay: parseFloat(car.pricePerDay),
      seats: car.seats,
      transmission: car.transmission,
      fuelType: car.fuelType,
      imageUrl: car.imageUrl,
      features: car.features,
      available: car.available,
      rating: parseFloat(car.rating as string),
      reviewCount: car.reviewCount,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get car by ID");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
