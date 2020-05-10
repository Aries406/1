using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ShopWeb.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "帳號輸入錯誤")]
        public string Account { get; set; }
        [Required(ErrorMessage = "密碼輸入錯誤")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}