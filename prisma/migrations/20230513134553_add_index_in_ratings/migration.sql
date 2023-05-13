-- CreateIndex
CREATE INDEX `ratings_user_id_book_id_idx` ON `ratings`(`user_id`, `book_id`);
