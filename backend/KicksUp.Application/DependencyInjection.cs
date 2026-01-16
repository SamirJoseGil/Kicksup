using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace KicksUp.Application;

// Configuración de inyección de dependencias para la capa de aplicación
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;

        services.AddMediatR(configuration =>
            configuration.RegisterServicesFromAssembly(assembly));

        services.AddValidatorsFromAssembly(assembly);

        return services;
    }
}
