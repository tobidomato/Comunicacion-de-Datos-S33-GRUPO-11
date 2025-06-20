CREATE DATABASE Comunicacion;
GO 

USE Comunicacion;
GO

CREATE TABLE dbo.Estadisticas (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Resolution VARCHAR(20) NOT NULL,
        BitDepth INT NOT NULL,
        ImageSizeBytes INT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );

-- Crear login con autenticación SQL
CREATE LOGIN nodeuserr WITH PASSWORD = 'TuContraseñaSegura124';
GO

-- Dar acceso a la base de datos comunicacion
USE Comunicacion;
GO

-- Crear usuario para el login en la base
CREATE USER nodeuserr FOR LOGIN nodeuserr;
GO

-- Asignar roles (lectura y escritura)
EXEC sp_addrolemember N'db_datareader', N'nodeuserr';
EXEC sp_addrolemember N'db_datawriter', N'nodeuserr';
GO

USE Comunicacion;
GO

GRANT INSERT ON dbo.Estadisticas TO nodeuserr;
GO

select * from Estadisticas