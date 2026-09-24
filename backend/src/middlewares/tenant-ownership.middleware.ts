import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/app.error.js";
import { prisma } from "../libs/prisma.client.js";

export const verifyPropertyOwnership = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.user?.id || (req.user as any)?.userId;
    
    const rawPropertyId = req.params.id || req.params.propertyId;
    const propertyId = Array.isArray(rawPropertyId) ? rawPropertyId[0] : rawPropertyId;

    if (!tenantId) throw new AppError("Unauthorized.", 401);
    if (!propertyId) throw new AppError("Property ID is required.", 400);

    const property = await prisma.property.findFirst({
      where: { id: propertyId, tenantId, deletedAt: null },
    });

    if (!property) {
      throw new AppError("Property not found or access denied.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyRoomOwnership = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.user?.id || (req.user as any)?.userId;
    
    const rawRoomId = req.params.roomId || req.params.id;
    const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId;

    if (!tenantId) throw new AppError("Unauthorized.", 401);
    if (!roomId) throw new AppError("Room ID is required.", 400);

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        deletedAt: null,
        property: { tenantId, deletedAt: null },
      },
    });

    if (!room) {
      throw new AppError("Room not found or access denied.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};