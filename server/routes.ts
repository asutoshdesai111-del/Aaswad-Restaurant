import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Categories ===
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get(api.categories.get.path, async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const items = await storage.getMenuItemsByCategory(category.id);
    res.json({ ...category, items });
  });

  // === Menu Items ===
  app.get(api.menuItems.list.path, async (req, res) => {
    const items = await storage.getMenuItems();
    res.json(items);
  });

  app.get(api.menuItems.get.path, async (req, res) => {
    const item = await storage.getMenuItem(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  });

  // === Reservations ===
  app.get(api.reservations.list.path, async (req, res) => {
    const reservations = await storage.getReservations();
    res.json(reservations);
  });

  app.patch(api.reservations.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.reservations.update.input.parse(req.body);
      const updated = await storage.updateReservation(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.reservations.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    const success = await storage.deleteReservation(id);
    if (!success) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(204).end();
  });

  app.post(api.reservations.create.path, async (req, res) => {
    try {
      const input = api.reservations.create.input.parse(req.body);
      const reservation = await storage.createReservation(input);
      res.status(201).json(reservation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Reservation Error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Seed data on startup
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingCategories = await storage.getCategories();
  if (existingCategories.length === 0) {
    console.log("Seeding database...");
    
    // Create Categories
    const starters = await storage.createCategory({
      name: "Starters",
      slug: "starters",
      imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800",
    });
    
    const mains = await storage.createCategory({
      name: "Mains",
      slug: "mains",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76690b6d029?auto=format&fit=crop&q=80&w=800",
    });
    
    const desserts = await storage.createCategory({
      name: "Desserts",
      slug: "desserts",
      imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800",
    });

    const drinks = await storage.createCategory({
      name: "Drinks",
      slug: "drinks",
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800",
    });

    // Create Menu Items
    // Starters
    await storage.createMenuItem({
      categoryId: starters.id,
      name: "Paneer Tikka Angare",
      description: "Spiced cottage cheese cubes marinated in yogurt and grilled in a tandoor.",
      price: 35000,
      imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: starters.id,
      name: "Hara Bhara Kabab",
      description: "Delicate spinach and green pea patties stuffed with nuts and shallow fried.",
      price: 28000,
      imageUrl: "https://images.unsplash.com/photo-1626777553732-48993aba2d7e?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: starters.id,
      name: "Chicken Malai Tikka",
      description: "Succulent chicken chunks marinated in cream, cheese, and mild spices.",
      price: 45000,
      imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

    // Mains
    await storage.createMenuItem({
      categoryId: mains.id,
      name: "Dal Makhani Lumière",
      description: "Slow-cooked black lentils with cream and butter, our signature recipe.",
      price: 42500,
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: mains.id,
      name: "Butter Chicken",
      description: "Tender chicken cooked in a rich, creamy tomato gravy with aromatic spices.",
      price: 55000,
      imageUrl: "https://images.unsplash.com/photo-1603894584134-f139f4007994?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: mains.id,
      name: "Mutton Rogan Josh",
      description: "Traditional Kashmiri slow-cooked lamb in a spicy red gravy.",
      price: 65000,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: mains.id,
      name: "Paneer Butter Masala",
      description: "Cottage cheese cubes in a rich and creamy tomato-based sauce.",
      price: 48000,
      imageUrl: "https://images.unsplash.com/photo-1631452180539-96ad4d304b4d?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

    // Desserts
    await storage.createMenuItem({
      categoryId: desserts.id,
      name: "Gulab Jamun with Rabri",
      description: "Warm milk dumplings soaked in sugar syrup, served with creamy thickened milk.",
      price: 25000,
      imageUrl: "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: desserts.id,
      name: "Kesar Pista Kulfi",
      description: "Traditional Indian frozen dessert flavored with saffron and pistachios.",
      price: 22000,
      imageUrl: "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

     // Drinks
    await storage.createMenuItem({
      categoryId: drinks.id,
      name: "Mango Lassi",
      description: "A thick and creamy yogurt-based drink with fresh mango pulp.",
      price: 18000,
      imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: drinks.id,
      name: "Masala Chai",
      description: "Traditional Indian tea brewed with aromatic spices and milk.",
      price: 12000,
      imageUrl: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

    console.log("Database seeded successfully!");
  }
}
