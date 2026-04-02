using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly TimeZoneInfo _nepalTimeZone;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
            _nepalTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Nepal Standard Time");
        }

        /// <summary>
        /// Determines the status of a task based on Nepal time.
        /// </summary>
        private string GetTaskStatus(TaskItem task)
        {
            if (task.IsCompleted)
                return "Completed";

            // Current time in Nepal
            DateTime nowNepal = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _nepalTimeZone);

            // Task due time in Nepal
            DateTime dueNepal = TimeZoneInfo.ConvertTimeFromUtc(task.DueAt, _nepalTimeZone);

            Console.WriteLine($"🕐 Nepal Time Debug - Task {task.Id}:");
            Console.WriteLine($"   UTC Now: {DateTime.UtcNow}");
            Console.WriteLine($"   Nepal Now: {nowNepal}");
            Console.WriteLine($"   UTC Due: {task.DueAt}");
            Console.WriteLine($"   Nepal Due: {dueNepal}");
            Console.WriteLine($"   Status: {(nowNepal > dueNepal ? "Overdue" : "Pending")}");

            return nowNepal > dueNepal ? "Overdue" : "Pending";
        }

        /// <summary>
        /// Maps TaskItem to TaskDto and converts DueAt to Nepal Time for display.
        /// </summary>
        private TaskDto MapToDto(TaskItem task)
        {
            DateTime dueNepal = TimeZoneInfo.ConvertTimeFromUtc(task.DueAt, _nepalTimeZone);

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                CreatedAt = task.CreatedAt,
                DueAt = dueNepal, // now already Nepal time
                IsCompleted = task.IsCompleted,
                Status = GetTaskStatus(task)
            };
        }

        public async Task<IEnumerable<TaskDto>> GetAllTasksAsync(string? status = null)
        {
            var tasks = await _taskRepository.GetAllAsync();
            var taskDtos = tasks.Select(t => MapToDto(t));

            if (!string.IsNullOrEmpty(status))
            {
                taskDtos = taskDtos.Where(t => 
                    t.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
            }

            return taskDtos;
        }

        public async Task<TaskDto?> GetTaskByIdAsync(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            return task != null ? MapToDto(task) : null;
        }

        /// <summary>
        /// Creates a new task and ensures DueAt is stored as UTC.
        /// </summary>
        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto)
        {
            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,

                // Store in UTC safely
                DueAt = createTaskDto.DueAt.Kind switch
                {
                    DateTimeKind.Local => createTaskDto.DueAt.ToUniversalTime(),
                    DateTimeKind.Unspecified => DateTime.SpecifyKind(createTaskDto.DueAt, DateTimeKind.Utc),
                    _ => createTaskDto.DueAt
                },

                IsCompleted = false
            };

            var createdTask = await _taskRepository.CreateAsync(task);
            return MapToDto(createdTask);
        }

        /// <summary>
        /// Updates an existing task and ensures DueAt is stored as UTC.
        /// </summary>
        public async Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto)
        {
            var existingTask = await _taskRepository.GetByIdAsync(id);
            if (existingTask == null)
                return null;

            // Update fields with UTC Kind enforcement
            existingTask.Title = updateTaskDto.Title;
            existingTask.Description = updateTaskDto.Description;
            existingTask.DueAt = DateTime.SpecifyKind(updateTaskDto.DueAt, DateTimeKind.Utc);
            existingTask.IsCompleted = updateTaskDto.IsCompleted;

            var updatedTask = await _taskRepository.UpdateAsync(existingTask);
            return MapToDto(updatedTask);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            return await _taskRepository.DeleteAsync(id);
        }
    }
}
