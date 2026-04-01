using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Services;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks([FromQuery] string? status)
        {
            var tasks = await _taskService.GetAllTasksAsync(status);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound(new { message = $"Task with id {id} not found" });

            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto createTaskDto)
        {
            if (createTaskDto.DueAt.ToUniversalTime() <= DateTime.UtcNow)
            {
                return BadRequest(new { message = "Due date must be in the future" });
            }

            var task = await _taskService.CreateTaskAsync(createTaskDto);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, UpdateTaskDto updateTaskDto)
        {
            if (updateTaskDto.DueAt <= DateTime.UtcNow && !updateTaskDto.IsCompleted)
            {
                return BadRequest(new { message = "Due date must be in the future for pending tasks" });
            }

            var updatedTask = await _taskService.UpdateTaskAsync(id, updateTaskDto);
            if (updatedTask == null)
                return NotFound(new { message = $"Task with id {id} not found" });

            return Ok(updatedTask);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var deleted = await _taskService.DeleteTaskAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Task with id {id} not found" });

            return NoContent();
        }
    }
}
