using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed sample data
            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    Id = 1,
                    Title = "Complete project documentation",
                    Description = "Write comprehensive documentation for the TODO app",
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    DueAt = DateTime.UtcNow.AddDays(3),
                    IsCompleted = false
                },
                new TaskItem
                {
                    Id = 2,
                    Title = "Review pull requests",
                    Description = "Review and merge pending PRs",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    DueAt = DateTime.UtcNow.AddDays(-1),
                    IsCompleted = true
                },
                new TaskItem
                {
                    Id = 3,
                    Title = "Fix login bug",
                    Description = "Resolve authentication issue in production",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    DueAt = DateTime.UtcNow.AddDays(-2),
                    IsCompleted = false
                },
                new TaskItem
                {
                    Id = 4,
                    Title = "Update dependencies",
                    Description = "Update npm packages and NuGet packages",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    DueAt = DateTime.UtcNow.AddDays(5),
                    IsCompleted = false
                },
                new TaskItem
                {
                    Id = 5,
                    Title = "Design system review",
                    Description = "Review new design system components",
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    DueAt = DateTime.UtcNow.AddDays(2),
                    IsCompleted = false
                }
            );
        }
    }
}
