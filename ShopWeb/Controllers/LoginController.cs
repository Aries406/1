using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopWeb.Models;
using System.Net;
using System.Net.Sockets;


namespace ShopWeb.Controllers
{
    public class LoginController : Controller
    {
        ShopDBEntities shopDBEntities = new ShopDBEntities();

        // GET: Loginin
        public ActionResult Index()
        {
            return View();
        }

        // Registerd Action

        //註冊頁面
        public ActionResult Registered()
        {
            RegisteredModel userData = new RegisteredModel();
            return View(userData);
        }

        public JsonResult IsAccountAvailable(string Account)
        {
            return Json (!shopDBEntities.Users.Any(u => u.Account == Account), JsonRequestBehavior.AllowGet);
        }

        //傳送註冊訊息
        [HttpPost] //Registerd Post action
        public ActionResult Registered(RegisteredModel registeredModel)
        {
            if(ModelState.IsValid)
            {
            User objUser = new User();
            objUser.Created = DateTime.Now;
            objUser.Email = registeredModel.Email;
            objUser.Account = registeredModel.Account;
            objUser.Password = registeredModel.Password;
            shopDBEntities.Users.Add(objUser);
            shopDBEntities.SaveChanges();
            registeredModel = new RegisteredModel();
            registeredModel.SuccessMessage = "帳號創建成功";
             return View();
            }
            return View();
        }

        [HttpPost]
        public ActionResult EditPassword(int id)
        {
            var user = shopDBEntities.Users.Single(e => e.UserId == id);
            return View(user);
        }

        //登入頁面
        public ActionResult Login()
        {
            return View();
        }

        //送出登入資料
        [HttpPost]
        public ActionResult Login(LoginModel loginModel)
        {
            UserDBEntities userDBEntities = new UserDBEntities();
            if (ModelState.IsValid)
            {
                if ((shopDBEntities.Users.Where(m => m.Account == loginModel.Account && m.Password == loginModel.Password).FirstOrDefault() == null))
                {
                    ModelState.AddModelError("Error", "帳號密碼不正確");
                    return View();
                }
                else
                {
                        Session["Account"] = loginModel.Account;  //判斷資料庫帳號是否在資料庫

                        if (Session["Account"].ToString() == "aaa111")
                        {
                            return RedirectToAction("Item", "Server"); ;
                        }
                    else
                    {
                        return RedirectToAction("Index", "Home"); ;
                    }
                }
            }

            List<User> user = shopDBEntities.Users.ToList();
            return View(user);
        }

        //登出
        public ActionResult Logout()
        {
            Session.Abandon();
            return RedirectToAction("Login","Login");

        }

    }
}