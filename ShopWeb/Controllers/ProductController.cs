using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using ShopWeb.Models;
using PagedList;


namespace ShopWeb.Controllers
{
    public class ProductController : Controller
    {

        private ShopDBEntities db;
        private List<CartModel> listcartModels;

        public ProductController()
        {
            db = new ShopDBEntities();
            listcartModels = new List<CartModel>();
        }

        //商品頁面  
        // GET: Shopping
        [HttpGet]
        public ActionResult Product(string search,string SortZone ,int? page)
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
                                                       }).ToList();  //Linq抓取資料

            if (!String.IsNullOrEmpty(search))
            {
              productModels = productModels.Where(m => m.ItemName.StartsWith(search) || search == null);
            } 
            if (!String.IsNullOrEmpty(SortZone))
            {
                productModels = productModels.Where(m => m.CountryName == SortZone);
            }
            ItemModel itemModel = new ItemModel();
            itemModel.CountrySelectListItems = GetCountryList();


            ViewBag.SortZone = new SelectList(productModels, "CountryName", "CountryName");

            ViewBag.CountryList = new SelectList(GetCountryList(), "CountryId", "CountryName");

            return View(productModels.ToList().ToPagedList(page ?? 1, 8)); //pageList進行分頁
        }

        public List<Country> GetCountryList()
        {
            ShopDBEntities db = new ShopDBEntities();
            List<Country> countries = db.Countries.ToList();
            return countries;
        }
        public ActionResult GetZoneView(int CountryId)
        {
            List<TwZone> twZones = db.TwZones.Where(x => x.CountryId == CountryId).ToList();
            ViewBag.ZoneList = (from objItem in db.Items
                                where objItem.CountryId == CountryId 
                                select new ProductModel()
                                {
                                    ImagePath = objItem.ImagePath,
                                    ItemName = objItem.ItemName,
                                    Description = objItem.Description,
                                    CountryName = objItem.ZoneName,
                                    ItemPrice = objItem.ItemPrice,
                                    ItemId = objItem.ItemId,
                                }).ToList();
            return PartialView("ZoneView");
        }

        //public ActionResult GetZoneView(int CountryId)
        //{
        //    ShopDBEntities db = new ShopDBEntities();

        //    IEnumerable<ProductModel> productModels= (from objItem in db.Items
        //                                               join
        //                                                    objcart in db.Categories
        //                                                    on objItem.CategoryId equals objcart.CategoryId
        //                                               select new ProductModel()
        //                                               {
        //                                                   ImagePath = objItem.ImagePath,
        //                                                   ItemName = objItem.ItemName,
        //                                                   Description = objItem.Description,
        //                                                   CountryName = objItem.ZoneName,
        //                                                   ItemPrice = objItem.ItemPrice,
        //                                                   ItemId = objItem.ItemId,
        //                                                   Category = objcart.CategoryName
        //                                               }).ToList();  //Linq抓取資料

        //    ViewBag.ZoneView = productModels;

        //    return PartialView("ZoneView");
        //}


        [HttpPost]
        public JsonResult Product(string ItemId)
        {

            CartModel cartModel = new CartModel(); //使用CartModel的資料

            Item item = db.Items.Single(model => model.ItemId.ToString() == ItemId);

            if (Session["CartCounter"] != null)
            {
                listcartModels = Session["CartItem"] as List<CartModel>;
            }
           
                if (listcartModels.Any(model => model.ItemId == ItemId))
                {
                    cartModel = listcartModels.Single(model => model.ItemId == ItemId);
                    cartModel.Quantity = cartModel.Quantity + 1;
                    cartModel.Total = cartModel.Quantity * cartModel.UnitPrice;
                }
                else
                {
                    cartModel.ItemId = ItemId;
                    cartModel.ImagePath = item.ImagePath;
                    cartModel.ItemName = item.ItemName;
                    cartModel.Quantity = 1;
                    cartModel.Total = item.ItemPrice;
                    cartModel.UnitPrice = item.ItemPrice;
                    listcartModels.Add(cartModel);

                }
          
            Session["CartCounter"] = listcartModels.Count;
            Session["CartItem"] = listcartModels;

            return Json(new { Success = true, Counter = listcartModels.Count }, JsonRequestBehavior.AllowGet);
        }

       //商品明細
        public ActionResult ProductDetail(string id)
        {
            ShopDBEntities db = new ShopDBEntities();
            IEnumerable<ProductModel> productModels = (from objItem in db.Items
                                                       join
                                                            objcart in db.ItemDetails
                                                            on objItem.ItemName equals objcart.ItemName
                                                       select new ProductModel()
                                                       {
                                                           ImagePath = objItem.ImagePath,
                                                           ItemName = objItem.ItemName,
                                                           Description = objItem.Description,
                                                           ItemPrice = objItem.ItemPrice,
                                                           ItemId = objItem.ItemId,
                                                       }).ToList();  //Linq抓取資料

            var product = db.Items.Where(e => e.ItemName == id).Single();
            return View(product);
        }

        //購物車頁面
        public ActionResult ShoppingCart()
        {
            listcartModels = Session["CartItem"] as List<CartModel>;
            ViewBag.CountryList = new SelectList(GetTwCountrList(), "CountryId", "CountryName");
            return View(listcartModels);
        }

        public List<TwCountry> GetTwCountrList()
        {
            List<TwCountry> twCountries = db.TwCountries.ToList();
            return twCountries;
        }

        public ActionResult GetTwZoneList(int CountryId)
        {
            List<TwZone> twZones = db.TwZones.Where(x => x.CountryId == CountryId).ToList();
            ViewBag.ZoneList = new SelectList(twZones, "ZoneId", "ZoneName");
            return PartialView("ZoneList");
        }

        //送出訂單
        [HttpPost]
        public ActionResult AddOrder()
        {
            int OrderId = 0;
            listcartModels = Session["CartItem"] as List<CartModel>;
            Order order = new Order()
            {
                OrderDate = DateTime.Now,
                OrderNumber = String.Format("{0:ddmmyyyyHHmmss}", DateTime.Now)
            };
            db.Orders.Add(order);
            db.SaveChanges();
            OrderId = order.OrderId;

            foreach (var item in listcartModels)
            {
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.CountryName = item.CountryName;  
                orderDetail.Total = item.Total;
                orderDetail.ItemId = item.ItemId;
                orderDetail.OrderId = OrderId;
                orderDetail.Quantity = item.Quantity;
                orderDetail.UnitPrice = item.UnitPrice;

                db.OrderDetails.Add(orderDetail);
                db.SaveChanges();
            }

            Session["CartItem"] = null;
            Session["CartCounter"] = null;

            return RedirectToAction("Product");
        }

        //刪除購物車
        [HttpPost]
        public ActionResult DelectToCart(int id)
        {

            return View();
        }

        public ActionResult Payment()
        {
            List<OrderDetail> orderDetails = db.OrderDetails.ToList();
            return View(orderDetails);
        }
    }
}