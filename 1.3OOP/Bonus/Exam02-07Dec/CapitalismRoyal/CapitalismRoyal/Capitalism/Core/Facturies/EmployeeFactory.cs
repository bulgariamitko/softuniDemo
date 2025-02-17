﻿using System;
using Capitalism.Models;
using Capitalism.Models.Interfaces;

namespace Capitalism.Core.Facturies
{
    public static class EmployeeFactory
    {
        public static IEmployee Create(string firstName, string lastName, string position, IOrganizationalUnit inUnit, decimal salary = 0)
        {
            switch (position)
            {
                case "CEO":
                    return new Ceo(firstName, lastName, inUnit, salary);
                case "Manager":
                    return new Manager(firstName, lastName, inUnit);
                case "Regular":
                    return new Regular(firstName, lastName, inUnit);
                case "Salesman":
                    return new Salesmen(firstName, lastName, inUnit);
                case "CleaningLady":
                    return new CleaningLady(firstName, lastName, inUnit);
                case "ChiefTelephoneOfficer":
                    return new ChiefTelephoneOfficer(firstName, lastName, inUnit);
                case "Accountant":
                    return new Accountant(firstName, lastName, inUnit);
                default:
                    throw new NotSupportedException("Invalid position supplied!");
            }
        }
    }
}