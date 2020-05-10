using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopWeb.Models;
using PagedList;
using System.IO;
using System.Data.Entity;

namespace ShopWeb.Controllers
{
    public class ServerController : Controller
    {
        private ShopDBEntities db;

        public ServerController()
        {
            db = new ShopDBEntities();
        }
        // GET: Item

        //後台加入商品頁面
        public ActionResult Item()
        {
            ItemModel itemModel = new ItemModel();
         

            itemModel.CategorySelectListItems = (from objitem in db.Categories
                                                 select new SelectListItem()
                                                 {
                                                     Text = objitem.CategoryCode,
                                                     Value = objitem.CategoryId.ToString(),
                                                     Selected = true
                                                 });
            return View(itemModel);
        }

        //新增商品到前台
        [HttpPost]
        public JsonResult Item(ItemModel itemModel)
        {

            string NewImage = Guid.NewGuid() + Path.GetExtension(itemModel.ImagePath.FileName);

            itemModel.ImagePath.SaveAs(Server.MapPath("~/Content/img/products" + NewImage));

            Item item = new Item();
            item.ImagePath = "~/Content/img/products" + NewImage;
            item.CategoryId = itemModel.CategoryId;
            item.Description = itemModel.Description;
            item.ZoneName = itemModel.ZoneName;
            item.ItemId = Guid.NewGuid();
            item.ItemName = itemModel.ItemName;
            item.ItemPrice = itemModel.ItemPrice;
            db.Items.Add(item);
            db.SaveChanges();
            return Json(new { Success = true, Message = "商品加入成功" }, JsonRequestBehavior.AllowGet);
        }
         
        // GET: Server

        
        //訂單明細頁面
        public ActionResult Order(string search,int? i)
        {
            List<OrderDetail> orderDetailModels = db.OrderDetails.ToList();
            return View(db.OrderDetails.Where(m => m.OrderId.ToString().StartsWith(search) || search == null).ToList().ToPagedList(i ?? 1,10)); //分頁
        }

        //刪除員工帳號
        public ActionResult DeleteAdmiin(int id)
        {
            UserDBEntities userDB = new UserDBEntities();
            var item = userDB.admin.Where(x => x.UserId == id).FirstOrDefault();
            userDB.admin.Remove(item);
            userDB.SaveChanges();
            return RedirectToAction("Order");
        }

        //編輯員工帳號

        public ActionResult EditAdmin(int id)
        {
            UserDBEntities userDB = new UserDBEntities();
            var user = userDB.admin.Single(e => e.UserId == id);
            return View(user);
        }

        [HttpPost]
        public ActionResult EditAdmin(User user)
        {
            if(ModelState.IsValid)
            {
                UserDBEntities userDB = new UserDBEntities();
                userDB.Entry(user).State = EntityState.Modified;
                userDB.SaveChanges();
                return RedirectToAction("Employee");
            }
            return View(user);
        }


        //員工帳號頁面
        public ActionResult Employee(string search)
        {
            UserDBEntities userDBEntities = new UserDBEntities();
            List<admin> employee = userDBEntities.admin.ToList();
            
            return View(userDBEntities.admin.Where(e => e.Account.StartsWith(search) || search == null));  //搜尋
        }

        //刪除會員帳號
        public ActionResult DeleteEmployee(int id)
        {
            try {
                var item = db.Users.Where(x => x.UserId == id).FirstOrDefault();
                db.Users.Remove(item);
                db.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
            return RedirectToAction("Member");
        }

        //編輯
        public ActionResult EditEmployee(string id)
        {
            return View();
        }

        //後台刪除
        public ActionResult DeleteCart(int id)
        {
            var item = db.OrderDetails.Where(x => x.OrderId == id).FirstOrDefault();
            db.OrderDetails.Remove(item);
            db.SaveChanges();
            return RedirectToAction("Order");
        }

        //會員帳號頁面

        public ActionResult Member(string search)
        {
            List<User> users = db.Users.ToList();
            return View(db.Users.Where(m => m.Account.StartsWith(search) || search == null));

        }
    }


    }
