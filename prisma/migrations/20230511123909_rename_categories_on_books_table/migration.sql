/*
  Warnings:

  - You are about to drop the `CategoriesOnBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CategoriesOnBooks` DROP FOREIGN KEY `CategoriesOnBooks_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `CategoriesOnBooks` DROP FOREIGN KEY `CategoriesOnBooks_category_id_fkey`;

-- DropTable
DROP TABLE `CategoriesOnBooks`;

-- CreateTable
CREATE TABLE `categories_on_books` (
    `book_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`book_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories_on_books` ADD CONSTRAINT `categories_on_books_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories_on_books` ADD CONSTRAINT `categories_on_books_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
