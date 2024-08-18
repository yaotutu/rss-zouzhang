/*
  Warnings:

  - Added the required column `rssName` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceUrl" TEXT,
    "rssContent" TEXT NOT NULL,
    "rssName" TEXT NOT NULL,
    "periodIndex" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Article" ("createdAt", "id", "periodIndex", "rssContent", "sourceUrl", "updatedAt") SELECT "createdAt", "id", "periodIndex", "rssContent", "sourceUrl", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_periodIndex_key" ON "Article"("periodIndex");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
