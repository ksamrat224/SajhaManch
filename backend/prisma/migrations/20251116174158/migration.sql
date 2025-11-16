/*
  Warnings:

  - A unique constraint covering the columns `[name,pollId]` on the table `poll_options` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,pollOptionId]` on the table `votes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "poll_options_name_pollId_key" ON "poll_options"("name", "pollId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_pollOptionId_key" ON "votes"("userId", "pollOptionId");
