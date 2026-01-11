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
      name: "Truffle Arancini",
      description: "Crispy risotto balls infused with black truffle, served with garlic aioli.",
      price: 1400,
      imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: starters.id,
      name: "Burrata Caprese",
      description: "Fresh burrata, heirloom tomatoes, basil pesto, balsamic glaze.",
      price: 1800,
      imageUrl: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

    // Mains
    await storage.createMenuItem({
      categoryId: mains.id,
      name: "Pan-Seared Scallops",
      description: "Jumbo scallops, cauliflower purée, crispy pancetta, sage brown butter.",
      price: 3200,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76690b6d029?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: mains.id,
      name: "Wagyu Beef Burger",
      description: "Wagyu patty, brioche bun, aged cheddar, caramelized onions, truffle fries.",
      price: 2600,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: mains.id,
      name: "Herb-Crusted Lamb Rack",
      description: "Served with fondant potatoes, seasonal greens, and rosemary jus.",
      price: 3800,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76690b6d029?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

    // Desserts
    await storage.createMenuItem({
      categoryId: desserts.id,
      name: "Dark Chocolate Fondant",
      description: "Molten center, served with vanilla bean ice cream.",
      price: 1400,
      imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });
    await storage.createMenuItem({
      categoryId: desserts.id,
      name: "Lemon Basil Tart",
      description: "Zesty lemon curd, sweet basil gel, Italian meringue.",
      price: 1200,
      imageUrl: "https://images.unsplash.com/photo-1519915093-6616b9aac2dd?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

     // Drinks
    await storage.createMenuItem({
      categoryId: drinks.id,
      name: "Signature Old Fashioned",
      description: "Bourbon, smoked maple syrup, angostura bitters, orange peel.",
      price: 1600,
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800",
      isAvailable: true,
    });

    console.log("Database seeded successfully!");
  }
}
