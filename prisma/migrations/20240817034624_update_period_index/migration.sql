/*
  Warnings:

  - A unique constraint covering the columns `[periodIndex]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_periodIndex_key" ON "Article"("periodIndex");
