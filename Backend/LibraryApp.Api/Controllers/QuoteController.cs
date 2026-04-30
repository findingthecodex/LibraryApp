using LibraryApp.Api.Data;
using LibraryApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuotesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quote>>> GetQuotes()
    {
        return await _context.Quotes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Quote>> GetQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null)
            return NotFound();
        return quote;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Quote>> CreateQuote(Quote quote)
    {
        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetQuote), new { id = quote.Id }, quote);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuote(int id, Quote quote)
    {
        if (id != quote.Id)
            return BadRequest();

        _context.Entry(quote).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null)
            return NotFound();

        _context.Quotes.Remove(quote);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}