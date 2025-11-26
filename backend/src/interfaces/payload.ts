import { Request } from "express";
import { User } from '@prisma/client';

export interface Payload extends Request{
payload : User;
}