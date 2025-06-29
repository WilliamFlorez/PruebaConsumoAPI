using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class SearchHistory
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public DateTime SearchDate { get; set; }

    [Required]
    [Column(TypeName = "text")]
    public string Fact { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Query { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "text")]
    public string GifUrl { get; set; } = string.Empty;
}