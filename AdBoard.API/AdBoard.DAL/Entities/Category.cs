using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public class Category
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
}
