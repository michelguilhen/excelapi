using System.Linq;
using System.Threading.Tasks;
using Capgemini.PMESP.SpreadsheetImport.Controllers.ViewModels;
using Capgemini.PMESP.SpreadsheetImport.Db;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Capgemini.PMESP.SpreadsheetImport.Services.Interfaces;

namespace Capgemini.PMESP.SpreadsheetImport.Controllers
{
    [ApiController]
    [Route("api/import")]
    public class ImportController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IImportService _importService;

        public ImportController(DataContext context, IImportService importService)
        {
            _context = context;
            _importService = importService;
        }

        [HttpGet]
        public async Task<IActionResult> GetImports()
        {
            var imports = await _context.Imports.Include(i => i.Products).ToListAsync();
            return Ok(imports.Select(s => new ImportViewModel(s)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImportById(int id)
        {
            var products = await _context.Products.Where(p => p.Import.Id == id).ToListAsync();

            if (products.Count > 0)
            {
                return Ok(products.Select(s => new ProductViewModel(s)));
            }

            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> UpdloadImport(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest();
            }

            var response = await _importService.CreateImportAsync(file);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }
    }
}