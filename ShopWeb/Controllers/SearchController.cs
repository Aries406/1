using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShopWeb.Models;

namespace ShopWeb.Controllers
{
    public class SearchController : Controller
    {
        UserDBEntities userDB = new UserDBEntities();

        // GET: Search
        public ActionResult Index(string search)
        {
            return View(userDB.admin.Where(x => x.Account.Contains(search) || search == null).ToList());
        }
    }
}