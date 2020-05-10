using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShopWeb.Models
{
    public class OrderDetailModel
    {
        public int OrderDetailId { get; set; }

        public string OrderId { get; set; }

        public string ItemId { get; set; }

        public decimal Quantity { get; set; }

        public decimal UnitPrice  { get; set; }

        public decimal Total { get; set; }

    }
}