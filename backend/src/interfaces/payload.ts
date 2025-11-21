import { Request } from "express";
import { User } from "generated/prisma";

export interface Payload extends Request{
User: User;
}