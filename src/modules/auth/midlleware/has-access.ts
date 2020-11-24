import { NextFunction, Request, Response } from "express";
import { CommandBus } from "../../../shared/command-bus";

export interface HasAccessMiddlewareDependencies {
  commandBus: CommandBus;
  securityClient: any;
}

export const hasAccessMiddleware = (dependencies: HasAccessMiddlewareDependencies) => {
  const { securityClient } = dependencies;

  return (resources: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken = "" } = res.locals;

    const { hasAccess } = await securityClient.users.hasAccess({ resources }, { accessToken });

    if (!hasAccess) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    return next();
  };
};
