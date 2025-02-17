﻿using System;
using Exers03.Interfaces;

namespace Exers03.Books
{
    public class Book : IBook
    {
        private string title;
        private string author;
        private decimal price;

        public string Title
        {
            get
            {
                return this.title;
            }

            private set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentNullException("value", "Book title cannot be null, empty or whitespace.");
                }

                this.title = value;
            }
        }

        public string Author
        {
            get
            {
                return this.author;
            }

            private set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentNullException("value", "Book author cannot be null, empty or whitespace.");
                }

                this.author = value;
            }
        }

        public decimal Price
        {
            get
            {
                return this.price;
            }

            private set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("value", "Book price cannot be negative.");
                }

                this.price = value;
            }
        }

        public Book(string title, string author, decimal price)
        {
            this.Title = title;
            this.Author = author;
            this.Price = price;
        }
    }
}