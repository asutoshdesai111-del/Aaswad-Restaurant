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

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch (err) {
      console.error("Order Error:", err);
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
      imageUrl: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&q=80&w=800",
    });
    
    const mains = await storage.createCategory({
      name: "Mains",
      slug: "mains",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-71a005686659?auto=format&fit=crop&q=80&w=800",
    });
    
    const desserts = await storage.createCategory({
      name: "Desserts",
      slug: "desserts",
      imageUrl: "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800",
    });

    const drinks = await storage.createCategory({
      name: "Drinks",
      slug: "drinks",
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800",
    });

    // --- Starters (20 items) ---
    const starterItems = [
      ["Paneer Tikka Angare", "Spiced cottage cheese cubes marinated in yogurt and grilled.", 35000, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800"],
      ["Hara Bhara Kabab", "Delicate spinach and green pea patties stuffed with nuts.", 28000, "https://images.unsplash.com/photo-1626777553732-48993aba2d7e?auto=format&fit=crop&q=80&w=800"],
      ["Chicken Malai Tikka", "Succulent chicken marinated in cream, cheese, and mild spices.", 45000, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800"],
      ["Samosa Platter", "Crispy pastry filled with spiced potatoes and peas.", 15000, "https://images.unsplash.com/photo-1601050638917-3d027725273d?auto=format&fit=crop&q=80&w=800"],
      ["Fish Amritsari", "Deep-fried fish fillets marinated in gram flour and spices.", 48000, "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=800"],
      ["Onion Bhaji", "Crispy onion fritters served with mint chutney.", 18000, "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?auto=format&fit=crop&q=80&w=800"],
      ["Dahi Ke Sholey", "Crispy bread rolls filled with hung curd and spices.", 32000, "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&q=80&w=800"],
      ["Mutton Seekh Kabab", "Minced mutton blended with spices and grilled on skewers.", 55000, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800"],
      ["Crispy Corn", "Golden fried corn kernels tossed in spicy seasoning.", 22000, "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800"],
      ["Chilli Paneer", "Stir-fried cottage cheese with bell peppers and soy sauce.", 34000, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800"],
      ["Veg Spring Rolls", "Crunchy rolls filled with seasoned vegetables.", 24000, "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=800"],
      ["Aloo Tikki Chaat", "Spiced potato patties served with tamarind and mint chutneys.", 16000, "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&q=80&w=800"],
      ["Papdi Chaat", "Crispy wafers topped with potatoes, yogurt, and chutneys.", 18000, "https://images.unsplash.com/photo-1601050638917-3d027725273d?auto=format&fit=crop&q=80&w=800"],
      ["Tandoori Mushroom", "Button mushrooms marinated and grilled to perfection.", 31000, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800"],
      ["Chicken Lollipops", "Indo-Chinese style chicken wings with spicy red glaze.", 42000, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800"],
      ["Gobi 65", "Spicy and crispy cauliflower florets.", 26000, "https://images.unsplash.com/photo-1626777553732-48993aba2d7e?auto=format&fit=crop&q=80&w=800"],
      ["Honey Chilli Potato", "Crispy potato fingers tossed in honey and chilli sauce.", 28000, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800"],
      ["Lamb Boti Kabab", "Boneless lamb chunks marinated and charcoal grilled.", 58000, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800"],
      ["Chicken 65", "Classic spicy fried chicken from South India.", 44000, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800"],
      ["Galouti Kabab", "Melt-in-your-mouth minced meat patties with royal spices.", 62000, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800"]
    ];
    for (const [name, desc, price, img] of starterItems) {
      await storage.createMenuItem({ categoryId: starters.id, name: name as string, description: desc as string, price: price as number, imageUrl: img as string, isAvailable: true });
    }

    // --- Mains (20 items) ---
    const mainItems = [
      ["Dal Makhani Lumière", "Slow-cooked black lentils with cream and butter.", 42500, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"],
      ["Butter Chicken", "Tender chicken in a rich, creamy tomato gravy.", 55000, "https://images.unsplash.com/photo-1603894584134-f139f4007994?auto=format&fit=crop&q=80&w=800"],
      ["Mutton Rogan Josh", "Traditional Kashmiri slow-cooked lamb in spicy red gravy.", 65000, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800"],
      ["Paneer Butter Masala", "Cottage cheese cubes in a creamy tomato-based sauce.", 48000, "https://images.unsplash.com/photo-1631452180539-96ad4d304b4d?auto=format&fit=crop&q=80&w=800"],
      ["Hyderabadi Dum Biryani", "Fragrant basmati rice cooked with spiced meat and herbs.", 52000, "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?auto=format&fit=crop&q=80&w=800"],
      ["Palak Paneer", "Fresh cottage cheese in a smooth spinach puree.", 46000, "https://images.unsplash.com/photo-1601050638917-3d027725273d?auto=format&fit=crop&q=80&w=800"],
      ["Chicken Tikka Masala", "Grilled chicken in a spicy, flavorful orange sauce.", 54000, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"],
      ["Malai Kofta", "Fried potato and paneer balls in a rich cashew gravy.", 49000, "https://images.unsplash.com/photo-1585937421612-71a005686659?auto=format&fit=crop&q=80&w=800"],
      ["Laal Maas", "Fiery Rajasthani lamb curry cooked with red chillies.", 67000, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800"],
      ["Goan Fish Curry", "Tangy and spicy coconut-based fish curry.", 58000, "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=800"],
      ["Kadai Paneer", "Paneer cooked with bell peppers and freshly ground spices.", 47000, "https://images.unsplash.com/photo-1631452180539-96ad4d304b4d?auto=format&fit=crop&q=80&w=800"],
      ["Baingan Bharta", "Smoked mashed eggplant with onions and tomatoes.", 38000, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"],
      ["Chicken Chettinad", "Spicy South Indian chicken curry with roasted spices.", 56000, "https://images.unsplash.com/photo-1603894584134-f139f4007994?auto=format&fit=crop&q=80&w=800"],
      ["Vegetable Jalfrezi", "Mixed vegetables stir-fried in a tangy tomato sauce.", 39000, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"],
      ["Fish Moilee", "Mildly spiced Kerala fish stew with coconut milk.", 61000, "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=800"],
      ["Bhindi Do Pyaza", "Okra cooked with double the quantity of onions.", 36000, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"],
      ["Shahi Paneer", "Royal paneer preparation in a creamy white gravy.", 51000, "https://images.unsplash.com/photo-1631452180539-96ad4d304b4d?auto=format&fit=crop&q=80&w=800"],
      ["Chicken Korma", "Mildly spiced chicken in a creamy almond and yogurt sauce.", 57000, "https://images.unsplash.com/photo-1603894584134-f139f4007994?auto=format&fit=crop&q=80&w=800"],
      ["Chole Bhature", "Spicy chickpeas served with puffed fried bread.", 32000, "https://images.unsplash.com/photo-1626132646529-500637532537?auto=format&fit=crop&q=80&w=800"],
      ["Aloo Gobi", "Classic comfort food of potatoes and cauliflower.", 34000, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"]
    ];
    for (const [name, desc, price, img] of mainItems) {
      await storage.createMenuItem({ categoryId: mains.id, name: name as string, description: desc as string, price: price as number, imageUrl: img as string, isAvailable: true });
    }

    // --- Desserts (20 items) ---
    const dessertItems = [
      ["Gulab Jamun with Rabri", "Warm milk dumplings in sugar syrup with thickened milk.", 25000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Kesar Pista Kulfi", "Indian frozen dessert flavored with saffron and pistachios.", 22000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Gajar Ka Halwa", "Carrot pudding slow-cooked with milk, ghee, and nuts.", 28000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Rasmalai", "Soft cottage cheese dumplings in saffron milk.", 32000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Jalebi with Rabri", "Crispy fried swirls in syrup served with thickened milk.", 26000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Phirni", "Creamy rice pudding set in clay pots.", 24000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Moong Dal Halwa", "Rich lentil pudding garnished with silver leaf.", 35000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Mysore Pak", "Gram flour and ghee based royal fudge.", 29000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Shahi Tukda", "Royal bread pudding with saffron and dry fruits.", 34000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Malpua", "Indian style pancakes dipped in sugar syrup.", 27000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Basundi", "Sweetened thickened milk flavored with cardamom.", 23000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Seviyan Kheer", "Vermicelli pudding with milk and dry fruits.", 21000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Mango Shrikhand", "Sweetened strained yogurt with mango pulp.", 25000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Double Ka Meetha", "Hyderabadi style bread pudding.", 31000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Puran Poli", "Sweet flatbread stuffed with lentil and jaggery.", 22000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Kaju Katli", "Diamond-shaped cashew fudge with silver leaf.", 45000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Boondi Ladoo", "Sweet balls made from tiny fried gram flour drops.", 24000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Khaja", "Crispy multi-layered sweet pastry.", 19000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"],
      ["Payasam", "Traditional South Indian rice and milk pudding.", 25000, "https://images.unsplash.com/photo-1589119908995-c6800ffca83c?auto=format&fit=crop&q=80&w=800"],
      ["Chenna Poda", "Odia style baked cottage cheese dessert.", 38000, "https://images.unsplash.com/photo-1600353429815-46f414e21626?auto=format&fit=crop&q=80&w=800"]
    ];
    for (const [name, desc, price, img] of dessertItems) {
      await storage.createMenuItem({ categoryId: desserts.id, name: name as string, description: desc as string, price: price as number, imageUrl: img as string, isAvailable: true });
    }

    // --- Drinks (20 items) ---
    const drinkItems = [
      ["Mango Lassi", "Thick creamy yogurt drink with fresh mango pulp.", 18000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Masala Chai", "Traditional Indian tea brewed with aromatic spices.", 12000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Masala Chaas", "Refreshing spiced buttermilk with coriander and cumin.", 10000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Filter Coffee", "Traditional South Indian frothy milk coffee.", 15000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Thandai", "Festive milk drink with nuts and floral notes.", 22000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Nimbu Pani", "Classic Indian lemonade with black salt.", 9000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Jaljeera", "Tangy and digestive cumin-based water.", 11000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Aam Panna", "Refreshing drink made from raw mangoes.", 14000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Rose Sherbet", "Sweet floral drink with rose syrup and chilled water.", 13000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Kokum Sherbet", "Traditional Goan digestive drink with kokum berry.", 16000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Sweet Lassi", "Classic Punjab-style sweet yogurt drink.", 17000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Cold Coffee", "Blended coffee with milk and vanilla ice cream.", 25000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Kala Khatta Mocktail", "Jamun flavored sweet and tangy soda.", 21000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Piyush", "Thick maharashtrian drink made from shrikhand.", 24000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Sol Kadhi", "Pink digestive drink with kokum and coconut milk.", 18000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Lemon Iced Tea", "Chilled black tea with fresh lemon slices.", 19000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Guava Mary", "Spicy guava juice with chili and salt rim.", 23000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Badam Milk", "Chilled milk with almond paste and saffron.", 26000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"],
      ["Fresh Watermelon Juice", "Pure watermelon juice with a hint of lime.", 20000, "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800"],
      ["Coconut Water", "Refreshing pure tender coconut water.", 12000, "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800"]
    ];
    for (const [name, desc, price, img] of drinkItems) {
      await storage.createMenuItem({ categoryId: drinks.id, name: name as string, description: desc as string, price: price as number, imageUrl: img as string, isAvailable: true });
    }

    console.log("Database seeded successfully!");
  }
}
