namespace WebApplication1;

public sealed class CellModel
{
    public Position Position { get; set; }
    public CellValue? Value { get; set; }
}

public record Position(int X, int Y);

public enum CellValue
{
    Zero=0,
    Cross=1
}