using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using FranchiseApi.Exceptions;
using FranchiseApi.Models;

namespace FranchiseApi.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ErrorHandlingMiddleware(
        RequestDelegate next, 
        ILogger<ErrorHandlingMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        ErrorResponse errorResponse;

        switch (exception)
        {
            case BusinessException businessEx:
                // Excepciones de negocio (400, 404, 409, etc.)
                response.StatusCode = businessEx.StatusCode;
                errorResponse = new ErrorResponse(
                    businessEx.StatusCode,
                    businessEx.Message
                );
                _logger.LogWarning(businessEx, "Business exception: {Message}", businessEx.Message);
                break;

            case DbUpdateException dbEx:
                // Errores de base de datos
                response.StatusCode = (int)HttpStatusCode.Conflict;
                var message = "A database error occurred";
                
                // Detectar violación de foreign key
                if (dbEx.InnerException?.Message.Contains("REFERENCE constraint") == true)
                {
                    message = "Cannot delete this record because it has associated data";
                }
                
                errorResponse = new ErrorResponse(
                    response.StatusCode,
                    message,
                    _env.IsDevelopment() ? dbEx.InnerException?.Message : null
                );
                _logger.LogError(dbEx, "Database error: {Message}", dbEx.Message);
                break;

            default:
                // Errores no manejados
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse = new ErrorResponse(
                    response.StatusCode,
                    "An unexpected error occurred",
                    _env.IsDevelopment() ? exception.Message : null
                );
                _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await response.WriteAsync(jsonResponse);
    }
}