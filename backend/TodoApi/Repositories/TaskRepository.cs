using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;
using System.Collections.Generic;

namespace TodoApi.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            //  Using AsNoTracking to prevent tracking conflicts and improve performance
            var tasks = await _context.Tasks
                .AsNoTracking()
                .ToListAsync();
            
            //  Forcing UTC Kind after reading from database
            return tasks.Select(t => new TaskItem
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                CreatedAt = DateTime.SpecifyKind(t.CreatedAt, DateTimeKind.Utc),
                DueAt = DateTime.SpecifyKind(t.DueAt, DateTimeKind.Utc),
                IsCompleted = t.IsCompleted
            }).ToList();
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            var task = await _context.Tasks
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
                
            if (task == null) return null;
            
            return new TaskItem
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                CreatedAt = DateTime.SpecifyKind(task.CreatedAt, DateTimeKind.Utc),
                DueAt = DateTime.SpecifyKind(task.DueAt, DateTimeKind.Utc),
                IsCompleted = task.IsCompleted
            };
        }

        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            task.CreatedAt = DateTime.UtcNow;
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem> UpdateAsync(TaskItem task)
        {
            var existingTask = await _context.Tasks.FindAsync(task.Id);
            
            if (existingTask == null)
                throw new KeyNotFoundException($"Task with id {task.Id} not found.");

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.DueAt = task.DueAt;
            existingTask.IsCompleted = task.IsCompleted;

            await _context.SaveChangesAsync();
            return existingTask;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Tasks.AnyAsync(e => e.Id == id);
        }
    }
}
