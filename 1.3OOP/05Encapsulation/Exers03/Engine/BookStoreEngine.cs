﻿using System.Collections.Generic;
using System.Linq;
using Exers03.Books;
using Exers03.Interfaces;

namespace Exers03.Engine
{
    public class BookStoreEngine
    {
        private readonly List<IBook> books;
        private decimal revenue;
        private readonly IRenderer renderer;
        private readonly IInputHandler inputHandler;

        public bool IsRunning { get; private set; }

        public BookStoreEngine(IRenderer renderer, IInputHandler inputHandler)
        {
            this.books = new List<IBook>();
            this.revenue = 0;
            this.renderer = renderer;
            this.inputHandler = inputHandler;
            this.IsRunning = true;
        }

        public void Run()
        {
            while (this.IsRunning)
            {
                string command = this.inputHandler.ReadLine();

                if (string.IsNullOrWhiteSpace(command))
                {
                    continue;
                }

                string[] commandArgs = command.Split();

                string commandResult = this.ExecuteCommand(commandArgs);

                this.renderer.WriteLine(commandResult);
            }

            this.renderer.WriteLine("Total revenue: {0:F2}", this.revenue.ToString());
        }

        private string ExecuteCommand(string[] commandArgs)
        {
            switch (commandArgs[0])
            {
                case "add":
                    return this.ExecuteAddBookCommand(commandArgs);
                case "sell":
                    return this.ExecuteSellBookCommand(commandArgs);
                case "remove":
                    return this.ExecuteRemoveBookCommand(commandArgs);
                case "stop":
                    this.IsRunning = false;
                    return "Goodbye!";
                default:
                    return "Unknown command";
            }
        }

        private string ExecuteSellBookCommand(string[] commandArgs)
        {
            string title = commandArgs[1];
            IBook bookToSell = this.books.FirstOrDefault(book => book.Title == title);

            if (bookToSell == null)
            {
                return "Book does not exist";
            }

            this.books.Remove(bookToSell);
            this.revenue += bookToSell.Price;
            return "Book sold";
        }

        private string ExecuteRemoveBookCommand(string[] commandArgs)
        {
            string title = commandArgs[1];

            IBook bookToSellOrRemove = this.books.FirstOrDefault(book => book.Title == title);

            if (bookToSellOrRemove == null)
            {
                return "Book does not exist";
            }

            this.books.Remove(bookToSellOrRemove);

            return "Book removed";
        }

        private string ExecuteAddBookCommand(string[] commandArgs)
        {
            string title = commandArgs[1];
            string author = commandArgs[2];
            decimal price = decimal.Parse(commandArgs[3]);

            this.books.Add(new Book(title, author, price));

            return "Book added";
        }
    }
}