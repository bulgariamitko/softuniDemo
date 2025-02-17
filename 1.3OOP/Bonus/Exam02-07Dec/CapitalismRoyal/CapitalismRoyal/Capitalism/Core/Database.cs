﻿using System.Collections.Generic;
using Capitalism.Interfaces;
using Capitalism.Models.Interfaces;

namespace Capitalism.Core
{
    public class Database : IDatabase
    {
        private readonly IList<IOrganizationalUnit> companies;
         
        public Database()
        {
            this.companies = new List<IOrganizationalUnit>();
        }

        public IEnumerable<IOrganizationalUnit> Companies
        {
            get { return this.companies; }
        }

        public void AddCompany(IOrganizationalUnit company)
        {
            this.companies.Add(company);
        }
    }
}