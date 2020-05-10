using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace ShopWeb.Models
{
    public class ItemModel
    {
        public Guid itemId { get; set; }

        public string CountryName { get; set; }

        public int CategoryId { get; set; }

        public string ZoneName { get; set; }

        public string ItemName { get; set; }
        
        public string Description { get; set; }

        public decimal ItemPrice { get; set; }

        public List<Country> CountrySelectListItems { get; set; }

        public HttpPostedFileBase ImagePath { get; set; } 

        public IEnumerable<SelectListItem> CategorySelectListItems { get; set; }

        //public IEnumerable<SelectListItem> CountrySelectListItems { get; set; }

    }
}