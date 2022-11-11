using System.Collections.Generic;
using System.Reflection.Metadata;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace WordPadcc.Models
{
    public class WordPadDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // optionsBuilder.UseNpgsql("Host=localhost;Database=WordPadCC;Username=postgres;Password=1996");
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WordPad>().HasIndex(wp => wp.Url).IsUnique(true);
        }

        public DbSet<WordPad> WordPads { get; set; }

        public WordPadDbContext(DbContextOptions<WordPadDbContext> options) : base(options) { }
    }
}
