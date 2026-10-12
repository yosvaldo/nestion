import type { Request, Response, NextFunction } from "express";
import service from "../services/report.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";

class ReportController {
  getSales = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.id;
      const { start, end, sort } = req.query;
      const result = await service.getSalesReport(tenantId, start as string, end as string, sort as any);
      return res.send(responseBuilder(200, "Sales report fetched", result));
    } catch (e) { next(e); }
  };

  getCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.id;
      const result = await service.getPropertyCalendar(tenantId);
      return res.send(responseBuilder(200, "Property calendar fetched", result));
    } catch (e) { next(e); }
  };
}
export default new ReportController();