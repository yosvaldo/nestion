import repo from "../repositories/report.repository.js";

class ReportService {
  async getSalesReport(tenantId: string, start?: string, end?: string, sort?: "date" | "total") {
    const data = await repo.getSales(tenantId, start, end, sort || "date");
    const totalRevenue = data.reduce((sum, order) => sum + order.totalPrice, 0);
    return { data, summary: { totalRevenue, totalTransactions: data.length } };
  }

  async getPropertyCalendar(tenantId: string) {
    return repo.getPropertyCalendar(tenantId);
  }
}
export default new ReportService();