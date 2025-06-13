/*
  Warnings:

  - You are about to drop the `user_audits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_audits";
PRAGMA foreign_keys=on;
