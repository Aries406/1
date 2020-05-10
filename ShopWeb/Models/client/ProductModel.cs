using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShopWeb.Models
{
    public class ProductModel
    {
        public Guid ItemId { get; set; }

        public int CountryId { get; set; }
        public string ItemName { get; set; }

        public decimal ItemPrice { get; set; }

        public string ImagePath { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string CountryName { get; set; }

        public int ItemDetailId { get; set; }

    }
}