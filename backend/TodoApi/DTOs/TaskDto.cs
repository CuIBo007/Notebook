namespace TodoApi.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime DueAt { get; set; }
        public bool IsCompleted { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
