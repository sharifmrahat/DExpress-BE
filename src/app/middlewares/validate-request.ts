import { RequestHandler } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';
const validateRequest = (
  schema: AnyZodObject | ZodEffects<AnyZodObject>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
