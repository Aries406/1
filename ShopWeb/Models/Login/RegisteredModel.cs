using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShopWeb.Models
{
    [MetadataType(typeof(RegisteredModel))]
    public partial class Registered
    {
        public string Password2 { get; set; }
    }

    public class RegisteredModel
    {
       
            public int UserId { get; set; }

            [Required(AllowEmptyStrings = false, ErrorMessage = "帳號不能空")]
            [StringLength(50, MinimumLength = 6, ErrorMessage = "至少輸入6個數字")]
            [Remote("IsAccountAvailable","Login",ErrorMessage ="帳號已申請過")]

            public string Account { get; set; }
            [Required(AllowEmptyStrings = false, ErrorMessage = "密碼不能空")]
            [StringLength(50, MinimumLength = 6, ErrorMessage = "至少輸入6個數字")]
            [DataType(DataType.Password)]
            public string Password { get; set; }
            [Required(AllowEmptyStrings = false, ErrorMessage = " 確認密碼不能空")]
            [DataType(DataType.Password)]
            [System.Web.Mvc.Compare("Password", ErrorMessage = "需和密碼相同")]
            public string Password2 { get; set; }

            [Required(AllowEmptyStrings = false, ErrorMessage = " 信箱不能空")]
            [EmailAddress(ErrorMessage = "信箱格式輸入錯誤")]
     
            public string Email { get; set; }

            public DateTime Created { get; set; }

            public string SuccessMessage { get; set; }

      
    }
}