using AdBoard.DAL;
using AdBoard.DAL.Entities;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly AdBoardDbContext _dbContext;
        public CategoryService(AdBoardDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IEnumerable<Category>> GetCategories()
        {
            var categories = await _dbContext.Categories
                .AsNoTracking()
                .Include(c => c.Subcategories)
                .ToListAsync();

            return categories;
        }

        public async Task<Category> GetCategoryById(Guid id)
        {
            var category = await _dbContext.Categories
                .AsNoTracking()
                .Include(c => c.Subcategories)
                .FirstOrDefaultAsync(x => x.Id == id)
                ?? throw new NotFoundException("Категория с таким ID не найдена");

            return category;
        }
    }
}
