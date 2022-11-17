using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WordPadcc.Models
{
    [Table("WordPadCC")]
    public class WordPad
    {
        [Key]
        public string Id { get; set; }

        [Column(TypeName = "text")]
        public string Content { get; set; }

        [StringLength(100)]
        public string Password { get; set; }

        [Required]
        [StringLength(100)]
        public string Url { get; set; }

        [Required]
        public bool IsModified { get; set; }
    }
}
