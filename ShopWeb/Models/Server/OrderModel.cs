using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ShopWeb.Models
{
    public class OrderModel
    {
        public int OrderId { get; set; }

        public DateTime OrderData { get; set; }

        public string OrderNumber { get; set; }

    }
}