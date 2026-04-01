using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        private string GetTaskStatus(TaskItem task)
        {
            if (task.IsCompleted)
                return "Completed";
            if (DateTime.UtcNow > task.DueAt)
                return "Overdue";
            return "Pending";
        }

        private TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                CreatedAt = task.CreatedAt,
                DueAt = task.DueAt,
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

        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto)
        {
            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                DueAt = createTaskDto.DueAt.ToUniversalTime(),
                IsCompleted = false
            };

            var createdTask = await _taskRepository.CreateAsync(task);
            return MapToDto(createdTask);
        }

        public async Task<TaskDto?> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto)
        {
            var existingTask = await _taskRepository.GetByIdAsync(id);
            if (existingTask == null)
                return null;

            existingTask.Title = updateTaskDto.Title;
            existingTask.Description = updateTaskDto.Description;
            existingTask.DueAt = updateTaskDto.DueAt.ToUniversalTime();
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
