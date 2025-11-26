/*
  Warnings:

  - Made the column `endsAt` on table `polls` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "polls" ALTER COLUMN "endsAt" SET NOT NULL;
