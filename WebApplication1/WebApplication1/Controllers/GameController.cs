using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{
    [HttpGet(Name = "GetField")]
    public IEnumerable<IEnumerable<CellModel>> Get()
    {
        return new[]
        {
            new CellModel[]
            {
                new() { Position = new Position(0, 0) },
                new() { Position = new Position(0, 1) },
                new() { Position = new Position(0, 2) }
            },
            new CellModel[]
            {
                new() { Position = new Position(1, 0) },
                new() { Position = new Position(1, 1) },
                new() { Position = new Position(1, 2) }
            },
            new CellModel[]
            {
                new() { Position = new Position(2, 0) },
                new() { Position = new Position(2, 1) },
                new() { Position = new Position(2, 2) }
            },
        };
    }
    [HttpPost("ServerMove")]
    public IEnumerable<IEnumerable<CellModel>> ServerMove([FromBody]IEnumerable<IEnumerable<CellModel>> field, [FromQuery] CellValue value)
    {
        var cells = field.SelectMany(x => x).ToList();
        var freeIndexes = cells.Select((c, i) => (c, i)).Where(x => x.c.Value == null).Select(x => x.i).ToArray();
        if (freeIndexes.Length > 0)
        {
            var randomIndex = new Random().Next(freeIndexes.Length);
            cells[freeIndexes[randomIndex]].Value = value;
        }

        return Enumerable.Range(0, 3).Select(x =>
            Enumerable.Range(0, 3).Select(i => cells[3 * x + i]));
    }
}