import { Request, Response } from "express";

import AppError from "../errors/AppError";

import UpdateSettingService from "../services/SettingServices/UpdateSettingService";
import ListSettingsService from "../services/SettingServices/ListSettingsService";
// const { getIO } = require("../libs/socket");

export const index = async (req: Request, res: Response): Promise<Response> => {
  if (req.user.profile !== "admin") {
    throw new AppError("Only administrators can access resource.", 403);
  }

  const settings = await ListSettingsService();

  return res.status(200).json(settings);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (req.user.profile !== "admin") {
    throw new AppError("Only administrators can access this route.", 403);
  }
  const { settingKey: key } = req.params;
  const { value } = req.body;

  const setting = await UpdateSettingService({
    key,
    value
  });

  // const io = getIO();
  // io.emit("settings", {
  //   action: "update",
  //   setting
  // });

  return res.status(200).json(setting);
};