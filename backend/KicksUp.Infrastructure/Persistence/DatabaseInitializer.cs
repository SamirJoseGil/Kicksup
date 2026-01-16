using Npgsql;

namespace KicksUp.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static async Task EnsureDatabaseCreatedAsync(string connectionString)
    {
        // Extraer el nombre de la base de datos de la cadena de conexión
        var builder = new NpgsqlConnectionStringBuilder(connectionString);
        var databaseName = builder.Database;
        
        // Conectarse a la base de datos 'postgres' para crear nuestra base de datos
        builder.Database = "postgres";
        var masterConnectionString = builder.ToString();
        
        await using var connection = new NpgsqlConnection(masterConnectionString);
        await connection.OpenAsync();
        
        // Verificar si la base de datos existe
        await using (var checkCmd = new NpgsqlCommand(
            $"SELECT 1 FROM pg_database WHERE datname = '{databaseName}'", connection))
        {
            var exists = await checkCmd.ExecuteScalarAsync();
            
            if (exists == null)
            {
                // Crear la base de datos
                await using var createCmd = new NpgsqlCommand(
                    $"CREATE DATABASE {databaseName}", connection);
                await createCmd.ExecuteNonQueryAsync();
                Console.WriteLine($"✓ Base de datos '{databaseName}' creada exitosamente");
            }
            else
            {
                Console.WriteLine($"✓ Base de datos '{databaseName}' ya existe");
            }
        }
    }
}
