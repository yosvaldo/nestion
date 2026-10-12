import cron from "node-cron";
import { prisma } from "../libs/prisma.client.js";
import { OrderStatus } from "../generated/prisma/client.js";

class CronService {
  init() {
    cron.schedule("* * * * *", async () => {
      try {
        const now = new Date();
        const expiredOrders = await prisma.order.updateMany({
          where: {
            status: OrderStatus.MENUNGGU_PEMBAYARAN,
            paymentExpiresAt: { lt: now },
          },
          data: {
            status: OrderStatus.DIBATALKAN,
          },
        });
        
        if (expiredOrders.count > 0) {
          console.log(`[Cron] Membatalkan ${expiredOrders.count} pesanan yang melewati 1 jam.`);
        }
      } catch (error) {
        console.error("[Cron] Gagal mengeksekusi pembatalan otomatis:", error);
      }
    });
  }
}

export default new CronService();