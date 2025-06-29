using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/")]
public class CatGifController : ControllerBase{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _context;

    public CatGifController(HttpClient httpClient, AppDbContext context)
    {
        _httpClient = httpClient;
        _context = context;
    }




    [HttpGet("fact")]
    public async Task<IActionResult> GetRandomCatFact()
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<CatFactResponse>("https://catfact.ninja/fact");
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al obtener el hecho: {ex.Message}");
        }
    }

    [HttpPost("gif")] //
    public async Task<IActionResult> SearchGif([FromBody] GifSearchRequest request){
        try
        {
            // 1. Buscar en Giphy API
            var apiKey = "voaNIOg1u7ONPbckzWK71C48YqCOkhVP";
            var url = $"https://api.giphy.com/v1/gifs/search?api_key={apiKey}&q={request.Query}&limit=1";
            
            var response = await _httpClient.GetFromJsonAsync<GiphyResponse>(url);
            var gifUrl = response?.Data?.FirstOrDefault()?.Images?.Original?.Url;

            // 2. Guardar en base de datos
            var history = new SearchHistory
            {
                SearchDate = DateTime.Now,
                Fact = request.Fact ?? request.Query, 
                Query = request.Query,
                GifUrl = gifUrl ?? string.Empty
            };

            await _context.SearchHistories.AddAsync(history);
            await _context.SaveChangesAsync();

            // 3. Retornar respuesta
            return Ok(new { Url = gifUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al buscar GIF: {ex.Message}");
        }
    }

        public class GifSearchRequest
        {
            public string Query { get; set; }
            public string Fact { get; set; }
        }


    [HttpGet("history")]
    public async Task<IActionResult> GetSearchHistory()    {
        try
        {
            var history = await _context.SearchHistories
                .OrderByDescending(h => h.SearchDate)
                .Take(20) // Limitar a 20 resultados
                .ToListAsync();
                
            return Ok(history);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al obtener historial: {ex.Message}");
        }
    }

    //Borrar dato
    [HttpDelete("history/delete")]
    public async Task<IActionResult> DeleteFact([FromBody] DeleteRequest request){
        
        try
        {
            var fact = await _context.SearchHistories.FindAsync(request.id);

            if (fact == null)
            {
                return NotFound($"No se encontro el Dato de gatos");
            }
            _context.SearchHistories.Remove(fact);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Dato de gatos eliminado", deletedId = request.id });

        }
        catch (Exception e) { return StatusCode(500, $"Error al obtener historial: {e.Message}"); }
        
    }
    //Clase para el request  de id  y hacer la eliminación
    // Recive el id enviado desde el front
        public class DeleteRequest{public int id { get; set; }}

    // Clases para deserialización
    private record CatFactResponse(string Fact);
    private record GiphyResponse(GifData[] Data);
    private record GifData(GifImages Images);
    private record GifImages(GifUrl Original);
    private record GifUrl(string Url);
}