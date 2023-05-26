/*
  Warnings:

  - A unique constraint covering the columns `[user_id,book_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ratings_user_id_book_id_idx` ON `ratings`;

-- CreateIndex
CREATE UNIQUE INDEX `ratings_user_id_book_id_key` ON `ratings`(`user_id`, `book_id`);
