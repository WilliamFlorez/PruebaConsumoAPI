using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/")]
public class CatGifController : ControllerBase
{
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

    [HttpGet("gif")]
    public async Task<IActionResult> SearchGif([FromQuery] string query, [FromQuery] string fact)
    {
        try
        {
            var apiKey = "voaNIOg1u7ONPbckzWK71C48YqCOkhVP";
            var url = $"https://api.giphy.com/v1/gifs/search?api_key={apiKey}&q={query}&limit=1";
            
            var response = await _httpClient.GetFromJsonAsync<GiphyResponse>(url);
            var gifUrl = response?.Data?.FirstOrDefault()?.Images?.Original?.Url;

            // Guardar en historial
            var history = new SearchHistory
            {
                SearchDate = DateTime.Now,
                Fact = fact,
                Query = query,
                GifUrl = gifUrl ?? string.Empty
            };

            await _context.SearchHistories.AddAsync(history);
            await _context.SaveChangesAsync();

            return Ok(new { Url = gifUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al buscar GIF: {ex.Message}");
        }
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetSearchHistory()
    {
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

    // Clases para deserialización
    private record CatFactResponse(string Fact);
    private record GiphyResponse(GifData[] Data);
    private record GifData(GifImages Images);
    private record GifImages(GifUrl Original);
    private record GifUrl(string Url);
}