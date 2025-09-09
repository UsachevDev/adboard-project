using AdBoard.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Interfaces
{
    public interface ICategoryService
    {
        public Task<Category> GetCategoryById(Guid id);
        public Task<IEnumerable<Category>> GetCategories();

    }
}
