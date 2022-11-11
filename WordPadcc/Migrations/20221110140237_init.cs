using Microsoft.EntityFrameworkCore.Migrations;

namespace WordPadcc.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WordPadCC",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(maxLength: 20, nullable: true),
                    Url = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WordPadCC", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WordPadCC_Url",
                table: "WordPadCC",
                column: "Url",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WordPadCC");
        }
    }
}
