using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs
{
    public class UpdateTaskDto
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public DateTime DueAt { get; set; }
        
        public bool IsCompleted { get; set; }
    }
}
