using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using System.Data;
using ShopWeb.Models;




namespace ShopWeb.Controllers
{
    public class HomeController : Controller
    {
        ShopDBEntities db = new ShopDBEntities();
        
        //主頁面
        public ActionResult Index()
        {

            IEnumerable<ProductModel> productModels = (from objItem in db.Items
                                                       join
                                                            objcart in db.Categories
                                                            on objItem.CategoryId equals objcart.CategoryId
                                                       select new ProductModel()
                                                       {
                                                           ImagePath = objItem.ImagePath,
                                                           ItemName = objItem.ItemName,
                                                           Description = objItem.Description,
                                                           CountryName = objItem.ZoneName,
                                                           ItemPrice = objItem.ItemPrice,
                                                           ItemId = objItem.ItemId,
                                                           Category = objcart.CategoryName
                                                       }).ToList();  //


            ViewBag.hot = (from objItem in db.Items where objItem.TabName == "熱門"
                                                       select objItem);  //
            ViewBag.sale = (from objItem in db.Items
                           where objItem.TabName == "特價"
                           select objItem);  //Linq抓取資料
            ViewBag.recommended = (from objItem in db.Items
                           where objItem.TabName == "推薦"
                           select objItem);  //Linq抓取資料

            return View(productModels);
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        //刪除
        public ActionResult About()
        {
            return View();
        }


    }
}