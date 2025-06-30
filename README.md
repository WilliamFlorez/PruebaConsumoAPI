# PruebaConsumoAPI
Prueba Técnica empresa Godoy Córdoba
# Aplicación de api CatFacts + Giphy
  ->CatFact: traer información
  ->Giphy: traer una imagen usando las 3 primerar palabras de la información de los gatos
## Requisitos
  - .NET 8 SDK
  - XAMPP con MySQL
## Configuración Backend

1. Clonar repositorio:
   git clone [url del repositorio]
   cd ProyectoAPI/Backend
   dotnet respore
Para configurar el Backend se debe de ingresar a la carpeta Backend y descargar las siguientes dependencias para el funiconamiento del backend(Dependencias usadas tambien en el archivo dependencies.txt).
  dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.6 
  dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.6
  dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.6
  dotnet add package System.Net.Http.Json --version 9.0.0  

 2. Creación de Base de datos. se enciende MySQL de XAMPP y segunn las credenciales de usuario que tiene se modifica la variable DefaultConnection del archivo Backend/appsettings.json con las credenciales de usuario de PHPMyAdmin(las credenciales debe tener permisos para crear), ejemplo:
    
      "DefaultConnection":"Server=localhost;Database=catgifbd;User=root;Password=;"
    
Ahora que se establecio el usuario se hace la migración de la BD con os siguientes comandos:
        dotnet restore
        dotnet build
        dotnet ef migrations add InitialCreate 
        dotnet ef database update  
Este ultimo comando es para crear/actualizar la base de datos, si se desea modificar la estructura de la tabla ver la carpeta Backend/Migrations -> AppDbContextModelSnapshot.cs

  2.1 (OPCIONAL) Modificar los puertos.  
  En caso de conflicto con puertos de REACT verificar el archivo "Backend/Properties/launchSettings.json".
  
  Actualmente el puerto de .NET es 5210 y para REACT es 5173.

3. Endpoints .NET [Para mas explicación vease Archivo de la carpeta DOCS]
   -Se listan la los EndPoints, función, requerimientos y varibales retornadas. Estos se encuentran en CatGitController.cs, la url principal se define en FrontEnd como:
   *'http://localhost:5210/api'
   Usando esta url se le agregan los siguientes endpoints de Backend/Controllers/CatGitController.cs:
   
   * api/ : la ruta general/base,definida en el frontend.
   * fact : se optiene el valor del "fact"(dato) y en el frontend se manipula la información.
   * gif : usando el apikey y 3 palabras de FACT se optiene una url que tiene una foto, el url es enviado al frontend para ser enseñado.
   * history : consulta con base de datos.
   * history/delete : usando el ID de elementos especificos de history se envia petición de eliminar elemento de BD y la interfaz de historial.

FRONTEND REACT VITE:

  4. Cambiar el puerto para acceso a BackEnd
En caso de haber cambiado el puerto del backend del archivo CatGitController.cs, cambiar esta linea de FrontEnd/src/App.jsx:
    const API_BASE_URL = 'http://localhost: ->{NUEVO PUERTO}<- /api';
    
5. EJECUTAR
   
  5.1 En una consola ejecutar BACKEND .NET con el comando:
      cd Backend
      dotnet run
  5.2 En una consola diferente ejecutar Frontend REACT con el comando:
      cd FrontEnd
      npm run dev



